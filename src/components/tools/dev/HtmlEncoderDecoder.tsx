import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Code2, Copy, ArrowDownUp, Eye } from 'lucide-react';

export const HtmlEncoderDecoder: React.FC = () => {
  const { addToast } = useApp();
  const [input, setInput] = useState('<div class="header">\n  <h1>Hello & Welcome to "ToolSphere"!</h1>\n  <p>100% Client-side > server</p>\n</div>');

  const handleEncode = () => {
    const encoded = input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
    setInput(encoded);
    addToast('success', 'Encoded to HTML entities');
  };

  const handleDecode = () => {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    setInput(doc.documentElement.textContent || '');
    addToast('success', 'Decoded HTML entities');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    addToast('success', 'Content copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleEncode}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-xs transition-all"
          >
            Encode to Entities
          </button>
          <button
            type="button"
            onClick={handleDecode}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-brand-500 text-xs font-bold transition-all"
          >
            Decode Entities
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          title="Copy"
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Source Text / Entity String
        </label>
        <textarea
          rows={12}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste HTML or encoded entities here..."
          className="w-full bg-transparent font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
        />
      </div>
    </div>
  );
};
