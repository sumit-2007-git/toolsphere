import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS } from '../../data/toolsRegistry';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, FileText, Terminal } from 'lucide-react';
import { ToolItem } from '../../types/tools';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveToolId } = useApp();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredTools = query.trim()
    ? TOOLS.filter(tool => {
        const q = query.toLowerCase();
        return (
          tool.name.toLowerCase().includes(q) ||
          tool.categoryName.toLowerCase().includes(q) ||
          tool.description.toLowerCase().includes(q) ||
          tool.tags.some(tag => tag.toLowerCase().includes(q))
        );
      })
    : TOOLS.slice(0, 8); // default suggestions

  const handleSelectTool = (tool: ToolItem) => {
    setActiveToolId(tool.id);
    setIsSearchOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredTools[selectedIndex]) {
        handleSelectTool(filteredTools[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === 'pdf') return <FileText className="w-3.5 h-3.5 text-indigo-500" />;
    if (cat === 'utilities') return <Sparkles className="w-3.5 h-3.5 text-emerald-500" />;
    return <Terminal className="w-3.5 h-3.5 text-amber-500" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      onClick={() => setIsSearchOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search all 34+ tools (e.g. merge pdf, qr code, word counter, json)..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredTools.length > 0 ? (
            <div className="space-y-1">
              {!query && (
                <p className="px-3 py-1.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Popular Tools
                </p>
              )}
              {filteredTools.map((tool, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={tool.id}
                    onClick={() => handleSelectTool(tool)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-900 dark:text-brand-100'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getCategoryIcon(tool.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {tool.name}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tool.categoryName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center text-slate-400">
                      {isSelected ? (
                        <div className="flex items-center text-xs font-medium text-brand-600 dark:text-brand-400 gap-1">
                          <span>Open</span>
                          <CornerDownLeft className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <ArrowRight className="w-4 h-4 opacity-40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400">
              <p className="font-medium text-sm">No tools found matching "{query}"</p>
              <p className="text-xs mt-1">Try searching for keywords like "pdf", "image", "calculate", "time", or "code".</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">↑</kbd> <kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">↓</kbd> to navigate</span>
            <span><kbd className="font-mono bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">↵</kbd> to select</span>
          </div>
          <span>Total 34 Free Tools</span>
        </div>
      </div>
    </div>
  );
};
