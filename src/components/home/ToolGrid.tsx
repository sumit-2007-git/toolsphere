import React from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolCard } from './ToolCard';
import {
  Search,
  Bookmark,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
  FileText,
  Terminal
} from 'lucide-react';

export const ToolGrid: React.FC = () => {
  const {
    activeCategory,
    searchQuery,
    favorites,
    recentTools,
    navigateToCategory,
    navigateToTool
  } = useApp();

  let filteredTools = TOOLS;

  if (activeCategory === 'favorites') {
    filteredTools = TOOLS.filter(t => favorites.includes(t.id));
  } else if (activeCategory !== 'all') {
    filteredTools = TOOLS.filter(t => t.category === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredTools = filteredTools.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryName.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  // Empty state
  if (filteredTools.length === 0) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
          {activeCategory === 'favorites' ? (
            <Bookmark className="w-6 h-6" />
          ) : (
            <Search className="w-6 h-6" />
          )}
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {activeCategory === 'favorites' ? 'No favorites saved yet' : 'No matching tools found'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {activeCategory === 'favorites'
            ? 'Click the bookmark icon on any tool card to save your most used tools here.'
            : 'Try adjusting your search keywords or browsing different categories.'}
        </p>
      </div>
    );
  }

  // If a search query is active, show flat matching results
  if (searchQuery.trim()) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Found {filteredTools.length} tools matching &quot;{searchQuery}&quot;</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    );
  }

  // Home Dashboard: Dynamic Showcases & Highlights
  const recentToolItems = recentTools
    .map(id => TOOLS.find(t => t.id === id))
    .filter((t): t is typeof TOOLS[0] => Boolean(t))
    .slice(0, 4);

  const popularTools = TOOLS.filter(t => t.popular).slice(0, 8);

  return (
    <div className="space-y-14">
      {/* Recently Used Tools (if any) */}
      {recentToolItems.length > 0 && (
        <section className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>Recently Used Tools</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentToolItems.map(tool => (
              <button
                key={tool.id}
                type="button"
                onClick={() => navigateToTool(tool.id)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-slate-700 hover:text-brand-600 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-slate-700 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                    {tool.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {tool.categoryName}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Featured / Most Popular Tools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trending & Most Used</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Featured Utility Tools
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {popularTools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      {/* Category Showcases with Explore All Links */}
      {CATEGORIES.map(cat => {
        const catTools = TOOLS.filter(t => t.category === cat.id);
        const previewTools = catTools.slice(0, 4);

        const getCatIcon = () => {
          if (cat.id === 'pdf') return <FileText className="w-5 h-5 text-indigo-500" />;
          if (cat.id === 'utilities') return <Sparkles className="w-5 h-5 text-emerald-500" />;
          return <Terminal className="w-5 h-5 text-amber-500" />;
        };

        return (
          <section key={cat.id} className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                  {getCatIcon()}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {cat.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {cat.shortDesc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigateToCategory(cat.id)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 text-xs font-bold hover:bg-brand-50 dark:hover:bg-slate-700 transition-colors shrink-0"
              >
                <span>Explore all {catTools.length} {cat.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {previewTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

