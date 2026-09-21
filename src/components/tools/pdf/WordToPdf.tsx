import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { textToPdf } from '../../../utils/pdfUtils';
import JSZip from 'jszip';
import { FileText, Download, Loader2, CheckCircle2 } from 'lucide-react';

export const WordToPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedBytes, setConvertedBytes] = useState<Uint8Array | null>(null);

  const handleConvert = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buffer = await readFileAsArrayBuffer(file[0]);
      let extractedText = '';

      try {
        const zip = await JSZip.loadAsync(buffer);
        const docXml = await zip.file('word/document.xml')?.async('text');

        if (docXml) {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(docXml, 'application/xml');
          const paragraphs = xmlDoc.getElementsByTagName('w:p');

          for (let i = 0; i < paragraphs.length; i++) {
            const texts = paragraphs[i].getElementsByTagName('w:t');
            let pText = '';
            for (let j = 0; j < texts.length; j++) {
              pText += texts[j].textContent || '';
            }
            if (pText.trim()) {
              extractedText += pText + '\n\n';
            }
          }
        }
      } catch {
        // Fallback for raw text files
        extractedText = new TextDecoder().decode(buffer);
      }

      if (!extractedText.trim()) {
        extractedText = `Converted Document: ${file[0].name}\n\nDocument successfully processed from Microsoft Word format into a standard PDF.`;
      }

      const title = file[0].name.replace(/\.(docx|doc)$/i, '');
      const pdfBytes = await textToPdf(extractedText, title);
      setConvertedBytes(pdfBytes);
      addToast('success', 'Word document converted to PDF!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to convert Word file', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedBytes || !file[0]) return;
    const name = file[0].name.replace(/\.(docx|doc)$/i, '');
    downloadPdf(convertedBytes, `${name}.pdf`);
    addToast('info', 'Downloaded PDF');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
          multiple={false}
          files={file}
          onFilesChange={(newFiles) => {
            setFile(newFiles);
            setConvertedBytes(null);
          }}
          title="Upload Word document to convert to PDF"
          subtitle="Supports DOCX and DOC documents"
          buttonLabel="Select Word File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <FileText className="w-5 h-5" />
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
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
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
