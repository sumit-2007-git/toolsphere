import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Type, Clock, Mic, BarChart2, Copy, Trash2 } from 'lucide-react';

export const WordCounter: React.FC = () => {
  const { addToast } = useApp();
  const [text, setText] = useState(
    'Welcome to ToolSphere! This comprehensive client-side suite gives you instant access to PDF utilities, smart calculators, and developer tools. Everything runs securely right inside your browser.'
  );

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0).length;

  const readingTimeMinutes = (words / 200).toFixed(1);
  const speakingTimeMinutes = (words / 130).toFixed(1);

  // Keyword density
  const wordTokens = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const freqMap: { [word: string]: number } = {};
  wordTokens.forEach(w => { freqMap[w] = (freqMap[w] || 0) + 1; });
  const sortedKeywords = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Text copied to clipboard!');
  };

  const removeExtraSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
    addToast('info', 'Cleaned up excess whitespaces');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: 'Words', value: words.toLocaleString() },
          { label: 'Characters', value: charsWithSpaces.toLocaleString() },
          { label: 'No Spaces', value: charsWithoutSpaces.toLocaleString() },
          { label: 'Sentences', value: sentences.toLocaleString() },
          { label: 'Paragraphs', value: paragraphs.toLocaleString() },
        ].map((s, i) => (
          <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center shadow-xs">
            <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{s.value}</span>
            <p className="text-xs text-slate-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Reading / Speaking Estimates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Estimated Reading Time</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{readingTimeMinutes} min (200 wpm)</p>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Estimated Speaking Time</p>
            <p className="text-base font-bold text-slate-900 dark:text-white">{speakingTimeMinutes} min (130 wpm)</p>
          </div>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Live Text Editor
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={removeExtraSpaces}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Clean Spaces
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              title="Copy"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"
              title="Clear"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type content here to analyze..."
          className="w-full bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none font-sans"
        />

        {/* Top Keywords Analysis */}
        {sortedKeywords.length > 0 && (
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
              Top Keywords Density:
            </span>
            <div className="flex flex-wrap gap-2">
              {sortedKeywords.map(([kw, count]) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300"
                >
                  {kw} <strong className="text-brand-600 dark:text-brand-400">({count}x)</strong>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
