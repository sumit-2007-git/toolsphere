import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Sparkles, Terminal, Bookmark, LayoutGrid } from 'lucide-react';
import { TOOLS } from '../../data/toolsRegistry';

export const CategoryTabs: React.FC = () => {
  const { activeCategory, navigateToHome, navigateToCategory, favorites } = useApp();

  const pdfCount = TOOLS.filter(t => t.category === 'pdf').length;
  const utilCount = TOOLS.filter(t => t.category === 'utilities').length;
  const devCount = TOOLS.filter(t => t.category === 'dev').length;

  const tabs = [
    { id: 'all', label: 'All Tools', count: TOOLS.length, icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'pdf', label: 'PDF Tools', count: pdfCount, icon: <FileText className="w-4 h-4 text-indigo-500" /> },
    { id: 'utilities', label: 'Daily Smart Utilities', count: utilCount, icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { id: 'dev', label: 'Developer & Text', count: devCount, icon: <Terminal className="w-4 h-4 text-amber-500" /> },
    { id: 'favorites', label: 'Favorites', count: favorites.length, icon: <Bookmark className="w-4 h-4 text-amber-500" /> },
  ];

  const handleTabClick = (tabId: string) => {
    if (tabId === 'all') {
      navigateToHome();
    } else {
      navigateToCategory(tabId);
    }
  };

  return (
    <div className="flex items-center justify-start sm:justify-center overflow-x-auto py-4 px-2 no-scrollbar gap-2 max-w-7xl mx-auto">
      {tabs.map(tab => {
        const isActive = activeCategory === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-brand-700/80 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
