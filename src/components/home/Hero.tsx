import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles } from 'lucide-react';
import { TOOLS } from '../../data/toolsRegistry';

export const Hero: React.FC = () => {
  const { setIsSearchOpen, navigateToTool } = useApp();

  return (
    <div className="relative overflow-hidden py-16 sm:py-20 lg:py-24 bg-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60 shadow-xs mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>42+ Free Web Tools • 100% Client-Side • Infinite Deployment</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
          All-in-One Smart Utility Tools <br />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Fast, Secure & In-Browser
          </span>
        </h1>

        <p className="mt-5 text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Manage PDFs, generate QR codes, calculate percentages, inspect files, format JSON, and compress media without uploading files to remote servers.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="relative flex items-center w-full p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700/80 hover:border-brand-500 dark:hover:border-brand-500 shadow-xl shadow-slate-200/50 dark:shadow-black/40 cursor-pointer transition-all group"
          >
            <Search className="w-5 h-5 text-slate-400 group-hover:text-brand-500 ml-3 shrink-0 transition-colors" />
            <span className="w-full text-left pl-3 text-xs sm:text-base text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 truncate">
              Search any tool (e.g. merge pdf, qr code, compress)...
            </span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg mr-1">
              <span>⌘K</span>
            </kbd>
          </div>
        </div>

        {/* Popular Quick Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Popular:</span>
          {['merge-pdf', 'qr-generator', 'image-compressor', 'split-pdf', 'password-generator', 'word-counter'].map(id => {
            const tool = TOOLS.find(t => t.id === id);
            if (!tool) return null;
            return (
              <button
                key={id}
                onClick={() => navigateToTool(id)}
                className="px-2.5 py-1 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all font-medium"
              >
                {tool.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
