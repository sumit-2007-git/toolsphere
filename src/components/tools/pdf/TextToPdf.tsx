import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { textToPdf } from '../../../utils/pdfUtils';
import { downloadPdf } from '../../../utils/fileUtils';
import { FileText, Download, Loader2, Copy } from 'lucide-react';

export const TextToPdf: React.FC = () => {
  const { addToast } = useApp();
  const [title, setTitle] = useState('Meeting Notes');
  const [content, setContent] = useState(
    `Project Kickoff Summary\n\nDate: September 2026\nObjective: Launch ToolSphere all-in-one smart utility platform.\n\nKey Accomplishments:\n1. 100% Client-side execution ensuring zero server cost and maximum data privacy.\n2. 34+ comprehensive tools across PDF processing, daily utilities, and developer tools.\n3. Responsive modern UI with dark mode, search modal, and offline readiness.\n\nNext Steps:\n- Deploy to hosting platform (Vercel / Netlify / GitHub Pages).\n- Share with user base.`
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGeneratePdf = async () => {
    if (!content.trim()) {
      addToast('error', 'Please enter some text content.');
      return;
    }

    try {
      setIsProcessing(true);
      const pdfBytes = await textToPdf(content, title);
      downloadPdf(pdfBytes, `${(title || 'document').toLowerCase().replace(/\s+/g, '_')}.pdf`);
      addToast('success', 'PDF generated and downloaded!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to generate PDF', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Document Title (Optional)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Project Plan, Invoice, Meeting Minutes"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Text Content
            </label>
            <span className="text-xs text-slate-400">
              {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
            </span>
          </div>
          <textarea
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or write your document content here..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(content);
              addToast('info', 'Text copied to clipboard');
            }}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>

          <button
            type="button"
            onClick={handleGeneratePdf}
            disabled={isProcessing || !content.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Convert to PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
