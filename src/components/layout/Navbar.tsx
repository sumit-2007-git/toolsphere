import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TOOLS, CATEGORIES, CONVERT_TO_PDF_ITEMS, CONVERT_FROM_PDF_ITEMS } from '../../data/toolsRegistry';
import {
  FileText,
  Sparkles,
  Terminal,
  Search,
  Moon,
  Sun,
  Bookmark,
  ChevronDown,
  Menu,
  X,
  Zap,
  ArrowRight,
  FileImage,
  Presentation,
  Table,
  Code,
  Image,
  ShieldCheck,
  Files,
  Split,
  Minimize2,
  RotateCw,
  Lock,
  Unlock,
  Stamp,
  Hash,
  Layers,
  FileSignature,
  Crop,
  FileCode,
  QrCode,
  Key,
  Calendar,
  Scale,
  Percent,
  Activity,
  CheckSquare,
  NotebookPen,
  Binary,
  Type,
  Dice5,
  Palette,
  Keyboard,
  Timer,
  Watch,
  Code2,
  FileCheck
} from 'lucide-react';

interface PillCoordinates {
  left: number;
  width: number;
  opacity: number;
}

export const Navbar: React.FC = () => {
  const {
    setActiveToolId,
    setIsSearchOpen,
    theme,
    toggleTheme,
    favorites,
    setActiveCategory,
    activeToolId
  } = useApp();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Sliding pill indicator state
  const [pillStyle, setPillStyle] = useState<PillCoordinates>({ left: 0, width: 0, opacity: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navRootRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const closeTimeoutRef = useRef<number | null>(null);

  // Sync sliding pill to active item or hide
  const syncPillToActive = () => {
    if (activeDropdown && buttonRefs.current[activeDropdown]) {
      const el = buttonRefs.current[activeDropdown];
      if (el) {
        setPillStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1
        });
        return;
      }
    }

    if (activeToolId && buttonRefs.current[activeToolId]) {
      const el = buttonRefs.current[activeToolId];
      if (el) {
        setPillStyle({
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1
        });
        return;
      }
    }

    // If nothing active, hide pill
    setPillStyle(prev => ({ ...prev, opacity: 0 }));
  };

  useEffect(() => {
    syncPillToActive();
  }, [activeToolId, activeDropdown]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRootRef.current && !navRootRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolClick = (toolId: string) => {
    setActiveToolId(toolId);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleCategoryNav = (categoryId: string) => {
    setActiveToolId(null);
    setActiveCategory(categoryId);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  // Pill hover handlers
  const handleItemMouseEnter = (key: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    const target = e.currentTarget;
    setPillStyle({
      left: target.offsetLeft,
      width: target.offsetWidth,
      opacity: 1
    });
  };

  const handleNavMouseLeave = () => {
    syncPillToActive();
  };

  // Dropdown hover helpers
  const handleDropdownTriggerEnter = (dropdownKey: string, e: React.MouseEvent<HTMLButtonElement>) => {
    handleItemMouseEnter(dropdownKey, e);
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(dropdownKey);
  };

  const handleDropdownAreaLeave = () => {
    closeTimeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
      syncPillToActive();
    }, 180);
  };

  const handleDropdownAreaEnter = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Categorized PDF tools for All PDF Tools Mega Menu
  const pdfOrganizeTools = [
    { id: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple files in order', icon: Files, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/70' },
    { id: 'split-pdf', name: 'Split PDF', desc: 'Separate or extract page ranges', icon: Split, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/70' },
    { id: 'compress-pdf', name: 'Compress PDF', desc: 'Drastically reduce file size', icon: Minimize2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/70' },
    { id: 'organize-pdf', name: 'Organize PDF', desc: 'Reorder, delete & sort pages', icon: Layers, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/70' },
    { id: 'rotate-pdf', name: 'Rotate PDF', desc: 'Turn sideways/upside-down pages', icon: RotateCw, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/70' },
    { id: 'crop-pdf', name: 'Crop PDF', desc: 'Trim margins and resize boundaries', icon: Crop, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/70' },
    { id: 'page-numbers-pdf', name: 'Page Numbers', desc: 'Insert pagination and headers', icon: Hash, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/70' },
    { id: 'watermark-pdf', name: 'Watermark PDF', desc: 'Stamp security text or logo', icon: Stamp, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/70' },
  ];

  const pdfConvertToTools = [
    { id: 'jpg-to-pdf', name: 'JPG to PDF', desc: 'Transform JPG, PNG images to PDF', icon: FileImage, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/70' },
    { id: 'word-to-pdf', name: 'WORD to PDF', desc: 'Convert DOCX files directly', icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/70' },
    { id: 'powerpoint-to-pdf', name: 'POWERPOINT to PDF', desc: 'Turn presentation slides to PDF', icon: Presentation, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/70' },
    { id: 'excel-to-pdf', name: 'EXCEL to PDF', desc: 'Convert tables & spreadsheets', icon: Table, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/70' },
    { id: 'html-to-pdf', name: 'HTML to PDF', desc: 'Render web HTML into PDF document', icon: FileCode, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/70' },
    { id: 'text-to-pdf', name: 'Text to PDF', desc: 'Plain text notes to styled PDF', icon: FileText, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
    { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', desc: 'Convert to ISO archival standard', icon: ShieldCheck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/70' },
  ];

  const pdfConvertFromTools = [
    { id: 'pdf-to-jpg', name: 'PDF to JPG', desc: 'Extract pages as crisp images', icon: Image, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/70' },
    { id: 'pdf-to-word', name: 'PDF to WORD', desc: 'Convert to editable Word DOCX', icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/70' },
    { id: 'pdf-to-powerpoint', name: 'PDF to POWERPOINT', desc: 'Convert to editable slide deck', icon: Presentation, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/70' },
    { id: 'pdf-to-excel', name: 'PDF to EXCEL', desc: 'Extract data to Excel sheets', icon: Table, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/70' },
    { id: 'pdf-to-text', name: 'PDF to Text', desc: 'Extract all readable text', icon: FileText, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
    { id: 'protect-pdf', name: 'Protect PDF', desc: 'Encrypt document with password', icon: Lock, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/70' },
    { id: 'unlock-pdf', name: 'Unlock PDF', desc: 'Remove password protection', icon: Unlock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/70' },
    { id: 'sign-pdf', name: 'Sign PDF', desc: 'Draw, type or add digital signature', icon: FileSignature, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/70' },
  ];

  // Daily Smart Utilities
  const dailyUtilitiesList = [
    { id: 'qr-generator', name: 'QR Code Generator', desc: 'Instant QR code creation', icon: QrCode, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/70' },
    { id: 'password-generator', name: 'Password Generator', desc: 'Create strong passwords', icon: Key, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/70' },
    { id: 'age-calculator', name: 'Age Calculator', desc: 'Exact age from date of birth', icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/70' },
    { id: 'unit-converter', name: 'Unit Converter', desc: 'Metric, imperial, temperature', icon: Scale, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/70' },
    { id: 'percentage-calculator', name: 'Percentage Calculator', desc: 'Calculate marks & discounts', icon: Percent, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/70' },
    { id: 'bmi-calculator', name: 'BMI Calculator', desc: 'Body mass index health check', icon: Activity, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/70' },
    { id: 'todo-list', name: 'To-Do List', desc: 'Tasks & checklist manager', icon: CheckSquare, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/70' },
    { id: 'notes', name: 'Quick Notes', desc: 'Jot down & save local notes', icon: NotebookPen, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/70' },
    { id: 'image-compressor', name: 'Image Compressor', desc: 'Shrink JPG & PNG files', icon: Binary, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/70' },
  ];

  // Developer & Text Tools
  const devToolsList = [
    { id: 'word-counter', name: 'Word Counter', desc: 'Words, chars & reading time', icon: Type, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/70' },
    { id: 'case-converter', name: 'Case Converter', desc: 'UPPER, lower, Title, camelCase', icon: Type, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/70' },
    { id: 'random-generator', name: 'Random Generator', desc: 'Numbers, coin flip, dice', icon: Dice5, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/70' },
    { id: 'color-picker', name: 'Color Picker', desc: 'HEX, RGB, HSL with palette', icon: Palette, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/70' },
    { id: 'typing-test', name: 'Typing Speed Test', desc: 'Test WPM speed & accuracy', icon: Keyboard, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/70' },
    { id: 'countdown-timer', name: 'Countdown Timer', desc: 'Set customizable timer alerts', icon: Timer, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/70' },
    { id: 'stopwatch', name: 'Stopwatch', desc: 'Precision millisecond laps', icon: Watch, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/70' },
    { id: 'json-formatter', name: 'JSON Formatter', desc: 'Beautify, validate & minify JSON', icon: Code2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/70' },
    { id: 'html-encoder', name: 'HTML Encoder', desc: 'Encode / decode HTML entities', icon: Code, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/70' },
    { id: 'file-extension-checker', name: 'File Checker', desc: 'Identify format & MIME type', icon: FileCheck, color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  ];

  return (
    <>
      {/* Dimmed Focus Backdrop Overlay (Closes menu on click, blocks background text bleeding) */}
      {activeDropdown && (
        <div
          className="fixed inset-0 top-16 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] z-30 transition-opacity animate-in fade-in duration-150"
          onClick={() => setActiveDropdown(null)}
        />
      )}

      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-slate-900 shadow-xs transition-colors">
        <div ref={navRootRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-6 xl:gap-8">
              <button
                onClick={() => {
                  setActiveToolId(null);
                  setActiveCategory('all');
                }}
                className="flex items-center gap-2.5 group text-left shrink-0 focus:outline-none"
              >
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 shadow-md shadow-brand-500/25 group-hover:scale-105 group-hover:shadow-brand-500/40 transition-all duration-200">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
                <div>
                  <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-slate-800 dark:from-white dark:via-brand-200 dark:to-slate-200 bg-clip-text text-transparent">
                    ToolSphere
                  </span>
                  <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                    All-in-One Utility Suite
                  </span>
                </div>
              </button>

              {/* Desktop Navigation with Sliding Pill */}
              <nav
                ref={navContainerRef}
                onMouseLeave={handleNavMouseLeave}
                className="relative hidden lg:flex items-center gap-0.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 font-semibold text-xs tracking-wider uppercase select-none"
              >
                {/* Sliding Pill Indicator */}
                <div
                  className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-slate-700 shadow-sm border border-slate-200/90 dark:border-slate-600 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    left: `${pillStyle.left}px`,
                    width: `${pillStyle.width}px`,
                    opacity: pillStyle.opacity,
                  }}
                />

                {/* Direct Link: MERGE PDF */}
                <button
                  ref={el => (buttonRefs.current['merge-pdf'] = el)}
                  type="button"
                  onMouseEnter={e => handleItemMouseEnter('merge-pdf', e)}
                  onClick={() => handleToolClick('merge-pdf')}
                  className={`relative z-10 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                    activeToolId === 'merge-pdf'
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Merge PDF
                </button>

                {/* Direct Link: SPLIT PDF */}
                <button
                  ref={el => (buttonRefs.current['split-pdf'] = el)}
                  type="button"
                  onMouseEnter={e => handleItemMouseEnter('split-pdf', e)}
                  onClick={() => handleToolClick('split-pdf')}
                  className={`relative z-10 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                    activeToolId === 'split-pdf'
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Split PDF
                </button>

                {/* Direct Link: COMPRESS PDF */}
                <button
                  ref={el => (buttonRefs.current['compress-pdf'] = el)}
                  type="button"
                  onMouseEnter={e => handleItemMouseEnter('compress-pdf', e)}
                  onClick={() => handleToolClick('compress-pdf')}
                  className={`relative z-10 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                    activeToolId === 'compress-pdf'
                      ? 'text-brand-600 dark:text-brand-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Compress PDF
                </button>

                {/* Dropdown: CONVERT PDF */}
                <div
                  className="relative"
                  onMouseEnter={handleDropdownAreaEnter}
                  onMouseLeave={handleDropdownAreaLeave}
                >
                  <button
                    ref={el => (buttonRefs.current['convert'] = el)}
                    type="button"
                    onMouseEnter={e => handleDropdownTriggerEnter('convert', e)}
                    onClick={() => setActiveDropdown(activeDropdown === 'convert' ? null : 'convert')}
                    className={`relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                      activeDropdown === 'convert'
                        ? 'text-brand-600 dark:text-brand-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>Convert PDF</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === 'convert' ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
                      }`}
                    />
                  </button>

                  {/* 100% Solid Opaque Convert PDF Dropdown */}
                  {activeDropdown === 'convert' && (
                    <div
                      onMouseEnter={handleDropdownAreaEnter}
                      onMouseLeave={handleDropdownAreaLeave}
                      className="absolute left-0 mt-3 w-[560px] p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] grid grid-cols-2 gap-6 animate-in fade-in-50 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/5 dark:ring-white/10"
                    >
                      {/* Column 1: CONVERT TO PDF */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-500" />
                            CONVERT TO PDF
                          </span>
                        </div>
                        <div className="space-y-1">
                          {CONVERT_TO_PDF_ITEMS.map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToolClick(item.id)}
                              className="w-full group flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-150"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-slate-700 text-brand-600 dark:text-brand-400 transition-colors">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500 group-hover:bg-brand-100 dark:group-hover:bg-slate-700 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                                {item.ext}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Column 2: CONVERT FROM PDF */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-500" />
                            CONVERT FROM PDF
                          </span>
                        </div>
                        <div className="space-y-1">
                          {CONVERT_FROM_PDF_ITEMS.map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToolClick(item.id)}
                              className="w-full group flex items-center justify-between p-2 rounded-xl text-left text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-150"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-brand-50 dark:group-hover:bg-slate-700 text-purple-600 dark:text-purple-400 transition-colors">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="group-hover:translate-x-1 transition-transform">{item.name}</span>
                              </div>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-slate-500 group-hover:bg-brand-100 dark:group-hover:bg-slate-700 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                                {item.ext}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mega Dropdown: ALL PDF TOOLS (3 Clear Columns, 100% Opaque, Zero Clutter) */}
                <div
                  className="relative"
                  onMouseEnter={handleDropdownAreaEnter}
                  onMouseLeave={handleDropdownAreaLeave}
                >
                  <button
                    ref={el => (buttonRefs.current['all-pdf'] = el)}
                    type="button"
                    onMouseEnter={e => handleDropdownTriggerEnter('all-pdf', e)}
                    onClick={() => setActiveDropdown(activeDropdown === 'all-pdf' ? null : 'all-pdf')}
                    className={`relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                      activeDropdown === 'all-pdf'
                        ? 'text-brand-600 dark:text-brand-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>All PDF Tools</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === 'all-pdf' ? 'rotate-180 text-brand-600 dark:text-brand-400' : ''
                      }`}
                    />
                  </button>

                  {/* 100% Solid Opaque 3-Column Mega Menu */}
                  {activeDropdown === 'all-pdf' && (
                    <div
                      onMouseEnter={handleDropdownAreaEnter}
                      onMouseLeave={handleDropdownAreaLeave}
                      className="absolute -left-32 xl:-left-20 mt-3 w-[840px] max-w-[calc(100vw-2rem)] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] grid grid-cols-3 gap-6 animate-in fade-in-50 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/5 dark:ring-white/10"
                    >
                      {/* Column 1: ORGANIZE & EDIT */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-indigo-500" />
                            ORGANIZE & EDIT ({pdfOrganizeTools.length})
                          </span>
                        </div>
                        <div className="space-y-1">
                          {pdfOrganizeTools.map(tool => {
                            const IconComponent = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleToolClick(tool.id)}
                                className="w-full group flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-indigo-50/70 dark:hover:bg-slate-800 transition-all duration-150"
                              >
                                <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all">
                                    {tool.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {tool.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 2: CONVERT TO PDF */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            CONVERT TO PDF ({pdfConvertToTools.length})
                          </span>
                        </div>
                        <div className="space-y-1">
                          {pdfConvertToTools.map(tool => {
                            const IconComponent = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleToolClick(tool.id)}
                                className="w-full group flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-blue-50/70 dark:hover:bg-slate-800 transition-all duration-150"
                              >
                                <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all">
                                    {tool.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {tool.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Column 3: CONVERT FROM PDF & SECURITY */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            CONVERT FROM & SECURE ({pdfConvertFromTools.length})
                          </span>
                        </div>
                        <div className="space-y-1">
                          {pdfConvertFromTools.map(tool => {
                            const IconComponent = tool.icon;
                            return (
                              <button
                                key={tool.id}
                                type="button"
                                onClick={() => handleToolClick(tool.id)}
                                className="w-full group flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 dark:hover:bg-slate-800 transition-all duration-150"
                              >
                                <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all">
                                    {tool.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                    {tool.desc}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dropdown: DAILY SMART UTILITIES */}
                <div
                  className="relative"
                  onMouseEnter={handleDropdownAreaEnter}
                  onMouseLeave={handleDropdownAreaLeave}
                >
                  <button
                    ref={el => (buttonRefs.current['utilities'] = el)}
                    type="button"
                    onMouseEnter={e => handleDropdownTriggerEnter('utilities', e)}
                    onClick={() => setActiveDropdown(activeDropdown === 'utilities' ? null : 'utilities')}
                    className={`relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                      activeDropdown === 'utilities'
                        ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Daily Smart</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === 'utilities' ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''
                      }`}
                    />
                  </button>

                  {/* 100% Solid Opaque Daily Smart Dropdown */}
                  {activeDropdown === 'utilities' && (
                    <div
                      onMouseEnter={handleDropdownAreaEnter}
                      onMouseLeave={handleDropdownAreaLeave}
                      className="absolute -left-16 mt-3 w-[500px] p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] grid grid-cols-2 gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/5 dark:ring-white/10"
                    >
                      <div className="col-span-2 px-1 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          DAILY SMART UTILITIES (9 TOOLS)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCategoryNav('utilities')}
                          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1"
                        >
                          View Grid <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      {dailyUtilitiesList.map(tool => {
                        const IconComponent = tool.icon;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => handleToolClick(tool.id)}
                            className="group flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-emerald-50/70 dark:hover:bg-slate-800 transition-all duration-150"
                          >
                            <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {tool.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {tool.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Dropdown: DEVELOPER & TEXT */}
                <div
                  className="relative"
                  onMouseEnter={handleDropdownAreaEnter}
                  onMouseLeave={handleDropdownAreaLeave}
                >
                  <button
                    ref={el => (buttonRefs.current['dev'] = el)}
                    type="button"
                    onMouseEnter={e => handleDropdownTriggerEnter('dev', e)}
                    onClick={() => setActiveDropdown(activeDropdown === 'dev' ? null : 'dev')}
                    className={`relative z-10 flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-150 ${
                      activeDropdown === 'dev'
                        ? 'text-amber-600 dark:text-amber-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span>Dev & Text</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        activeDropdown === 'dev' ? 'rotate-180 text-amber-600 dark:text-amber-400' : ''
                      }`}
                    />
                  </button>

                  {/* 100% Solid Opaque Dev & Text Dropdown (Anchored right to avoid overflow) */}
                  {activeDropdown === 'dev' && (
                    <div
                      onMouseEnter={handleDropdownAreaEnter}
                      onMouseLeave={handleDropdownAreaLeave}
                      className="absolute right-0 mt-3 w-[520px] p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] grid grid-cols-2 gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/5 dark:ring-white/10"
                    >
                      <div className="col-span-2 px-1 pb-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" />
                          DEVELOPER & TEXT (10 TOOLS)
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCategoryNav('dev')}
                          className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1"
                        >
                          View Grid <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      {devToolsList.map(tool => {
                        const IconComponent = tool.icon;
                        return (
                          <button
                            key={tool.id}
                            type="button"
                            onClick={() => handleToolClick(tool.id)}
                            className="group flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-amber-50/70 dark:hover:bg-slate-800 transition-all duration-150"
                          >
                            <div className={`p-1.5 rounded-lg ${tool.bg} ${tool.color} shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {tool.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {tool.desc}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:border-brand-300 dark:hover:border-brand-700 hover:text-slate-900 dark:hover:text-white hover:shadow-xs text-xs sm:text-sm transition-all"
              >
                <Search className="w-3.5 h-3.5 text-brand-500" />
                <span className="hidden sm:inline">Search 42 tools...</span>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Favorites Filter button */}
              <button
                type="button"
                onClick={() => {
                  setActiveToolId(null);
                  setActiveCategory('favorites');
                }}
                title="Saved Favorites"
                className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:border-amber-300 transition-all shadow-xs active:scale-95"
              >
                <Bookmark className="w-4 h-4" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-in zoom-in-50 duration-200">
                    {favorites.length}
                  </span>
                )}
              </button>

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 hover:border-brand-300 transition-all shadow-xs active:scale-95"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(prev => !prev)}
                aria-label="Toggle Mobile Navigation"
                className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-all active:scale-95"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Slide Drawer (100% Solid Opaque) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-5 space-y-5 animate-in slide-in-from-top-4 duration-300 max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Quick PDF shortcuts */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Popular Quick Actions</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleToolClick('merge-pdf')}
                  className="p-2.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-xs font-bold text-center text-brand-700 dark:text-brand-300 hover:scale-[1.02] transition-transform"
                >
                  Merge PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('split-pdf')}
                  className="p-2.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-xs font-bold text-center text-brand-700 dark:text-brand-300 hover:scale-[1.02] transition-transform"
                >
                  Split PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleToolClick('compress-pdf')}
                  className="p-2.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-xs font-bold text-center text-brand-700 dark:text-brand-300 hover:scale-[1.02] transition-transform"
                >
                  Compress
                </button>
              </div>
            </div>

            {/* Categories */}
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{cat.name}</span>
                  <button
                    type="button"
                    onClick={() => handleCategoryNav(cat.id)}
                    className="text-brand-600 dark:text-brand-400 text-xs font-semibold hover:underline"
                  >
                    View All →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {TOOLS.filter(t => t.category === cat.id).map(tool => (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleToolClick(tool.id)}
                      className="flex items-center gap-2 p-2 rounded-xl text-left text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50 dark:hover:bg-slate-800 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                      <span className="truncate">{tool.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </header>
    </>
  );
};
