import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolCard } from './ToolCard';
import {
  ChevronRight,
  ArrowLeft,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  FileText,
  Terminal,
  Bookmark,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const CategoryView: React.FC = () => {
  const {
    activeCategory,
    navigateToHome,
    navigateToCategory,
    sortMode,
    setSortMode,
    viewLayout,
    setViewLayout,
    favorites
  } = useApp();

  const [catSearch, setCatSearch] = useState('');

  const currentCategoryInfo = CATEGORIES.find(c => c.id === activeCategory);
  const isFavorites = activeCategory === 'favorites';

  const categoryName = isFavorites
    ? 'Saved Favorites'
    : currentCategoryInfo?.name || 'All Tools';

  const categoryDesc = isFavorites
    ? 'Your bookmarked tools saved locally for instant 1-click access.'
    : currentCategoryInfo?.shortDesc || 'Discover free client-side utility tools.';

  // Filter tools for this category
  let tools = isFavorites
    ? TOOLS.filter(t => favorites.includes(t.id))
    : TOOLS.filter(t => t.category === activeCategory);

  // Apply search
  if (catSearch.trim()) {
    const q = catSearch.toLowerCase();
    tools = tools.filter(
      t =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  // Apply sorting
  if (sortMode === 'alpha') {
    tools = [...tools].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortMode === 'popular') {
    tools = [...tools].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  }

  const getCategoryIcon = () => {
    switch (activeCategory) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-indigo-500" />;
      case 'utilities':
        return <Sparkles className="w-8 h-8 text-emerald-500" />;
      case 'dev':
        return <Terminal className="w-8 h-8 text-amber-500" />;
      case 'favorites':
        return <Bookmark className="w-8 h-8 text-amber-500" />;
      default:
        return <Zap className="w-8 h-8 text-brand-500" />;
    }
  };

  const otherCategories = CATEGORIES.filter(c => c.id !== activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <button
          onClick={navigateToHome}
          className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <span className="text-slate-900 dark:text-white font-bold">{categoryName}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200">
            {getCategoryIcon()}
            <span>Dedicated Category Suite</span>
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span>{tools.length} Tools Available</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {categoryName}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {categoryDesc} All processing runs 100% in your browser for absolute privacy and zero upload waiting time.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Private & In-Browser
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Zero Server Cost & Unlimited
            </span>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Dynamic Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
        {/* Search within this category */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={catSearch}
            onChange={e => setCatSearch(e.target.value)}
            placeholder={`Search within ${categoryName}...`}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Sorting & Layout Switcher */}
        <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortMode}
              onChange={e => setSortMode(e.target.value as any)}
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="popular">Most Popular</option>
              <option value="alpha">Alphabetical (A-Z)</option>
            </select>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewLayout('grid')}
              title="Grid View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewLayout('compact')}
              title="Compact View"
              className={`p-1.5 rounded-lg transition-colors ${
                viewLayout === 'compact'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tools Roster */}
      {tools.length === 0 ? (
        <div className="py-16 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            No tools found in this view
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {catSearch ? 'Try a different search term.' : 'No saved tools in favorites yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}

      {/* Explore Other Categories */}
      {otherCategories.length > 0 && (
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Explore More Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => navigateToCategory(cat.id)}
                className="group flex items-center justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 shadow-xs hover:shadow-md transition-all text-left"
              >
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {cat.shortDesc}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
