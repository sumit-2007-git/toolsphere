import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadBlob, formatBytes } from '../../../utils/fileUtils';
import * as pdfjsLib from 'pdfjs-dist';
import pptxgen from 'pptxgenjs';
import { Presentation, Download, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const PdfToPowerpoint: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pptxBlob, setPptxBlob] = useState<Blob | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const totalPages = pdf.numPages;

      const pres = new pptxgen();
      pres.title = file[0].name.replace(/\.pdf$/i, '');
      pres.layout = 'LAYOUT_16x9';

      for (let i = 1; i <= totalPages; i++) {
        setProgress({ current: i, total: totalPages });
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x high definition

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imgData = canvas.toDataURL('image/png');

          const slide = pres.addSlide();
          // Embed page image covering the entire slide with high fidelity
          slide.addImage({
            data: imgData,
            x: 0,
            y: 0,
            w: '100%',
            h: '100%',
          });

          // Extract text and add to slide notes for searchability and copying
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str || '')
            .filter(Boolean)
            .join(' ');

          if (pageText.trim()) {
            slide.addNotes(pageText);
          }
        }
      }

      const blob = (await pres.write({ outputType: 'blob' })) as Blob;
      setPptxBlob(blob);
      addToast('success', `Converted all ${totalPages} pages to PowerPoint slide deck!`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleDownload = () => {
    if (!pptxBlob || !file[0]) return;
    const name = file[0].name.replace(/\.pdf$/i, '');
    downloadBlob(pptxBlob, `${name}.pptx`);
    addToast('info', 'Downloaded PowerPoint PPTX');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={file}
          onFilesChange={(newFiles) => {
            setFile(newFiles);
            setPptxBlob(null);
            setProgress(null);
          }}
          title="Upload PDF to convert to PowerPoint (PPTX)"
          subtitle="Turn every page into high-definition presentation slides"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{file[0].name}</p>
              <p className="text-xs text-slate-400">
                {formatBytes(file[0].size)}
                {progress && ` • Processing slide ${progress.current} of ${progress.total}`}
              </p>
            </div>
          </div>

          {pptxBlob ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PPTX</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {progress ? `Converting Slide ${progress.current}/${progress.total}...` : 'Processing...'}
                  </span>
                </>
              ) : (
                <>
                  <Presentation className="w-4 h-4" />
                  <span>Convert to POWERPOINT</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
