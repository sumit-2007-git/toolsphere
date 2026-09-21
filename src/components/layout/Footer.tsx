import React from 'react';
import { useApp } from '../../context/AppContext';
import { Zap, ShieldCheck, Cpu, Globe, Heart } from 'lucide-react';
import { CATEGORIES } from '../../data/toolsRegistry';

export const Footer: React.FC = () => {
  const { navigateToCategory } = useApp();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 mt-auto">
      {/* Privacy Guarantee Banner */}
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-brand-50/40 dark:bg-brand-950/20 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">100% Private & Secure</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your documents & data never leave your browser.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Zero Server Cost</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Runs completely client-side with native WebAssembly.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Unlimited Deployment</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Host on Vercel, Netlify, GitHub Pages with zero limits.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-purple-600 text-white">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">ToolSphere</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All-in-One Smart Utility Platform providing 42+ high-performance client-side tools for documents, calculations, text formatting, and developer workflows.
            </p>
          </div>

          {CATEGORIES.map(cat => (
            <div key={cat.id} className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {cat.shortDesc}
              </p>
              <button
                onClick={() => navigateToCategory(cat.id)}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
              >
                Browse all tools →
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} ToolSphere. Built for speed, privacy, and unlimited deployment.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for productivity everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
