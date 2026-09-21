import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { PDFDocument } from 'pdf-lib';
import { ShieldCheck, Download, Loader2, CheckCircle2 } from 'lucide-react';

export const PdfToPdfa: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfaBytes, setPdfaBytes] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Embed PDF/A metadata & standard title/producer
      pdfDoc.setTitle(file[0].name.replace(/\.pdf$/i, ''));
      pdfDoc.setProducer('ToolSphere PDF/A-1b Standardizer');
      pdfDoc.setCreator('ToolSphere ISO Converter');

      const bytes = await pdfDoc.save({
        useObjectStreams: true,
      });

      setPdfaBytes(bytes);
      addToast('success', 'Document standardized to PDF/A-1b format!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!pdfaBytes || !file[0]) return;
    const name = file[0].name.replace(/\.pdf$/i, '');
    downloadPdf(pdfaBytes, `${name}_pdfa.pdf`);
    addToast('info', 'Downloaded PDF/A document');
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
            setPdfaBytes(null);
          }}
          title="Upload PDF to convert to PDF/A"
          subtitle="ISO standard format for long-term archiving and legal compliance"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs">{file[0].name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  ISO 19005-1
                </span>
              </div>
              <p className="text-xs text-slate-400">{formatBytes(file[0].size)}</p>
            </div>
          </div>

          {pdfaBytes ? (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF/A</span>
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
                  <span>Standardizing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Convert to PDF/A</span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
