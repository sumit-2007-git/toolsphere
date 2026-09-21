import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadBlob } from '../../../utils/fileUtils';
import * as pdfjsLib from 'pdfjs-dist';
import { FileCode, Download, Copy, Loader2, FileCheck } from 'lucide-react';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const PdfToText: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExtract = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise;
      let fullText = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setExtractedText(fullText.trim());
      addToast('success', `Successfully extracted text from ${pdf.numPages} pages!`);
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Extraction failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTxt = () => {
    if (!extractedText) return;
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${file[0]?.name.replace('.pdf', '') || 'document'}_extracted.txt`);
    addToast('info', 'Text file downloaded');
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    addToast('success', 'Extracted text copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={file}
          onFilesChange={(newFiles) => {
            setFile(newFiles);
            setExtractedText('');
          }}
          title="Upload a PDF to extract text"
          subtitle="Extract pure text from pages for copying or saving"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && !extractedText && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-brand-500" />
            <span className="font-bold text-slate-800 dark:text-slate-100">{file[0].name}</span>
          </div>

          <button
            type="button"
            onClick={handleExtract}
            disabled={isProcessing}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Text...</span>
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4" />
                <span>Extract Text</span>
              </>
            )}
          </button>
        </div>
      )}

      {extractedText && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Extracted Content ({extractedText.split(/\s+/).filter(Boolean).length} words)
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadTxt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          <textarea
            readOnly
            rows={14}
            value={extractedText}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-200 font-mono text-xs leading-relaxed focus:outline-none"
          />
        </div>
      )}
    </div>
  );
};
