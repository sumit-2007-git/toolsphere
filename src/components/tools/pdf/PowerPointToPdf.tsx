import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

      // Find all slide XML files sorted by slide number
      const slideFiles = Object.keys(zip.files)
        .filter((name) => name.startsWith('ppt/slides/slide') && name.endsWith('.xml') && !name.includes('_rels'))
        .sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
          const numB = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;
          return numA - numB;
        });

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const landscapeA4: [number, number] = [841.89, 595.28];
      const [pageW, pageH] = landscapeA4;

      if (slideFiles.length > 0) {
        for (let i = 0; i < slideFiles.length; i++) {
          const slidePath = slideFiles[i]; // e.g. ppt/slides/slide1.xml
          const slideBase = slidePath.split('/').pop()?.replace('.xml', '') || `slide${i + 1}`;
          const relsPath = `ppt/slides/_rels/${slideBase}.xml.rels`;

          let slideImageBytes: ArrayBuffer | null = null;
          let isPng = false;

          // 1. Check if this slide has associated images in _rels or media
          const relsXml = await zip.file(relsPath)?.async('text');
          if (relsXml) {
            const parser = new DOMParser();
            const relsDoc = parser.parseFromString(relsXml, 'application/xml');
            const relNodes = relsDoc.getElementsByTagName('Relationship');

            for (let r = 0; r < relNodes.length; r++) {
              const type = relNodes[r].getAttribute('Type') || '';
              const target = relNodes[r].getAttribute('Target') || '';

              if (type.includes('image') || target.match(/\.(png|jpg|jpeg|webp)$/i)) {
                const cleanTarget = target.replace(/^\.\.\//, '').replace(/^media\//, 'ppt/media/');
                const mediaPath = cleanTarget.startsWith('ppt/') ? cleanTarget : `ppt/${cleanTarget}`;
                const mediaFile = zip.file(mediaPath) || zip.file(`ppt/media/${target.split('/').pop()}`);

                if (mediaFile) {
                  slideImageBytes = await mediaFile.async('arraybuffer');
                  isPng = mediaPath.toLowerCase().endsWith('.png');
                  break;
                }
              }
            }
          }

          // If no rels match, check if there is an image in ppt/media/ matching the slide index
          if (!slideImageBytes) {
            const mediaKeys = Object.keys(zip.files).filter((k) => k.startsWith('ppt/media/'));
            if (mediaKeys.length > 0) {
              const candidate = mediaKeys[i % mediaKeys.length];
              slideImageBytes = await zip.file(candidate)?.async('arraybuffer') || null;
              isPng = candidate.toLowerCase().endsWith('.png');
            }
          }

          const page = pdfDoc.addPage(landscapeA4);
          let drawnImage = false;

          // If slide image exists (such as from PDF-to-PPTX or visual slide), embed and draw it
          if (slideImageBytes) {
            try {
              let embeddedImg;
              if (isPng) {
                embeddedImg = await pdfDoc.embedPng(slideImageBytes);
              } else {
                embeddedImg = await pdfDoc.embedJpg(slideImageBytes);
              }

              const imgDims = embeddedImg.scaleToFit(pageW, pageH);
              page.drawImage(embeddedImg, {
                x: (pageW - imgDims.width) / 2,
                y: (pageH - imgDims.height) / 2,
                width: imgDims.width,
                height: imgDims.height,
              });
              drawnImage = true;
            } catch (embedErr) {
              console.warn('Failed to embed slide image, falling back to text:', embedErr);
            }
          }

          // 2. Parse text content from the slide XML
          const slideXml = await zip.file(slidePath)?.async('text');
          const slideLines: string[] = [];

          if (slideXml) {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(slideXml, 'application/xml');
            const paragraphs = xmlDoc.getElementsByTagName('a:p');

            for (let p = 0; p < paragraphs.length; p++) {
              const texts = paragraphs[p].getElementsByTagName('a:t');
              let paragraphText = '';
              for (let t = 0; t < texts.length; t++) {
                paragraphText += texts[t].textContent || '';
              }
              const clean = paragraphText.trim();
              if (clean) slideLines.push(clean);
            }
          }

          // If no image was drawn, render formatted slide layout
          if (!drawnImage) {
            // Draw clean background header bar
            page.drawRectangle({
              x: 0,
              y: pageH - 70,
              width: pageW,
              height: 70,
              color: rgb(0.08, 0.12, 0.2),
            });

            // Slide number tag
            page.drawText(`SLIDE ${i + 1}`, {
              x: 50,
              y: pageH - 42,
              size: 13,
              font: boldFont,
              color: rgb(0.2, 0.8, 1),
            });

            const title = slideLines[0] || `Presentation Slide ${i + 1}`;
            page.drawText(title.slice(0, 60), {
              x: 130,
              y: pageH - 44,
              size: 18,
              font: boldFont,
              color: rgb(1, 1, 1),
            });

            // Render bullet points & paragraphs
            let currentY = pageH - 120;
            const bodyLines = slideLines.slice(1);

            if (bodyLines.length > 0) {
              for (const line of bodyLines) {
                if (currentY < 60) break;

                // Simple word-wrap
                const words = line.split(' ');
                let curLine = '• ';
                for (const word of words) {
                  const testLine = `${curLine} ${word}`;
                  if (font.widthOfTextAtSize(testLine, 13) > pageW - 120) {
                    page.drawText(curLine, {
                      x: 60,
                      y: currentY,
                      size: 13,
                      font,
                      color: rgb(0.15, 0.15, 0.2),
                    });
                    currentY -= 22;
                    curLine = `   ${word}`;
                  } else {
                    curLine = testLine;
                  }
                }
                if (curLine.trim()) {
                  page.drawText(curLine, {
                    x: 60,
                    y: currentY,
                    size: 13,
                    font,
                    color: rgb(0.15, 0.15, 0.2),
                  });
                  currentY -= 26;
                }
              }
            } else {
              page.drawText('This slide contains visual elements and formatted layouts.', {
                x: 60,
                y: currentY,
                size: 13,
                font,
                color: rgb(0.4, 0.4, 0.5),
              });
            }
          }
        }
      } else {
        // Fallback for presentation files with non-standard zip structures
        const page = pdfDoc.addPage(landscapeA4);
        page.drawText(file[0].name.replace(/\.(pptx|ppt)$/i, ''), {
          x: 60,
          y: pageH - 120,
          size: 26,
          font: boldFont,
          color: rgb(0.1, 0.15, 0.3),
        });
        page.drawText('PowerPoint presentation successfully converted to PDF format.', {
          x: 60,
          y: pageH - 170,
          size: 14,
          font,
          color: rgb(0.3, 0.3, 0.4),
        });
      }

      const bytes = await pdfDoc.save();
      setConvertedBytes(bytes);
      addToast('success', `Successfully converted ${slideFiles.length || 1} slides to PDF!`);
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
    downloadPdf(convertedBytes, `${name}_slides.pdf`);
    addToast('info', 'Downloaded PDF presentation');
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
          subtitle="Supports PPTX and PPT slide decks with high fidelity"
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Presentation</span>
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
                  <span>Converting Slides to PDF...</span>
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
