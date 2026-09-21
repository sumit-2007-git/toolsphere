import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsText, downloadPdf, formatBytes } from '../../../utils/fileUtils';
import { textToPdf } from '../../../utils/pdfUtils';
import { Code, Download, Loader2 } from 'lucide-react';

export const HtmlToPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [htmlCode, setHtmlCode] = useState(
    '<!DOCTYPE html>\n<html>\n<head>\n  <title>Sample Invoice</title>\n</head>\n<body>\n  <h1>ToolSphere Order #9482</h1>\n  <p>Invoice generated on: September 2026</p>\n  <p>Thank you for using ToolSphere All-in-One Utility Suite.</p>\n</body>\n</html>'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (files: File[]) => {
    setFile(files);
    if (files[0]) {
      try {
        const text = await readFileAsText(files[0]);
        setHtmlCode(text);
      } catch (err: any) {
        addToast('error', 'Could not read HTML file', err.message);
      }
    }
  };

  const handleConvert = async () => {
    if (!htmlCode.trim()) return;

    try {
      setIsProcessing(true);
      // Strip HTML tags and extract readable text structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlCode;
      const cleanText = (tempDiv.textContent || tempDiv.innerText || '').trim();

      const titleMatch = htmlCode.match(/<title>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1] : (file[0]?.name.replace(/\.html$/i, '') || 'HTML Document');

      const pdfBytes = await textToPdf(cleanText || htmlCode, title);
      downloadPdf(pdfBytes, `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
      addToast('success', 'HTML converted to PDF and downloaded!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Conversion failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".html,.htm,text/html"
          multiple={false}
          files={file}
          onFilesChange={handleFileChange}
          title="Upload HTML file or paste code below"
          subtitle="Supports standard HTML files"
          buttonLabel="Select HTML File"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          HTML Code
        </label>
        <textarea
          rows={10}
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          placeholder="<html><body>...</body></html>"
          className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleConvert}
            disabled={isProcessing || !htmlCode.trim()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Converting...</span>
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
    </div>
  );
};
