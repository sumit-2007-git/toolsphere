import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { splitPdf, getPdfPageCount } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadBlob, downloadPdf } from '../../../utils/fileUtils';
import JSZip from 'jszip';
import { Split, Download, Loader2, FileCheck, Layers } from 'lucide-react';

export const SplitPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [mode, setMode] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (files: File[]) => {
    setFile(files);
    if (files.length > 0) {
      try {
        const buf = await readFileAsArrayBuffer(files[0]);
        const count = await getPdfPageCount(buf);
        setTotalPages(count);
        setCustomRange(`1-${Math.min(count, 3)}`);
      } catch (e) {
        console.error(e);
        setTotalPages(null);
      }
    } else {
      setTotalPages(null);
    }
  };

  const handleSplit = async () => {
    if (!file[0]) {
      addToast('error', 'Please upload a PDF to split.');
      return;
    }

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const rangeExpr = mode === 'all' ? 'all' : customRange;
      const splitResults = await splitPdf(buf, rangeExpr);

      if (splitResults.length === 0) {
        addToast('error', 'No pages matched the specified range.');
        return;
      }

      if (splitResults.length === 1) {
        // Single output file
        downloadPdf(splitResults[0].data, `${file[0].name.replace('.pdf', '')}_split.pdf`);
        addToast('success', 'Extracted PDF downloaded!');
      } else {
        // Multiple output files - bundle into zip
        const zip = new JSZip();
        splitResults.forEach((res, i) => {
          zip.file(res.filename, res.data);
        });
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        downloadBlob(zipBlob, `${file[0].name.replace('.pdf', '')}_split_pages.zip`);
        addToast('success', `Created ZIP with ${splitResults.length} PDF files!`);
      }
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to split PDF', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={file}
          onFilesChange={handleFileChange}
          title="Upload a PDF file to split"
          subtitle="Separate pages into distinct PDF files"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-brand-500" />
              <span className="font-bold text-slate-800 dark:text-slate-100">{file[0].name}</span>
            </div>
            {totalPages !== null && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </span>
            )}
          </div>

          {/* Split Mode Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode('all')}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                mode === 'all'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Split Every Page</p>
                <p className="text-xs text-slate-500 mt-1">Convert every single page into an individual PDF file (packaged in a ZIP).</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                mode === 'custom'
                  ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <Split className="w-5 h-5 text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Extract Custom Range</p>
                <p className="text-xs text-slate-500 mt-1">Extract specific pages or page ranges (e.g. 1-3, 5).</p>
              </div>
            </button>
          </div>

          {/* Custom range input */}
          {mode === 'custom' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Page Ranges (e.g., "1-2, 4" or "1-{totalPages || 'N'}")
              </label>
              <input
                type="text"
                value={customRange}
                onChange={(e) => setCustomRange(e.target.value)}
                placeholder="1-3, 5"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Use commas to separate independent page files or ranges (e.g. 1-5 extracts the first 5 pages).
              </p>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleSplit}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Splitting PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Process & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
