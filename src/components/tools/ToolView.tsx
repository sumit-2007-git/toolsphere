import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES } from '../../data/toolsRegistry';
import { ToolHeader } from '../common/ToolHeader';
import {
  ChevronRight,
  ArrowLeft,
  Share2,
  Bookmark,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

// PDF Tools
import { MergePdf } from './pdf/MergePdf';
import { SplitPdf } from './pdf/SplitPdf';
import { CompressPdf } from './pdf/CompressPdf';
import { PdfToJpg } from './pdf/PdfToJpg';
import { JpgToPdf } from './pdf/JpgToPdf';
import { RotatePdf } from './pdf/RotatePdf';
import { ProtectPdf } from './pdf/ProtectPdf';
import { UnlockPdf } from './pdf/UnlockPdf';
import { WatermarkPdf } from './pdf/WatermarkPdf';
import { PageNumbersPdf } from './pdf/PageNumbersPdf';
import { OrganizePdf } from './pdf/OrganizePdf';
import { SignPdf } from './pdf/SignPdf';
import { TextToPdf } from './pdf/TextToPdf';
import { PdfToText } from './pdf/PdfToText';
import { CropPdf } from './pdf/CropPdf';
import { WordToPdf } from './pdf/WordToPdf';
import { PowerPointToPdf } from './pdf/PowerPointToPdf';
import { ExcelToPdf } from './pdf/ExcelToPdf';
import { HtmlToPdf } from './pdf/HtmlToPdf';
import { PdfToWord } from './pdf/PdfToWord';
import { PdfToPowerpoint } from './pdf/PdfToPowerpoint';
import { PdfToExcel } from './pdf/PdfToExcel';
import { PdfToPdfa } from './pdf/PdfToPdfa';

// Daily Smart Utilities
import { QrGenerator } from './utilities/QrGenerator';
import { PasswordGenerator } from './utilities/PasswordGenerator';
import { AgeCalculator } from './utilities/AgeCalculator';
import { UnitConverter } from './utilities/UnitConverter';
import { PercentageCalculator } from './utilities/PercentageCalculator';
import { BmiCalculator } from './utilities/BmiCalculator';
import { TodoList } from './utilities/TodoList';
import { NotesTool } from './utilities/NotesTool';
import { ImageCompressor } from './utilities/ImageCompressor';

// Developer & Text Tools
import { WordCounter } from './dev/WordCounter';
import { CaseConverter } from './dev/CaseConverter';
import { RandomNumberGenerator } from './dev/RandomNumberGenerator';
import { ColorPickerTool } from './dev/ColorPickerTool';
import { TypingSpeedTest } from './dev/TypingSpeedTest';
import { CountdownTimer } from './dev/CountdownTimer';
import { StopwatchTool } from './dev/StopwatchTool';
import { JsonFormatter } from './dev/JsonFormatter';
import { HtmlEncoderDecoder } from './dev/HtmlEncoderDecoder';
import { FileExtensionChecker } from './dev/FileExtensionChecker';

export const ToolView: React.FC = () => {
  const {
    currentTool,
    navigateToHome,
    navigateToCategory,
    navigateToTool,
    favorites,
    toggleFavorite,
    addToast
  } = useApp();

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  if (!currentTool) return null;

  const isFav = favorites.includes(currentTool.id);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    addToast('success', 'Link Copied!', 'Direct tool link copied to your clipboard.');
  };

  const relatedTools = TOOLS.filter(
    t => t.category === currentTool.category && t.id !== currentTool.id
  ).slice(0, 4);

  const toolFaqs = [
    {
      q: `Is ${currentTool.name} free to use?`,
      a: `Yes! ${currentTool.name} is completely free on ToolSphere with zero file size limits and no account required.`
    },
    {
      q: `Is my data safe when using ${currentTool.name}?`,
      a: `Yes, 100%. All processing runs locally inside your browser client. No files, documents, or data are ever uploaded to any cloud server.`
    },
    {
      q: `Can I use ${currentTool.name} on mobile phones?`,
      a: `Yes, ToolSphere is fully responsive and optimized for both iOS and Android smartphones and tablets.`
    }
  ];

  const renderToolComponent = () => {
    switch (currentTool.id) {
      // PDF
      case 'merge-pdf': return <MergePdf />;
      case 'split-pdf': return <SplitPdf />;
      case 'compress-pdf': return <CompressPdf />;
      case 'pdf-to-jpg': return <PdfToJpg />;
      case 'jpg-to-pdf': return <JpgToPdf />;
      case 'rotate-pdf': return <RotatePdf />;
      case 'protect-pdf': return <ProtectPdf />;
      case 'unlock-pdf': return <UnlockPdf />;
      case 'watermark-pdf': return <WatermarkPdf />;
      case 'page-numbers-pdf': return <PageNumbersPdf />;
      case 'organize-pdf': return <OrganizePdf />;
      case 'sign-pdf': return <SignPdf />;
      case 'text-to-pdf': return <TextToPdf />;
      case 'pdf-to-text': return <PdfToText />;
      case 'crop-pdf': return <CropPdf />;
      case 'word-to-pdf': return <WordToPdf />;
      case 'powerpoint-to-pdf': return <PowerPointToPdf />;
      case 'excel-to-pdf': return <ExcelToPdf />;
      case 'html-to-pdf': return <HtmlToPdf />;
      case 'pdf-to-word': return <PdfToWord />;
      case 'pdf-to-powerpoint': return <PdfToPowerpoint />;
      case 'pdf-to-excel': return <PdfToExcel />;
      case 'pdf-to-pdfa': return <PdfToPdfa />;

      // Daily Smart Utilities
      case 'qr-generator': return <QrGenerator />;
      case 'password-generator': return <PasswordGenerator />;
      case 'age-calculator': return <AgeCalculator />;
      case 'unit-converter': return <UnitConverter />;
      case 'percentage-calculator': return <PercentageCalculator />;
      case 'bmi-calculator': return <BmiCalculator />;
      case 'todo-list': return <TodoList />;
      case 'notes':
      case 'notes-tool':
        return <NotesTool />;
      case 'image-compressor': return <ImageCompressor />;

      // Developer & Text Tools
      case 'word-counter': return <WordCounter />;
      case 'case-converter': return <CaseConverter />;
      case 'random-generator':
      case 'random-number-generator':
        return <RandomNumberGenerator />;
      case 'color-picker': return <ColorPickerTool />;
      case 'typing-test':
      case 'typing-speed-test':
        return <TypingSpeedTest />;
      case 'countdown-timer': return <CountdownTimer />;
      case 'stopwatch': return <StopwatchTool />;
      case 'json-formatter': return <JsonFormatter />;
      case 'html-encoder': return <HtmlEncoderDecoder />;
      case 'file-extension-checker': return <FileExtensionChecker />;

      default:
        return (
          <div className="py-12 text-center text-slate-400">
            Tool under construction
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-in fade-in duration-200">
      {/* Top Breadcrumbs & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex-wrap">
          <button
            type="button"
            onClick={navigateToHome}
            className="flex items-center gap-1 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <button
            type="button"
            onClick={() => navigateToCategory(currentTool.category)}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            {currentTool.categoryName}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span className="text-slate-900 dark:text-white font-bold">{currentTool.name}</span>
        </nav>

        {/* Action Buttons (Share & Favorite) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(currentTool.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isFav
                ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 text-amber-600 dark:text-amber-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            <span>{isFav ? 'Saved' : 'Bookmark'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:border-brand-300 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Tool Header & Workspace */}
      <div className="space-y-6">
        <ToolHeader tool={currentTool} />
        <div className="mt-4">
          {renderToolComponent()}
        </div>
      </div>

      {/* How to Use 3-Step Visual Guide */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            How to use {currentTool.name} online
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Process files and data in 3 simple, instant steps:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Upload or Input Data
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Drag and drop your documents, import from Google Drive/Dropbox, or enter your text directly.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Customize & Process
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Configure tool settings, choose your options, and click execute. Processing finishes in milliseconds.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 space-y-2 border border-slate-100 dark:border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Save & Download
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly save your converted, merged, or generated output directly to your device with 1 click.
            </p>
          </div>
        </div>
      </div>

      {/* Tool FAQ Accordion */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <HelpCircle className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {currentTool.name} Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-2">
          {toolFaqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-brand-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Related Tools Recommendations */}
      {relatedTools.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Related {currentTool.categoryName} Tools
            </h3>
            <button
              type="button"
              onClick={() => navigateToCategory(currentTool.category)}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              View all in {currentTool.categoryName} <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedTools.map(relTool => (
              <button
                key={relTool.id}
                type="button"
                onClick={() => navigateToTool(relTool.id)}
                className="group flex items-start gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {relTool.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {relTool.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

