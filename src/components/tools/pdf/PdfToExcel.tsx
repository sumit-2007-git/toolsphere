import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadBlob, formatBytes } from '../../../utils/fileUtils';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { Table, Download, Loader2 } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const PdfToExcel: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
      const rows: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        let currentLine = '';

        textContent.items.forEach((item: any) => {
          if (item.str) {
            currentLine += (currentLine ? '\t' : '') + item.str;
            if (item.hasEOL) {
              rows.push(currentLine.split('\t'));
              currentLine = '';
            }
          }
        });
        if (currentLine) rows.push(currentLine.split('\t'));
      }

      const rowCount = Math.max(rows.length, 1);
      const colCount = Math.max(...rows.map((r) => r.length), 1);
      const lastColLetter = String.fromCharCode(65 + Math.min(colCount - 1, 25));

      // Generate genuine .xlsx ZIP archive
      const zip = new JSZip();

      zip.file(
        '[Content_Types].xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>`
      );

      zip.folder('_rels')?.file(
        '.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`
      );

      zip.folder('xl')?.file(
        'workbook.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Extracted Data" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
      );

      zip.folder('xl/_rels')?.file(
        'workbook.xml.rels',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>`
      );

      // Construct sheet data rows
      const rowXml = rows
        .map((row, rIdx) => {
          const cellsXml = row
            .map((cell, cIdx) => {
              const colLetter = String.fromCharCode(65 + (cIdx % 26));
              const ref = `${colLetter}${rIdx + 1}`;
              const trimmed = cell.trim();
              const isNum = trimmed !== '' && !isNaN(Number(trimmed));

              if (isNum) {
                return `<c r="${ref}"><v>${trimmed}</v></c>`;
              }

              const safeText = cell
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
              return `<c r="${ref}" t="inlineStr"><is><t>${safeText}</t></is></c>`;
            })
            .join('');
          return `<row r="${rIdx + 1}">${cellsXml}</row>`;
        })
        .join('');

      zip.folder('xl/worksheets')?.file(
        'sheet1.xml',
        `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <dimension ref="A1:${lastColLetter}${rowCount}"/>
  <sheetViews>
    <sheetView tabSelected="1" workbookViewId="0"/>
  </sheetViews>
  <sheetFormatPr defaultRowHeight="15"/>
  <sheetData>${rowXml}</sheetData>
</worksheet>`
      );

      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      setXlsxBlob(blob);
      addToast('success', 'PDF converted to Excel (.xlsx) spreadsheet!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!xlsxBlob || !file[0]) return;
    const name = file[0].name.replace(/\.pdf$/i, '');
    downloadBlob(xlsxBlob, `${name}.xlsx`);
    addToast('info', 'Downloaded Excel XLSX');
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
            setXlsxBlob(null);
          }}
          title="Upload PDF to convert to Excel (XLSX)"
          subtitle="Extract structured tabular data straight into spreadsheet cells"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{file[0].name}</p>
              <p className="text-xs text-slate-400">{formatBytes(file[0].size)}</p>
            </div>
          </div>

          {xlsxBlob ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download XLSX</span>
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
                  <span>Extracting Spreadsheet...</span>
                </>
              ) : (
                <>
                  <Table className="w-4 h-4" />
                  <span>Convert to EXCEL</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
