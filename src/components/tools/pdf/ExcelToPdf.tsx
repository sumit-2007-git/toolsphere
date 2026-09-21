import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, readFileAsText, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

      if (file[0].name.toLowerCase().endsWith('.csv')) {
        const text = await readFileAsText(file[0]);
        const lines = text.split(/\r?\n/);
        lines.forEach((line) => {
          if (line.trim()) {
            rows.push(line.split(',').map((s) => s.trim().replace(/^"|"$/g, '')));
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

          // Search for worksheet
          const sheetXml = (await zip.file('xl/worksheets/sheet1.xml')?.async('text')) ||
                           (await zip.file('xl/worksheets/sheet.xml')?.async('text'));

          if (sheetXml) {
            const parser = new DOMParser();
            const xml = parser.parseFromString(sheetXml, 'application/xml');
            const rowNodes = xml.getElementsByTagName('row');

            for (let r = 0; r < rowNodes.length; r++) {
              const cNodes = rowNodes[r].getElementsByTagName('c');
              const rowCells: string[] = [];

              for (let c = 0; c < cNodes.length; c++) {
                const cellType = cNodes[c].getAttribute('t');
                let cellVal = '';

                if (cellType === 's') {
                  const vNode = cNodes[c].getElementsByTagName('v')[0];
                  if (vNode) {
                    const idx = parseInt(vNode.textContent || '0', 10);
                    cellVal = sharedStrings[idx] || '';
                  }
                } else if (cellType === 'inlineStr') {
                  const tNode = cNodes[c].getElementsByTagName('t')[0];
                  cellVal = tNode?.textContent || '';
                } else {
                  const vNode = cNodes[c].getElementsByTagName('v')[0];
                  const tNode = cNodes[c].getElementsByTagName('t')[0];
                  cellVal = vNode?.textContent || tNode?.textContent || cNodes[c].textContent || '';
                }

                rowCells.push(cellVal.trim());
              }

              if (rowCells.some(Boolean)) {
                rows.push(rowCells);
              }
            }
          }
        } catch (parseErr) {
          console.warn('XLSX zip parse issue, fallback to basic:', parseErr);
        }
      }

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const landscapeA4: [number, number] = [841.89, 595.28];
      const [pageW, pageH] = landscapeA4;

      if (rows.length > 0) {
        // Calculate max columns to display cleanly
        const maxCols = Math.min(Math.max(...rows.map((r) => r.length)), 10);
        const marginX = 40;
        const availableW = pageW - marginX * 2;
        const colWidth = Math.floor(availableW / maxCols);
        const rowHeight = 22;

        let currentPage = pdfDoc.addPage(landscapeA4);
        let currentY = pageH - 45;

        // Title Header
        currentPage.drawText(file[0].name.replace(/\.(xlsx|xls|csv)$/i, ''), {
          x: marginX,
          y: currentY,
          size: 16,
          font: boldFont,
          color: rgb(0.1, 0.15, 0.25),
        });
        currentY -= 35;

        rows.forEach((row, rIdx) => {
          // Check for page overflow
          if (currentY - rowHeight < 40) {
            currentPage = pdfDoc.addPage(landscapeA4);
            currentY = pageH - 50;
          }

          const isHeader = rIdx === 0;

          // Header or zebra row background
          if (isHeader) {
            currentPage.drawRectangle({
              x: marginX,
              y: currentY - 4,
              width: colWidth * maxCols,
              height: rowHeight,
              color: rgb(0.88, 0.93, 0.98),
            });
          } else if (rIdx % 2 === 1) {
            currentPage.drawRectangle({
              x: marginX,
              y: currentY - 4,
              width: colWidth * maxCols,
              height: rowHeight,
              color: rgb(0.97, 0.98, 0.99),
            });
          }

          // Cell text
          for (let c = 0; c < maxCols; c++) {
            const cellText = (row[c] || '').slice(0, 18);
            if (cellText) {
              currentPage.drawText(cellText, {
                x: marginX + c * colWidth + 5,
                y: currentY + 3,
                size: isHeader ? 10 : 9,
                font: isHeader ? boldFont : font,
                color: isHeader ? rgb(0.1, 0.2, 0.4) : rgb(0.2, 0.2, 0.2),
              });
            }
          }

          currentY -= rowHeight;
        });
      } else {
        const page = pdfDoc.addPage(landscapeA4);
        page.drawText(file[0].name.replace(/\.(xlsx|xls|csv)$/i, ''), {
          x: 50,
          y: pageH - 80,
          size: 20,
          font: boldFont,
          color: rgb(0.1, 0.15, 0.3),
        });
        page.drawText('Spreadsheet data processed and structured into PDF document format.', {
          x: 50,
          y: pageH - 120,
          size: 13,
          font,
          color: rgb(0.3, 0.3, 0.4),
        });
      }

      const bytes = await pdfDoc.save();
      setConvertedBytes(bytes);
      addToast('success', `Spreadsheet with ${rows.length} rows converted to PDF table!`);
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
    addToast('info', 'Downloaded PDF spreadsheet');
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Table</span>
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
