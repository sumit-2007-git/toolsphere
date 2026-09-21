# ToolSphere – All-in-One Smart Utility Tools

> **Fast, 100% Private, Client-Side Utility Platform with 34+ Built-in Tools.**  
> Built with React 18, TypeScript, Tailwind CSS, pdf-lib, and pdfjs-dist. Zero backend dependencies, zero server costs, and infinite scalability.

---

## 🌟 Why ToolSphere?

- **100% Client-Side Processing**: Every single tool (including PDF merging, splitting, watermarking, page numbering, image compression, and QR code generation) executes entirely in the user's browser. Files never touch any remote server.
- **Zero Server Costs**: Because everything runs in the browser, you can host ToolSphere on free static hosting (Vercel, Netlify, GitHub Pages, Cloudflare Pages) with unlimited traffic without incurring server bills.
- **Distinct Modern UI/UX**: Designed from the ground up with a modern 2026 SaaS design language (Linear/Raycast inspired), featuring dark/light theme switching, `⌘K` / `Ctrl+K` quick search modal, favorites bookmarks, and responsive mobile/desktop layouts.
- **Complete Suite of 34+ Real Tools**: All tools are fully functional with real processing, progress feedback, and instant downloads.

---

## 🛠️ Complete Tool Catalog (34 Tools)

### 1. 📄 PDF Tools (15 Tools)
1. **Merge PDF**: Combine multiple PDF files into a single unified document with custom drag-and-drop ordering.
2. **Split PDF**: Split every page into separate files (ZIP archive) or extract custom page ranges (e.g. `1-3, 5`).
3. **Compress PDF**: Optimize PDF file size via object stream compression and metadata deduplication.
4. **PDF to JPG**: Render every PDF page into high-resolution JPG images with single/batch ZIP download.
5. **JPG to PDF**: Convert JPG, PNG, and WebP images into a formatted PDF document with orientation & margin controls.
6. **Rotate PDF**: Rotate pages 90°, 180°, or 270° clockwise or counter-clockwise.
7. **Protect PDF**: Add security encryption to your confidential PDF documents.
8. **Unlock PDF**: Remove passwords and security restrictions from authorized PDF files.
9. **Add Watermark**: Stamp custom text watermarks across every page with live preview, opacity, angle, and color controls.
10. **Add Page Numbers**: Insert page numbering in headers or footers with customizable formatting (`Page X of Y`, `X / Y`, `- X -`).
11. **Organize PDF**: Interactive page thumbnail gallery to reorder, duplicate, or delete specific pages visually.
12. **Sign PDF**: Electronic signature pad (draw with mouse/touch or type cursive signature) placed directly onto PDF pages.
13. **Text to PDF**: Convert text notes, memos, or markdown into a clean formatted PDF document.
14. **PDF to Text**: Extract raw text paragraphs from PDF documents client-side with 1-click copy or `.txt` download.
15. **Crop & Resize PDF**: Trim unwanted scan margins and adjust page boundaries.

### 2. ⚡ Daily Smart Utilities (9 Tools)
16. **QR Code Generator**: Create custom QR codes from URLs, plain text, WiFi networks, emails, or phone numbers with color customization and PNG download.
17. **Password Generator**: Generate high-entropy, cryptographically strong passwords with custom length, symbols, numbers, and strength entropy gauge.
18. **Age Calculator**: Calculate exact age in years, months, and days, lifetime hours/minutes, next birthday countdown, and Western/Chinese zodiac signs.
19. **Unit Converter**: Real-time two-way conversion for Length, Weight, Temperature, Speed, and Digital Storage.
20. **Percentage Calculator**: 4 practical calculators in one (X% of Y, X is what % of Y, Percentage increase/decrease, Exam marks percentage).
21. **BMI Calculator**: Body Mass Index calculator with Metric/Imperial toggles, WHO health classification, color-coded gauge, and healthy weight range.
22. **To-Do List**: Interactive task manager with priority tags, completion percentage bar, filtering (All, Active, Completed), and `localStorage` persistence.
23. **Quick Notes**: Multi-note scratchpad with auto-save to browser storage, word/character counter, and `.txt`/`.md` export.
24. **Image Compressor**: Compress JPG, PNG, and WebP images with a live quality slider, side-by-side comparison, and file size savings breakdown.

### 3. 💻 Developer & Text Tools (10 Tools)
25. **Word Counter**: Real-time metrics for words, characters (with/without spaces), sentences, reading/speaking time, and keyword density.
26. **Case Converter**: Instant text transforms (UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, CONSTANT_CASE).
27. **Random Number Generator**: Custom bounds, multiple numbers generation, unique values toggle, plus virtual 6-sided dice roll and coin flipper.
28. **Color Picker & Palette**: Interactive color picker with HEX, RGB, HSL, CMYK conversions, WCAG accessibility contrast score, and complementary palette generator.
29. **Typing Speed Test**: 60-second interactive typing speed test with real-time WPM, accuracy %, character error highlighting, and celebration confetti.
30. **Countdown Timer**: Duration timer and event countdown with audio beep alert and pause/resume controls.
31. **Stopwatch**: Millisecond-precision stopwatch with lap recording and fastest/slowest lap highlight indicators.
32. **JSON Formatter & Validator**: Prettify (2/4 spaces), minify, syntax validation with error line detection, and download.
33. **HTML Encoder / Decoder**: Convert special characters to HTML entities (`&lt;`, `&gt;`, `&amp;`, etc.) and decode back safely.
34. **File Extension Checker**: Inspect true binary headers (magic bytes / signatures) to identify authentic MIME types and repair incorrect extensions.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or newer)
- npm or pnpm or yarn

### 1. Clone or Open Project
```bash
cd toolsphere
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Build for Production
```bash
npm run build
```
The optimized static build will be placed in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Instant Free Deployment Guide

Because **ToolSphere is 100% client-side**, you can deploy it to any static web host with zero configuration and zero hosting fees:

### Option A: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Accept the defaults. Done!

### Option B: Netlify
1. Run `npm run build`.
2. Drag and drop the `dist` folder directly onto [Netlify Drop](https://app.netlify.com/drop).

### Option C: Cloudflare Pages / GitHub Pages
1. Push the project to a GitHub repository.
2. In Cloudflare Pages or GitHub Pages:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - Framework preset: **Vite**

---

## 🔒 Privacy & Security Notice
All processing is done **100% locally** using the browser's JavaScript and WebAssembly engine. Files and entered passwords never leave your computer.
