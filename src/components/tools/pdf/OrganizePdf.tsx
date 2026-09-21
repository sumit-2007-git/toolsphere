import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { organizePdf, getPdfPageCount } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { Layers, ArrowLeft, ArrowRight, Trash2, Copy, Download, Loader2, RefreshCw } from 'lucide-react';

export const OrganizePdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [pagesOrder, setPagesOrder] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (files: File[]) => {
    setFile(files);
    if (files[0]) {
      try {
        const buf = await readFileAsArrayBuffer(files[0]);
        const count = await getPdfPageCount(buf);
        setPagesOrder(Array.from({ length: count }, (_, i) => i));
      } catch {
        setPagesOrder([]);
      }
    } else {
      setPagesOrder([]);
    }
  };

  const moveLeft = (index: number) => {
    if (index === 0) return;
    const newOrder = [...pagesOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index - 1];
    newOrder[index - 1] = temp;
    setPagesOrder(newOrder);
  };

  const moveRight = (index: number) => {
    if (index === pagesOrder.length - 1) return;
    const newOrder = [...pagesOrder];
    const temp = newOrder[index];
    newOrder[index] = newOrder[index + 1];
    newOrder[index + 1] = temp;
    setPagesOrder(newOrder);
  };

  const deletePage = (index: number) => {
    if (pagesOrder.length <= 1) {
      addToast('error', 'Cannot delete the only page left.');
      return;
    }
    setPagesOrder(pagesOrder.filter((_, i) => i !== index));
  };

  const duplicatePage = (index: number) => {
    const newOrder = [...pagesOrder];
    newOrder.splice(index + 1, 0, pagesOrder[index]);
    setPagesOrder(newOrder);
    addToast('info', 'Page duplicated');
  };

  const handleSave = async () => {
    if (!file[0] || pagesOrder.length === 0) return;

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const organizedBytes = await organizePdf(buf, pagesOrder);
      downloadPdf(organizedBytes, `${file[0].name.replace('.pdf', '')}_organized.pdf`);
      addToast('success', 'Organized PDF downloaded!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to save organized PDF', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={file}
          onFilesChange={handleFileChange}
          title="Upload a PDF file to organize"
          subtitle="Reorder, duplicate, or delete specific pages"
          buttonLabel="Select PDF File"
        />
      </div>

      {pagesOrder.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-500" />
                <span>Document Pages ({pagesOrder.length} pages in export)</span>
              </h3>
              <p className="text-xs text-slate-500">Reorder with arrows, duplicate or delete individual pages.</p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Save Organized PDF</span>
                </>
              )}
            </button>
          </div>

          {/* Grid of pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pagesOrder.map((pageOriginalIndex, currentPosition) => (
              <div
                key={`${pageOriginalIndex}-${currentPosition}`}
                className="flex flex-col justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-brand-300 transition-all shadow-2xs"
              >
                <div className="aspect-[3/4] w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-2 relative shadow-inner">
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                    #{currentPosition + 1}
                  </span>
                  <div className="text-center space-y-1">
                    <span className="text-xs text-slate-400">Orig Page</span>
                    <p className="text-xl font-black text-slate-700 dark:text-slate-300">
                      {pageOriginalIndex + 1}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between gap-1">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => moveLeft(currentPosition)}
                      disabled={currentPosition === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                      title="Move left"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRight(currentPosition)}
                      disabled={currentPosition === pagesOrder.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                      title="Move right"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => duplicatePage(currentPosition)}
                      className="p-1 rounded text-slate-400 hover:text-brand-500"
                      title="Duplicate page"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePage(currentPosition)}
                      className="p-1 rounded text-slate-400 hover:text-red-500"
                      title="Delete page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
