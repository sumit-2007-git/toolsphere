import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronRight, Bookmark, Share2, ArrowLeft, Check } from 'lucide-react';
import { ToolItem } from '../../types/tools';

interface ToolHeaderProps {
  tool: ToolItem;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({ tool }) => {
  const { setActiveToolId, favorites, toggleFavorite, addToast } = useApp();
  const [copied, setCopied] = React.useState(false);

  const isFavorite = favorites.includes(tool.id);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    addToast('success', 'Tool link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-8">
      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          <button
            onClick={() => setActiveToolId(null)}
            className="flex items-center gap-1 hover:text-brand-500 dark:hover:text-brand-400 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">{tool.categoryName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-brand-600 dark:text-brand-400 font-semibold">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleFavorite(tool.id)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className={`p-2 rounded-lg border transition-all ${
              isFavorite
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700/60 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            title="Share tool"
            className="p-2 rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-brand-500 hover:border-slate-300 transition-all shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Tool Title & Description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {tool.name}
            </h1>
            {tool.badge && (
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                {tool.badge}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl">
            {tool.detailedDescription || tool.description}
          </p>
        </div>
      </div>
    </div>
  );
};
