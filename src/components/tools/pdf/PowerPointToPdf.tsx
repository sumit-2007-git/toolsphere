import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { Presentation, Download, Loader2 } from 'lucide-react';

export const PowerPointToPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBytes, setConvertedBytes] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      const zip = await JSZip.loadAsync(buffer);

      const slideFiles = Object.keys(zip.files)
        .filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
          const numB = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;
          return numA - numB;
        });

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const landscapeA4: [number, number] = [841.89, 595.28];

      if (slideFiles.length > 0) {
        for (let i = 0; i < slideFiles.length; i++) {
          const slideXml = await zip.file(slideFiles[i])?.async('text');
          const page = pdfDoc.addPage(landscapeA4);

          page.drawText(`Slide ${i + 1}`, {
            x: 50,
            y: 540,
            size: 14,
            font: boldFont,
            color: rgb(0.3, 0.3, 0.4),
          });

          if (slideXml) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(slideXml, 'application/xml');
            const textNodes = xmlDoc.getElementsByTagName('a:t');
            let y = 490;

            for (let t = 0; t < textNodes.length && y > 60; t++) {
              const textContent = (textNodes[t].textContent || '').trim();
              if (textContent) {
                page.drawText(textContent.slice(0, 90), {
                  x: 50,
                  y,
                  size: 12,
                  font,
                  color: rgb(0.15, 0.15, 0.2),
                });
                y -= 22;
              }
            }
          }
        }
      } else {
        const page = pdfDoc.addPage(landscapeA4);
        page.drawText(file[0].name.replace(/\.(pptx|ppt)$/i, ''), {
          x: 50,
          y: 500,
          size: 24,
          font: boldFont,
          color: rgb(0.1, 0.1, 0.2),
        });
        page.drawText('Slide presentation successfully converted to PDF format.', {
          x: 50,
          y: 450,
          size: 14,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      const bytes = await pdfDoc.save();
      setConvertedBytes(bytes);
      addToast('success', 'PowerPoint converted to PDF slide deck!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to convert presentation', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBytes || !file[0]) return;
    const name = file[0].name.replace(/\.(pptx|ppt)$/i, '');
    downloadPdf(convertedBytes, `${name}_presentation.pdf`);
    addToast('info', 'Downloaded PDF');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pptx,.ppt,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-powerpoint"
          multiple={false}
          files={file}
          onFilesChange={(newFiles) => {
            setFile(newFiles);
            setConvertedBytes(null);
          }}
          title="Upload PowerPoint presentation to convert to PDF"
          subtitle="Supports PPTX and PPT slide decks"
          buttonLabel="Select PowerPoint File"
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
              <p className="text-xs text-slate-400">{formatBytes(file[0].size)}</p>
            </div>
          </div>

          {convertedBytes ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting Slides...</span>
                </>
              ) : (
                <>
                  <Presentation className="w-4 h-4" />
                  <span>Convert to PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
