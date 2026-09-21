import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { mergePdfs } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { ArrowUp, ArrowDown, Trash2, Files, Download, Loader2, CheckCircle2 } from 'lucide-react';

export const MergePdf: React.FC = () => {
  const { addToast } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadReady, setDownloadReady] = useState<Uint8Array | null>(null);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index - 1];
    newFiles[index - 1] = temp;
    setFiles(newFiles);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + 1];
    newFiles[index + 1] = temp;
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    setDownloadReady(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      addToast('error', 'Please select at least 2 PDF files to merge.');
      return;
    }

    try {
      setIsProcessing(true);
      const buffers: ArrayBuffer[] = [];
      for (const file of files) {
        const buf = await readFileAsArrayBuffer(file);
        buffers.push(buf);
      }

      const mergedBytes = await mergePdfs(buffers);
      setDownloadReady(mergedBytes);
      addToast('success', 'PDF files successfully merged!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to merge PDFs', err.message || 'Check if files are valid and uncorrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadReady) return;
    downloadPdf(downloadReady, 'merged-document.pdf');
    addToast('info', 'Merged PDF downloaded');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* File Upload Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={true}
          maxFiles={30}
          files={files}
          onFilesChange={(newFiles) => {
            setFiles(newFiles);
            setDownloadReady(null);
          }}
          title="Upload multiple PDF files to merge"
          subtitle="Drag & drop PDFs or click to browse"
          buttonLabel="Select PDF Files"
        />
      </div>

      {/* Files Ordering List */}
      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Files className="w-4 h-4 text-brand-500" />
              <span>Arrange Merge Order ({files.length} files)</span>
            </h3>
            <span className="text-xs text-slate-500">
              Total Size: {formatBytes(files.reduce((acc, f) => acc + f.size, 0))}
            </span>
          </div>

          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            {downloadReady ? (
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-500/25 transition-all text-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Merged PDF</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Merging PDFs...</span>
                  </>
                ) : (
                  <>
                    <Files className="w-4 h-4" />
                    <span>Merge {files.length} PDFs</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
