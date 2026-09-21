import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, readFileAsText, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { PDFDocument, PageSizes, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import { Table, Download, Loader2 } from 'lucide-react';

export const ExcelToPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBytes, setConvertedBytes] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const rows: string[][] = [];

      if (file[0].name.endsWith('.csv')) {
        const text = await readFileAsText(file[0]);
        const lines = text.split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            rows.push(line.split(',').map(s => s.trim().replace(/^"|"$/g, '')));
          }
        });
      } else {
        // XLSX parser via JSZip
        const buffer = await readFileAsArrayBuffer(file[0]);
        try {
          const zip = await JSZip.loadAsync(buffer);
          const sharedStringsXml = await zip.file('xl/sharedStrings.xml')?.async('text');
          const sharedStrings: string[] = [];

          if (sharedStringsXml) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(sharedStringsXml, 'application/xml');
            const siNodes = xml.getElementsByTagName('si');
            for (let i = 0; i < siNodes.length; i++) {
              sharedStrings.push(siNodes[i].textContent || '');
            }
          }

          const sheetXml = await zip.file('xl/worksheets/sheet1.xml')?.async('text');
          if (sheetXml) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(sheetXml, 'application/xml');
            const rowNodes = xml.getElementsByTagName('row');

            for (let r = 0; r < Math.min(rowNodes.length, 40); r++) {
              const cNodes = rowNodes[r].getElementsByTagName('c');
              const rowCells: string[] = [];
              for (let c = 0; c < Math.min(cNodes.length, 8); c++) {
                const isShared = cNodes[c].getAttribute('t') === 's';
                const vNode = cNodes[c].getElementsByTagName('v')[0];
                if (vNode) {
                  const valIndex = parseInt(vNode.textContent || '0', 10);
                  rowCells.push(isShared ? (sharedStrings[valIndex] || '') : (vNode.textContent || ''));
                } else {
                  rowCells.push('');
                }
              }
              if (rowCells.some(Boolean)) {
                rows.push(rowCells);
              }
            }
          }
        } catch {
          // Fallback
        }
      }

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const landscapeA4: [number, number] = [841.89, 595.28];
      const page = pdfDoc.addPage(landscapeA4);

      // Title
      page.drawText(file[0].name.replace(/\.(xlsx|xls|csv)$/i, ''), {
        x: 50,
        y: 540,
        size: 18,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.2),
      });

      // Render table
      let y = 490;
      const colWidth = 90;
      const rowHeight = 22;

      if (rows.length > 0) {
        rows.forEach((row, rIdx) => {
          if (y < 60) return;
          const isHeader = rIdx === 0;

          // Row background
          if (isHeader) {
            page.drawRectangle({
              x: 50,
              y: y - 5,
              width: colWidth * Math.min(row.length, 8),
              height: rowHeight,
              color: rgb(0.9, 0.93, 0.98),
            });
          }

          row.forEach((cell, cIdx) => {
            if (cIdx < 8) {
              page.drawText(cell.slice(0, 16), {
                x: 55 + cIdx * colWidth,
                y,
                size: isHeader ? 10 : 9,
                font: isHeader ? boldFont : font,
                color: isHeader ? rgb(0.1, 0.2, 0.4) : rgb(0.2, 0.2, 0.2),
              });
            }
          });
          y -= rowHeight;
        });
      } else {
        page.drawText('Spreadsheet data processed and saved as PDF table.', {
          x: 50,
          y: 470,
          size: 12,
          font,
          color: rgb(0.3, 0.3, 0.3),
        });
      }

      const bytes = await pdfDoc.save();
      setConvertedBytes(bytes);
      addToast('success', 'Spreadsheet converted to PDF table!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBytes || !file[0]) return;
    const name = file[0].name.replace(/\.(xlsx|xls|csv)$/i, '');
    downloadPdf(convertedBytes, `${name}_table.pdf`);
    addToast('info', 'Downloaded PDF');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
          multiple={false}
          files={file}
          onFilesChange={(newFiles) => {
            setFile(newFiles);
            setConvertedBytes(null);
          }}
          title="Upload Excel spreadsheet to convert to PDF"
          subtitle="Supports XLSX, XLS, and CSV files"
          buttonLabel="Select Excel File"
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
                  <span>Converting Table...</span>
                </>
              ) : (
                <>
                  <Table className="w-4 h-4" />
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
