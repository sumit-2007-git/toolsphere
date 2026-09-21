import { ToolItem, CategoryInfo } from '../types/tools';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'pdf',
    name: 'PDF Tools',
    shortDesc: 'Complete suite to merge, split, compress, convert, edit and sign PDFs in browser',
    icon: 'FileText',
    accentColor: 'indigo'
  },
  {
    id: 'utilities',
    name: 'Daily Smart Utilities',
    shortDesc: 'Everyday productivity tools from QR code generation to calculators and notes',
    icon: 'Sparkles',
    accentColor: 'emerald'
  },
  {
    id: 'dev',
    name: 'Developer & Text Tools',
    shortDesc: 'Fast formatting, encoding, inspection, counting, and time utilities for builders',
    icon: 'Terminal',
    accentColor: 'amber'
  }
];

export const TOOLS: ToolItem[] = [
  // ==================== PDF TOOLS (15 tools) ====================
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Combine multiple PDF files into a single unified document in your preferred order.',
    detailedDescription: 'Upload multiple PDF files, arrange them with drag-and-drop ordering, and merge them into one organized PDF within seconds.',
    icon: 'Files',
    tags: ['combine', 'join', 'merge', 'pdf', 'document'],
    popular: true,
    featured: true
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Separate one page or an entire set of pages for easy conversion into independent PDF files.',
    detailedDescription: 'Extract custom page ranges (e.g. 1-3, 5) or split every single page into separate standalone PDF files packaged neatly in a zip.',
    icon: 'Split',
    tags: ['split', 'extract', 'range', 'pages', 'separate'],
    popular: true
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Reduce PDF file size drastically while maintaining optimal visual clarity and quality.',
    detailedDescription: 'Client-side compression that removes duplicate streams, downsamples oversized images, and shrinks file size for easy emailing.',
    icon: 'Minimize2',
    tags: ['compress', 'shrink', 'reduce size', 'optimize', 'lightweight'],
    popular: true,
    badge: 'Optimized'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert every page of a PDF file into high-definition JPG image files.',
    detailedDescription: 'Extract high-resolution JPG images from each page of your PDF document. Download individually or as a single ZIP archive.',
    icon: 'Image',
    tags: ['convert', 'pdf to image', 'jpg', 'jpeg', 'render'],
    popular: true
  },
  {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Transform JPG, PNG, and WebP images into a standardized, beautifully ordered PDF.',
    detailedDescription: 'Upload photos or scanned documents, adjust orientation, margins, and page order, and generate a print-ready PDF file instantly.',
    icon: 'FileImage',
    tags: ['convert', 'image to pdf', 'photo', 'scanner', 'pictures'],
    popular: true
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Rotate your PDF pages 90°, 180°, or 270° clockwise or counterclockwise.',
    detailedDescription: 'Fix upside-down or sideways scans by rotating all pages or individual target pages with instant visual orientation adjustments.',
    icon: 'RotateCw',
    tags: ['rotate', 'turn', 'orientation', 'upside down', 'landscape', 'portrait']
  },
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Encrypt your confidential PDF files with a secure password to prevent unauthorized access.',
    detailedDescription: 'Add robust client-side password protection to ensure only authorized recipients can view your confidential document.',
    icon: 'Lock',
    tags: ['encrypt', 'password', 'secure', 'lock', 'privacy'],
    badge: 'Secure'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Remove password and encryption from secured PDF documents with authorized access.',
    detailedDescription: 'Enter the password once to decrypt and save an unlocked, password-free version of your PDF for easy sharing.',
    icon: 'Unlock',
    tags: ['decrypt', 'remove password', 'unlock', 'open']
  },
  {
    id: 'watermark-pdf',
    name: 'Add Watermark',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Stamp text or branding watermarks across every page of your PDF with custom opacity.',
    detailedDescription: 'Add "CONFIDENTIAL", "DRAFT", or your company brand across all pages with full control over text, rotation, font size, and transparency.',
    icon: 'Stamp',
    tags: ['watermark', 'brand', 'confidential', 'stamp', 'copyright']
  },
  {
    id: 'page-numbers-pdf',
    name: 'Add Page Numbers',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Insert customizable page numbers at headers or footers with automated pagination.',
    detailedDescription: 'Choose position (bottom-right, bottom-center, header), numbering format ("Page 1 of N", "1", "- 1 -"), and typography styling.',
    icon: 'Hash',
    tags: ['numbers', 'pagination', 'footer', 'header', 'pages']
  },
  {
    id: 'organize-pdf',
    name: 'Organize PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Sort, delete, duplicate, and reorder pages of your PDF document visually.',
    detailedDescription: 'View an interactive thumbnail gallery of all pages in your document. Drag to reorder, click trash to delete, or duplicate pages on the fly.',
    icon: 'Layers',
    tags: ['organize', 'reorder', 'delete pages', 'sort', 'arrange'],
    badge: 'Interactive'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Draw, type, or upload your electronic signature and stamp it directly onto PDF documents.',
    detailedDescription: 'Smooth HTML5 signature drawing canvas with smoothing, customizable pen thickness/color, and instant placement on document pages.',
    icon: 'PenTool',
    tags: ['sign', 'signature', 'draw', 'esign', 'stamp'],
    popular: true
  },
  {
    id: 'text-to-pdf',
    name: 'Text to PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert raw text, notes, code, or memos into a formatted PDF document.',
    detailedDescription: 'Type or paste any text content, configure font size, line height, and page margins, and generate a clean, readable PDF document.',
    icon: 'FileText',
    tags: ['text', 'txt', 'convert', 'notes to pdf', 'writer']
  },
  {
    id: 'pdf-to-text',
    name: 'PDF to Text',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Extract and copy raw textual content from uploaded PDF documents.',
    detailedDescription: 'Pull out textual paragraphs from all pages without formatting overhead, perfect for summarizing, editing, or copying into other tools.',
    icon: 'FileCode',
    tags: ['extract', 'text extraction', 'copy text', 'reader']
  },
  {
    id: 'crop-pdf',
    name: 'Crop & Resize PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Adjust page boundaries, trim unwanted white margins, or convert between A4 and Letter.',
    detailedDescription: 'Trim unwanted scan borders, set custom page padding, or resize document layout to standard paper dimensions.',
    icon: 'Crop',
    tags: ['crop', 'margins', 'resize', 'trim', 'paper size']
  },

  // --- CONVERT TO PDF SUITE ---
  {
    id: 'word-to-pdf',
    name: 'WORD to PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert Microsoft Word DOC and DOCX files into high-quality PDF documents.',
    detailedDescription: 'Upload Word (.docx) documents and convert them cleanly into PDF documents preserving formatting, paragraphs, and headings.',
    icon: 'FileText',
    tags: ['word to pdf', 'docx', 'doc', 'convert', 'office'],
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'powerpoint-to-pdf',
    name: 'POWERPOINT to PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert PowerPoint PPT and PPTX presentations into PDF slide decks.',
    detailedDescription: 'Convert slides, keynote presentations, and PPTX files into ready-to-present, shareable PDF documents.',
    icon: 'Presentation',
    tags: ['powerpoint', 'pptx', 'presentation', 'slides', 'convert']
  },
  {
    id: 'excel-to-pdf',
    name: 'EXCEL to PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert Excel spreadsheets and workbooks (XLS, XLSX) into formatted PDF tables.',
    detailedDescription: 'Upload spreadsheets and export cleanly structured printable PDF tables with automatic column alignment.',
    icon: 'Table',
    tags: ['excel to pdf', 'xlsx', 'xls', 'spreadsheet', 'sheets']
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert webpages, HTML code, or HTML files into standard PDF documents.',
    detailedDescription: 'Render HTML documents and code structures into formatted PDF pages with standard typography.',
    icon: 'Code',
    tags: ['html to pdf', 'webpage', 'convert', 'code to pdf']
  },

  // --- CONVERT FROM PDF SUITE ---
  {
    id: 'pdf-to-word',
    name: 'PDF to WORD',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert PDF documents into editable Microsoft Word (.docx) documents.',
    detailedDescription: 'Extract text, formatting, and paragraphs from your PDF and download an editable DOCX Word document.',
    icon: 'FileText',
    tags: ['pdf to word', 'docx', 'doc', 'editable', 'extract'],
    popular: true,
    badge: 'Popular'
  },
  {
    id: 'pdf-to-powerpoint',
    name: 'PDF to POWERPOINT',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Turn your PDF documents into editable PowerPoint (.pptx) slide decks.',
    detailedDescription: 'Convert each page of your PDF into an individual PowerPoint presentation slide.',
    icon: 'Presentation',
    tags: ['pdf to ppt', 'pptx', 'slides', 'presentation']
  },
  {
    id: 'pdf-to-excel',
    name: 'PDF to EXCEL',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Extract data and tables from PDF documents into editable Excel (.xlsx) spreadsheets.',
    detailedDescription: 'Pull structured data and financial figures from PDF pages straight into an Excel spreadsheet.',
    icon: 'Table',
    tags: ['pdf to excel', 'xlsx', 'sheets', 'tables', 'data']
  },
  {
    id: 'pdf-to-pdfa',
    name: 'PDF to PDF/A',
    category: 'pdf',
    categoryName: 'PDF Tools',
    description: 'Convert PDF to an ISO-standardized PDF/A document for long-term legal archiving.',
    detailedDescription: 'Conforms your PDF document to PDF/A-1b standards with embedded color profiles and archiving metadata.',
    icon: 'ShieldCheck',
    tags: ['pdfa', 'pdf/a', 'iso', 'archive', 'legal', 'compliance'],
    badge: 'ISO'
  },

  // ==================== DAILY SMART UTILITIES (9 tools) ====================
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Generate high-resolution QR codes from text, web URLs, WiFi credentials, or contact info.',
    detailedDescription: 'Create custom QR codes with customizable foreground and background colors, error correction levels, live preview, and PNG/SVG download.',
    icon: 'QrCode',
    tags: ['qr', 'code', 'barcode', 'generator', 'wifi', 'url'],
    popular: true,
    featured: true
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Generate cryptographically strong, unbreakable passwords with customizable entropy rules.',
    detailedDescription: 'Configure length (up to 64 chars), uppercase, lowercase, numbers, symbols, avoid ambiguous characters, and check real-time entropy strength.',
    icon: 'Key',
    tags: ['password', 'security', 'generator', 'strong', 'entropy'],
    popular: true
  },
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Calculate your exact age in years, months, days, hours, and find your next birthday countdown.',
    detailedDescription: 'Enter your date of birth to get exact age breakdown, total days and minutes lived, western & chinese zodiac signs, and days until next celebration.',
    icon: 'Calendar',
    tags: ['age', 'birthday', 'calculator', 'days', 'zodiac']
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Convert between units across Length, Weight, Temperature, Speed, Area, and Digital Storage.',
    detailedDescription: 'Comprehensive unit conversion suite: km/miles, kg/lbs/grams, Celsius/Fahrenheit/Kelvin, sq ft/meters, bytes/GB/TB with instant two-way calculation.',
    icon: 'ArrowLeftRight',
    tags: ['unit', 'converter', 'metric', 'imperial', 'length', 'weight', 'temperature'],
    popular: true
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Calculate percentages, exam marks, percentage increase/decrease, and discount values.',
    detailedDescription: 'Four interactive calculators in one: find X% of Y, calculate what percentage X is of Y, percentage increase/decrease change, and exam marks percentage.',
    icon: 'Percent',
    tags: ['percentage', 'calculator', 'marks', 'discount', 'math']
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Calculate Body Mass Index based on height and weight with WHO health classification.',
    detailedDescription: 'Switch easily between Metric (cm/kg) and Imperial (ft/in/lbs). Visual color-coded gauge displays underweight, normal, overweight, or obese ranges.',
    icon: 'Activity',
    tags: ['bmi', 'fitness', 'health', 'weight', 'height', 'calculator']
  },
  {
    id: 'todo-list',
    name: 'To-Do List',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Manage daily tasks, prioritize action items, and track your completion progress with auto-save.',
    detailedDescription: 'Intuitive task manager with priority tags (High/Medium/Low), category filtering, due dates, completion percentage bar, and persistent browser storage.',
    icon: 'CheckSquare',
    tags: ['todo', 'tasks', 'productivity', 'checklist', 'organizer']
  },
  {
    id: 'notes-tool',
    name: 'Quick Notes',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Write, auto-save, and manage notes and ideas directly in your browser with export options.',
    detailedDescription: 'Distraction-free scratchpad with multi-note tabs, live word counter, instant auto-save to localStorage, copy button, and TXT/Markdown export.',
    icon: 'StickyNote',
    tags: ['notes', 'notepad', 'scratchpad', 'memo', 'write']
  },
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    category: 'utilities',
    categoryName: 'Daily Smart Utilities',
    description: 'Compress JPG, PNG, and WebP images to reduce file size with quality slider and live preview.',
    detailedDescription: 'Client-side HTML5 canvas image optimizer. Adjust compression quality slider, inspect before/after file sizes, calculate % saved, and download.',
    icon: 'FileImage',
    tags: ['compress', 'image', 'photo', 'shrink', 'quality', 'optimize'],
    popular: true,
    badge: 'Popular'
  },

  // ==================== DEVELOPER & TEXT TOOLS (10 tools) ====================
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Real-time count of words, characters, sentences, paragraphs, and estimated reading time.',
    detailedDescription: 'Analyze your content with live metrics: words, characters with/without spaces, sentences, paragraphs, reading speed, speaking duration, and top keywords.',
    icon: 'Type',
    tags: ['word counter', 'character count', 'reading time', 'text', 'analysis'],
    popular: true
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and more.',
    detailedDescription: 'Instant text transforms: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE with 1-click clipboard copy.',
    icon: 'Binary',
    tags: ['case', 'uppercase', 'lowercase', 'titlecase', 'camelcase', 'snakecase', 'format']
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Generate customizable random numbers, roll virtual dice, or flip a fair coin.',
    detailedDescription: 'Set custom min and max bounds, generate multiple numbers at once, toggle unique values (no duplicates), roll 6-sided dice, or flip a virtual coin.',
    icon: 'Dices',
    tags: ['random', 'numbers', 'dice', 'coin', 'rng', 'chance']
  },
  {
    id: 'color-picker',
    name: 'Color Picker & Palette',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Pick colors, convert between HEX, RGB, HSL, CMYK, and check WCAG contrast compliance.',
    detailedDescription: 'Interactive color canvas with EyeDropper API support, HEX/RGB/HSL conversion, complimentary color palette generator, and accessible contrast scoring.',
    icon: 'Palette',
    tags: ['color', 'picker', 'hex', 'rgb', 'hsl', 'contrast', 'palette'],
    popular: true
  },
  {
    id: 'typing-speed-test',
    name: 'Typing Speed Test',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Test your typing speed (Words Per Minute), accuracy, and mistake frequency with live feedback.',
    detailedDescription: 'Practice typing engaging passages with live WPM calculation, real-time error highlighting, accuracy score, and celebratory confetti upon completion.',
    icon: 'Gauge',
    tags: ['typing', 'wpm', 'speed', 'test', 'accuracy', 'keyboard']
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Set countdowns for deadlines, events, or workouts with full-screen view and sound alert.',
    detailedDescription: 'Target a specific date/time or set a custom hours/minutes/seconds countdown. Features flip cards, pause/resume, audio bell alert, and full-screen mode.',
    icon: 'Clock',
    tags: ['countdown', 'timer', 'alarm', 'event', 'clock']
  },
  {
    id: 'stopwatch',
    name: 'Stopwatch',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'High-precision millisecond stopwatch with lap tracking and fastest/slowest lap analysis.',
    detailedDescription: 'Precision timing with clean Start, Pause, Resume, and Reset controls. Record unlimited laps with visual indicators for the fastest and slowest lap times.',
    icon: 'Watch',
    tags: ['stopwatch', 'laps', 'timer', 'precision', 'time']
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Format, validate, prettify, and minify JSON data with instant syntax error detection.',
    detailedDescription: 'Paste raw JSON to format with 2 or 4 space indentation, minify for production, validate syntax with line number error indicators, and copy cleanly.',
    icon: 'Code',
    tags: ['json', 'formatter', 'validator', 'prettify', 'minify', 'developer'],
    popular: true
  },
  {
    id: 'html-encoder',
    name: 'HTML Encoder / Decoder',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Encode special characters into HTML entities or decode entities back into readable text.',
    detailedDescription: 'Safely convert characters like <, >, &, ", \' into &lt;, &gt;, &amp;, etc. for embedding in source code, or decode raw entities back with live preview.',
    icon: 'Code2',
    tags: ['html', 'entities', 'encode', 'decode', 'security', 'escape']
  },
  {
    id: 'file-extension-checker',
    name: 'File Extension Checker',
    category: 'dev',
    categoryName: 'Developer & Text Tools',
    description: 'Analyze uploaded files, inspect true MIME types and magic bytes, and fix incorrect extensions.',
    detailedDescription: 'Inspect true file headers (magic bytes / file signatures) to determine the authentic file type, verify if the extension matches, and download with the corrected filename.',
    icon: 'FileSearch',
    tags: ['file', 'extension', 'mime', 'magic bytes', 'header', 'checker', 'inspector']
  }
];

