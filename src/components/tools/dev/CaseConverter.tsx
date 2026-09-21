import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Binary, Copy, ArrowRightLeft } from 'lucide-react';

export const CaseConverter: React.FC = () => {
  const { addToast } = useApp();
  const [text, setText] = useState('Hello World, welcome to ToolSphere smart utility suite!');

  const toTitleCase = (str: string) => {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, '');
  };

  const toSnakeCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const toKebabCase = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const applyTransform = (transformer: (s: string) => string, name: string) => {
    setText(transformer(text));
    addToast('success', `Converted to ${name}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    addToast('success', 'Copied to clipboard!');
  };

  const transformations = [
    { name: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { name: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { name: 'Title Case', fn: toTitleCase },
    { name: 'Sentence case', fn: toSentenceCase },
    { name: 'camelCase', fn: toCamelCase },
    { name: 'snake_case', fn: toSnakeCase },
    { name: 'kebab-case', fn: toKebabCase },
    { name: 'CONSTANT_CASE', fn: toConstantCase },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Transformation Action Buttons */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Click to Transform Text
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {transformations.map(t => (
            <button
              key={t.name}
              type="button"
              onClick={() => applyTransform(t.fn, t.name)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all text-center"
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Text Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-semibold text-slate-400">
            {text.length} characters
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Text</span>
          </button>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text to convert..."
          className="w-full bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none font-mono"
        />
      </div>
    </div>
  );
};
