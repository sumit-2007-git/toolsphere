import React from 'react';
import { useApp } from '../../context/AppContext';
import { ToolItem } from '../../types/tools';
import {
  Files,
  Split,
  Minimize2,
  Image,
  FileImage,
  RotateCw,
  Lock,
  Unlock,
  Stamp,
  Hash,
  Layers,
  PenTool,
  FileText,
  FileCode,
  Crop,
  QrCode,
  Key,
  Calendar,
  ArrowLeftRight,
  Percent,
  Activity,
  CheckSquare,
  StickyNote,
  Type,
  Binary,
  Dices,
  Palette,
  Gauge,
  Clock,
  Watch,
  Code,
  Code2,
  FileSearch,
  Bookmark,
  ArrowUpRight,
  Presentation,
  Table,
  ShieldCheck
} from 'lucide-react';

interface ToolCardProps {
  tool: ToolItem;
}

export const getToolIcon = (iconName: string, className: string = 'w-6 h-6') => {
  switch (iconName) {
    case 'Files': return <Files className={className} />;
    case 'Split': return <Split className={className} />;
    case 'Minimize2': return <Minimize2 className={className} />;
    case 'Image': return <Image className={className} />;
    case 'FileImage': return <FileImage className={className} />;
    case 'RotateCw': return <RotateCw className={className} />;
    case 'Lock': return <Lock className={className} />;
    case 'Unlock': return <Unlock className={className} />;
    case 'Stamp': return <Stamp className={className} />;
    case 'Hash': return <Hash className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'PenTool': return <PenTool className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'FileCode': return <FileCode className={className} />;
    case 'Crop': return <Crop className={className} />;
    case 'Presentation': return <Presentation className={className} />;
    case 'Table': return <Table className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'QrCode': return <QrCode className={className} />;
    case 'Key': return <Key className={className} />;
    case 'Calendar': return <Calendar className={className} />;
    case 'ArrowLeftRight': return <ArrowLeftRight className={className} />;
    case 'Percent': return <Percent className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'CheckSquare': return <CheckSquare className={className} />;
    case 'StickyNote': return <StickyNote className={className} />;
    case 'Type': return <Type className={className} />;
    case 'Binary': return <Binary className={className} />;
    case 'Dices': return <Dices className={className} />;
    case 'Palette': return <Palette className={className} />;
    case 'Gauge': return <Gauge className={className} />;
    case 'Clock': return <Clock className={className} />;
    case 'Watch': return <Watch className={className} />;
    case 'Code': return <Code className={className} />;
    case 'Code2': return <Code2 className={className} />;
    case 'FileSearch': return <FileSearch className={className} />;
    default: return <FileText className={className} />;
  }
};

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { setActiveToolId, favorites, toggleFavorite } = useApp();
  const isFavorite = favorites.includes(tool.id);

  // Category specific accent themes
  let iconTheme = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white';
  let badgeTheme = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300';

  if (tool.category === 'utilities') {
    iconTheme = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white';
    badgeTheme = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300';
  } else if (tool.category === 'dev') {
    iconTheme = 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white';
    badgeTheme = 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300';
  }

  return (
    <div
      onClick={() => setActiveToolId(tool.id)}
      className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer overflow-hidden"
    >
      <div>
        {/* Card Header: Icon + Badge + Favorite */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className={`p-3 rounded-xl transition-colors duration-200 ${iconTheme}`}>
            {getToolIcon(tool.icon, 'w-6 h-6')}
          </div>

          <div className="flex items-center gap-1.5">
            {tool.badge && (
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${badgeTheme}`}>
                {tool.badge}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tool.id);
              }}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center justify-between">
          <span>{tool.name}</span>
          <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-brand-500" />
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Card Footer: Category tag */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
          {tool.categoryName}
        </span>
        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:underline">
          Use Tool →
        </span>
      </div>
    </div>
  );
};
