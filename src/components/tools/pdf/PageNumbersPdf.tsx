import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { addPageNumbersToPdf } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { Hash, Download, Loader2 } from 'lucide-react';

export const PageNumbersPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [position, setPosition] = useState<'bottom-right' | 'bottom-center' | 'top-right'>('bottom-right');
  const [format, setFormat] = useState<'Page X of Y' | 'X / Y' | 'X' | '- X -'>('Page X of Y');
  const [startFrom, setStartFrom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddPageNumbers = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const resultBytes = await addPageNumbersToPdf(buf, {
        position,
        format,
        startFrom,
      });

      downloadPdf(resultBytes, `${file[0].name.replace('.pdf', '')}_numbered.pdf`);
      addToast('success', 'Page numbers successfully inserted!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to add page numbers', err.message);
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
          onFilesChange={setFile}
          title="Upload PDF to add page numbers"
          subtitle="Insert clean pagination on header or footer"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Position on Page
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'top-right', label: 'Top Right' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPosition(p.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                      position === p.id
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Numbering Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Page X of Y', 'X / Y', 'X', '- X -'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                      format === f
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Start Numbering From
            </label>
            <input
              type="number"
              min="1"
              value={startFrom}
              onChange={(e) => setStartFrom(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleAddPageNumbers}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding Numbers...</span>
                </>
              ) : (
                <>
                  <Hash className="w-4 h-4" />
                  <span>Add Page Numbers & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
