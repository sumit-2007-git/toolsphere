import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { rotatePdf, getPdfPageCount } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { RotateCw, RotateCcw, Download, Loader2, FileCheck } from 'lucide-react';

export const RotatePdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [rotation, setRotation] = useState<number>(90);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (files: File[]) => {
    setFile(files);
    if (files[0]) {
      try {
        const buf = await readFileAsArrayBuffer(files[0]);
        const count = await getPdfPageCount(buf);
        setTotalPages(count);
      } catch {
        setTotalPages(null);
      }
    }
  };

  const handleRotate = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const rotatedBytes = await rotatePdf(buf, rotation);
      downloadPdf(rotatedBytes, `${file[0].name.replace('.pdf', '')}_rotated_${rotation}deg.pdf`);
      addToast('success', `PDF rotated by ${rotation}° and downloaded!`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to rotate PDF', err.message);
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
          title="Upload a PDF file to rotate"
          subtitle="Rotate all pages clockwise or counterclockwise"
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
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {totalPages} Pages
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Choose Rotation Direction
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setRotation(90)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  rotation === 90
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <RotateCw className="w-6 h-6 text-brand-500" />
                <span className="text-sm font-bold">90° Clockwise</span>
                <span className="text-xs text-slate-400">Right turn</span>
              </button>

              <button
                type="button"
                onClick={() => setRotation(180)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  rotation === 180
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <RotateCw className="w-6 h-6 text-brand-500 transform rotate-90" />
                <span className="text-sm font-bold">180° Flip</span>
                <span className="text-xs text-slate-400">Upside down</span>
              </button>

              <button
                type="button"
                onClick={() => setRotation(270)}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  rotation === 270
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <RotateCcw className="w-6 h-6 text-brand-500" />
                <span className="text-sm font-bold">90° Counter-Clockwise</span>
                <span className="text-xs text-slate-400">Left turn</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleRotate}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Rotating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Rotate & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