export const POPULAR_TOOLS = TOOLS.filter(t => t.popular);
export const FEATURED_TOOLS = TOOLS.filter(t => t.featured);

export const CONVERT_TO_PDF_ITEMS = [
  { id: 'jpg-to-pdf', name: 'JPG to PDF', ext: 'JPG', icon: 'FileImage' },
  { id: 'word-to-pdf', name: 'WORD to PDF', ext: 'DOCX', icon: 'FileText' },
  { id: 'powerpoint-to-pdf', name: 'POWERPOINT to PDF', ext: 'PPTX', icon: 'Presentation' },
  { id: 'excel-to-pdf', name: 'EXCEL to PDF', ext: 'XLSX', icon: 'Table' },
  { id: 'html-to-pdf', name: 'HTML to PDF', ext: 'HTML', icon: 'Code' },
];

export const CONVERT_FROM_PDF_ITEMS = [
  { id: 'pdf-to-jpg', name: 'PDF to JPG', ext: 'JPG', icon: 'Image' },
  { id: 'pdf-to-word', name: 'PDF to WORD', ext: 'DOCX', icon: 'FileText' },
  { id: 'pdf-to-powerpoint', name: 'PDF to POWERPOINT', ext: 'PPTX', icon: 'Presentation' },
  { id: 'pdf-to-excel', name: 'PDF to EXCEL', ext: 'XLSX', icon: 'Table' },
  { id: 'pdf-to-pdfa', name: 'PDF to PDF/A', ext: 'PDF/A', icon: 'ShieldCheck' },
];
