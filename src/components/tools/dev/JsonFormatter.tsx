import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Code, Copy, Download, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { downloadBlob } from '../../../utils/fileUtils';

export const JsonFormatter: React.FC = () => {
  const { addToast } = useApp();
  const [inputJson, setInputJson] = useState(`{
  "name": "ToolSphere",
  "version": "1.0.0",
  "tools": 34,
  "clientSide": true,
  "features": [
    "PDF Manipulation",
    "Smart Daily Calculators",
    "Developer Utilities"
  ]
}`);

  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePrettify = (spaces = 2) => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, spaces));
      setValidationError(null);
      addToast('success', `Prettified with ${spaces} spaces!`);
    } catch (err: any) {
      setValidationError(err.message);
      addToast('error', 'Invalid JSON syntax');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setValidationError(null);
      addToast('success', 'Minified JSON!');
    } catch (err: any) {
      setValidationError(err.message);
      addToast('error', 'Invalid JSON syntax');
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(inputJson);
      setValidationError(null);
      addToast('success', 'Valid JSON format!');
    } catch (err: any) {
      setValidationError(err.message);
      addToast('error', 'Invalid JSON syntax');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputJson);
    addToast('success', 'JSON copied to clipboard!');
  };

  const handleDownload = () => {
    const blob = new Blob([inputJson], { type: 'application/json' });
    downloadBlob(blob, 'formatted.json');
    addToast('info', 'Downloaded .json file');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Actions Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handlePrettify(2)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold hover:border-brand-500 hover:text-brand-600 transition-all"
          >
            Prettify (2 Spaces)
          </button>
          <button
            type="button"
            onClick={() => handlePrettify(4)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold hover:border-brand-500 hover:text-brand-600 transition-all"
          >
            Prettify (4 Spaces)
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold hover:border-brand-500 hover:text-brand-600 transition-all"
          >
            Minify
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-all"
          >
            Validate
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 flex items-start gap-3 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Invalid JSON Syntax</p>
            <p className="font-mono text-xs mt-0.5 opacity-90">{validationError}</p>
          </div>
        </div>
      )}

      {/* Editor Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <textarea
          rows={16}
          value={inputJson}
          onChange={(e) => {
            setInputJson(e.target.value);
            setValidationError(null);
          }}
          placeholder="Paste or write your raw JSON data here..."
          className="w-full bg-transparent font-mono text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none resize-y"
          spellCheck={false}
        />
      </div>
    </div>
  );
};
