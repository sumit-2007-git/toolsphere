import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadBlob } from '../../../utils/fileUtils';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Image as ImageIcon, Download, Loader2, FileCheck, Layers } from 'lucide-react';

// Setup pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const PdfToJpg: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [renderedPages, setRenderedPages] = useState<{ pageNum: number; dataUrl: string; blob: Blob }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

  const handleFileChange = (newFiles: File[]) => {
    setFile(newFiles);
    setRenderedPages([]);
    setProgress(null);
  };

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
      const pdf = await loadingTask.promise;
      const total = pdf.numPages;

      const results: { pageNum: number; dataUrl: string; blob: Blob }[] = [];

      for (let pageNum = 1; pageNum <= total; pageNum++) {
        setProgress({ current: pageNum, total });
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 1.5 }); // High resolution

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) continue;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b || new Blob()), 'image/jpeg', 0.92);
        });

        results.push({ pageNum, dataUrl, blob });
      }

      setRenderedPages(results);
      addToast('success', `Successfully converted ${results.length} pages to JPG!`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const downloadSinglePage = (page: { pageNum: number; blob: Blob }) => {
    const baseName = file[0]?.name.replace('.pdf', '') || 'document';
    downloadBlob(page.blob, `${baseName}_page_${page.pageNum}.jpg`);
    addToast('info', `Downloaded page ${page.pageNum} as JPG`);
  };

  const downloadAllZip = async () => {
    if (renderedPages.length === 0 || !file[0]) return;
    try {
      const zip = new JSZip();
      const baseName = file[0].name.replace('.pdf', '');

      renderedPages.forEach((p) => {
        zip.file(`${baseName}_page_${p.pageNum}.jpg`, p.blob);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `${baseName}_jpg_images.zip`);
      addToast('success', 'Downloaded all pages as ZIP archive!');
    } catch (e: any) {
      addToast('error', 'Failed to generate ZIP', e.message);
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
          title="Upload a PDF file to convert to JPG"
          subtitle="Extract high-resolution JPG images from every page"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && renderedPages.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-slate-800 dark:text-slate-100">{file[0].name}</span>
          </div>

          <button
            type="button"
            onClick={handleConvert}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {progress ? `Rendering page ${progress.current} of ${progress.total}...` : 'Initializing conversion...'}
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" />
                <span>Convert to JPG Images</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Rendered images gallery */}
      {renderedPages.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Converted Pages ({renderedPages.length} Images)
              </h3>
              <p className="text-xs text-slate-500">Download individual pages or the full bundle as a ZIP archive.</p>
            </div>

            <button
              type="button"
              onClick={downloadAllZip}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download All as ZIP</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderedPages.map((page) => (
              <div
                key={page.pageNum}
                className="group relative rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40 p-3 flex flex-col justify-between"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-lg bg-white shadow-xs flex items-center justify-center">
                  <img
                    src={page.dataUrl}
                    alt={`Page ${page.pageNum}`}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Page {page.pageNum}
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadSinglePage(page)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-brand-600 hover:border-brand-300 border border-slate-200 dark:border-slate-700 text-xs font-medium flex items-center gap-1 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>JPG</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
