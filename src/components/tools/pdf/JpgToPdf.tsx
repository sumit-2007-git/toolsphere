import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadBlob, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { PDFDocument, PageSizes } from 'pdf-lib';
import { FileImage, Download, Loader2, ArrowUp, ArrowDown, Trash2, Settings } from 'lucide-react';

export const JpgToPdf: React.FC = () => {
  const { addToast } = useApp();
  const [files, setFiles] = useState<File[]>([]);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'none' | 'small' | 'big'>('small');
  const [isProcessing, setIsProcessing] = useState(false);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...files];
    const temp = next[index];
    next[index] = next[index - 1];
    next[index - 1] = temp;
    setFiles(next);
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    const next = [...files];
    const temp = next[index];
    next[index] = next[index + 1];
    next[index + 1] = temp;
    setFiles(next);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      addToast('error', 'Please upload at least one image.');
      return;
    }

    try {
      setIsProcessing(true);
      const pdfDoc = await PDFDocument.create();

      const marginSize = margin === 'none' ? 0 : margin === 'small' ? 20 : 40;
      const baseSize: [number, number] = orientation === 'portrait'
        ? [PageSizes.A4[0], PageSizes.A4[1]]
        : [PageSizes.A4[1], PageSizes.A4[0]];

      for (const file of files) {
        const arrayBuf = await readFileAsArrayBuffer(file);
        let embeddedImage;

        if (file.type.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(arrayBuf);
        } else {
          // JPG / WebP via canvas fallback if needed or direct embed
          try {
            embeddedImage = await pdfDoc.embedJpg(arrayBuf);
          } catch {
            // Draw into canvas to convert to clean JPEG
            const dataUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });
            const img = new Image();
            img.src = dataUrl;
            await new Promise((res) => { img.onload = res; });
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
            const jpegDataUrl = canvas.toDataURL('image/jpeg', 0.95);
            embeddedImage = await pdfDoc.embedJpg(jpegDataUrl);
          }
        }

        const page = pdfDoc.addPage(baseSize);
        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();

        const availableWidth = pageWidth - marginSize * 2;
        const availableHeight = pageHeight - marginSize * 2;

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;
        const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);

        const drawWidth = imgWidth * ratio;
        const drawHeight = imgHeight * ratio;

        const x = marginSize + (availableWidth - drawWidth) / 2;
        const y = marginSize + (availableHeight - drawHeight) / 2;

        page.drawImage(embeddedImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, 'images_document.pdf');
      addToast('success', 'PDF successfully generated from images!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to convert images to PDF', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept="image/png,image/jpeg,image/webp,.jpg,.jpeg,.png,.webp"
          multiple={true}
          maxFiles={50}
          files={files}
          onFilesChange={setFiles}
          title="Upload images to convert to PDF"
          subtitle="Supports JPG, PNG, and WebP photos and documents"
          buttonLabel="Select Images"
        />
      </div>

      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Settings Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Page Orientation
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    orientation === 'portrait'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  Portrait (Vertical)
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    orientation === 'landscape'
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  Landscape (Horizontal)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Page Margin
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['none', 'small', 'big'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMargin(m)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border capitalize transition-all ${
                      margin === m
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Arrange Images Order ({files.length} images)
            </h4>
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex items-center gap-3 min-w-0 pr-4">
                  <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </p>
                  <span className="text-[11px] text-slate-400 font-mono">({formatBytes(file.size)})</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === files.length - 1}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Convert & Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
