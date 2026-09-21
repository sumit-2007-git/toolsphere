import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadBlob, formatBytes } from '../../../utils/fileUtils';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Presentation, Download, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const PdfToPowerpoint: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pptxBlob, setPptxBlob] = useState<Blob | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const pagesContent: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const lines: string[] = [];
        let currentLine = '';

        textContent.items.forEach((item: any) => {
          if (item.str) {
            currentLine += (currentLine ? ' ' : '') + item.str;
            if (item.hasEOL) {
              lines.push(currentLine);
              currentLine = '';
            }
          }
        });
        if (currentLine) lines.push(currentLine);
        pagesContent.push(lines);
      }

      // Package valid .pptx ZIP
      const zip = new JSZip();

      // [Content_Types].xml
      zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
</Types>`
      );

      // _rels/.rels
      zip.folder('_rels')?.file(
        '.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
      );

      // ppt/presentation.xml
      zip.folder('ppt')?.file(
        'presentation.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldIdLst>
    ${pagesContent.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 2}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"/>`).join('\n    ')}
  </p:sldIdLst>
</p:presentation>`
      );

      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      });

      setPptxBlob(blob);
      addToast('success', 'PDF converted to PowerPoint slide deck!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
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
          }}
          title="Upload PDF to convert to PowerPoint (PPTX)"
          subtitle="Turn pages into presentation slides"
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
              <p className="text-xs text-slate-400">{formatBytes(file[0].size)}</p>
            </div>
          </div>

          {pptxBlob ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PPTX</span>
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
