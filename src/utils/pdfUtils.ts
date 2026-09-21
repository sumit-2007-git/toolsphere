import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';

export async function getPdfPageCount(buffer: ArrayBuffer): Promise<number> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  return pdfDoc.getPageCount();
}

/**
 * Merge multiple PDF buffers into a single PDF
 */
export async function mergePdfs(pdfBuffers: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();
  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  return await mergedPdf.save();
}

/**
 * Split PDF by page ranges or into individual pages
 */
export async function splitPdf(
  buffer: ArrayBuffer,
  rangeExpression: string = 'all'
): Promise<{ filename: string; data: Uint8Array }[]> {
  const sourcePdf = await PDFDocument.load(buffer);
  const totalPages = sourcePdf.getPageCount();
  const results: { filename: string; data: Uint8Array }[] = [];

  if (rangeExpression.toLowerCase().trim() === 'all') {
    // Split every single page into its own PDF
    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(sourcePdf, [i]);
      newPdf.addPage(copiedPage);
      const data = await newPdf.save();
      results.push({ filename: `page-${i + 1}.pdf`, data });
    }
  } else {
    // Parse ranges like "1-3, 5, 7-10"
    const ranges = rangeExpression.split(',').map(s => s.trim()).filter(Boolean);
    let rangeIndex = 1;

    for (const range of ranges) {
      const pageIndicesToCopy: number[] = [];
      if (range.includes('-')) {
        const [startStr, endStr] = range.split('-');
        const start = Math.max(1, parseInt(startStr, 10));
        const end = Math.min(totalPages, parseInt(endStr, 10));
        for (let p = start; p <= end; p++) {
          pageIndicesToCopy.push(p - 1);
        }
      } else {
        const p = parseInt(range, 10);
        if (p >= 1 && p <= totalPages) {
          pageIndicesToCopy.push(p - 1);
        }
      }

      if (pageIndicesToCopy.length > 0) {
        const newPdf = await PDFDocument.create();
        const copied = await newPdf.copyPages(sourcePdf, pageIndicesToCopy);
        copied.forEach(cp => newPdf.addPage(cp));
        const data = await newPdf.save();
        results.push({ filename: `extracted-range-${rangeIndex++}.pdf`, data });
      }
    }
  }

  return results;
}

/**
 * Rotate PDF pages by 90, 180, or 270 degrees
 */
export async function rotatePdf(
  buffer: ArrayBuffer,
  rotateDegrees: number = 90,
  pageIndices?: number[]
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  const targetIndices = pageIndices || pages.map((_, i) => i);

  for (const idx of targetIndices) {
    if (pages[idx]) {
      const currentRotation = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees((currentRotation + rotateDegrees) % 360));
    }
  }

  return await pdfDoc.save();
}

/**
 * Add custom watermark text across PDF pages
 */
export async function addWatermarkToPdf(
  buffer: ArrayBuffer,
  options: {
    text: string;
    opacity?: number;
    fontSize?: number;
    rotationDegrees?: number;
    colorHex?: string;
  }
): Promise<Uint8Array> {
  const {
    text,
    opacity = 0.35,
    fontSize = 48,
    rotationDegrees = 45,
    colorHex = '#dc2626'
  } = options;

  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  // Convert hex to rgb
  const hex = colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);

    page.drawText(text, {
      x: width / 2 - (textWidth / 2) * Math.cos((rotationDegrees * Math.PI) / 180),
      y: height / 2 - (textHeight / 2) * Math.sin((rotationDegrees * Math.PI) / 180),
      size: fontSize,
      font,
      color: rgb(r, g, b),
      opacity,
      rotate: degrees(rotationDegrees),
    });
  }

  return await pdfDoc.save();
}

/**
 * Add page numbers to header or footer
 */
export async function addPageNumbersToPdf(
  buffer: ArrayBuffer,
  options: {
    position?: 'bottom-center' | 'bottom-right' | 'top-right';
    format?: 'Page X of Y' | 'X / Y' | 'X' | '- X -';
    fontSize?: number;
    startFrom?: number;
  }
): Promise<Uint8Array> {
  const {
    position = 'bottom-right',
    format = 'Page X of Y',
    fontSize = 11,
    startFrom = 1
  } = options;

  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  pages.forEach((page, i) => {
    const currentNum = i + startFrom;
    let label = '';
    if (format === 'Page X of Y') label = `Page ${currentNum} of ${total + startFrom - 1}`;
    else if (format === 'X / Y') label = `${currentNum} / ${total + startFrom - 1}`;
    else if (format === '- X -') label = `- ${currentNum} -`;
    else label = `${currentNum}`;

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(label, fontSize);

    let x = width - textWidth - 36;
    let y = 30;

    if (position === 'bottom-center') {
      x = (width - textWidth) / 2;
      y = 30;
    } else if (position === 'top-right') {
      x = width - textWidth - 36;
      y = height - 36;
    }

    page.drawText(label, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.25, 0.25, 0.25),
    });
  });

  return await pdfDoc.save();
}

/**
 * Reorder, delete or sort PDF pages
 */
export async function organizePdf(
  buffer: ArrayBuffer,
  newOrderIndices: number[]
): Promise<Uint8Array> {
  const sourcePdf = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(sourcePdf, newOrderIndices);
  copiedPages.forEach(p => newPdf.addPage(p));

  return await newPdf.save();
}

/**
 * Convert plain text to formatted PDF
 */
export async function textToPdf(
  text: string,
  title: string = 'Document'
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28; // Standard A4 points
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 18;
  const fontSize = 11;

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - margin;

  // Title
  if (title) {
    currentPage.drawText(title, {
      x: margin,
      y: currentY,
      size: 20,
      font: boldFont,
      color: rgb(0.1, 0.1, 0.2),
    });
    currentY -= 32;
  }

  // Split lines and wrap
  const lines = text.split('\n');
  for (const rawLine of lines) {
    // Word wrap logic
    const words = rawLine.split(' ');
    let currentLine = '';

    for (let w = 0; w < words.length; w++) {
      const testLine = currentLine ? `${currentLine} ${words[w]}` : words[w];
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > contentWidth && currentLine) {
        if (currentY - lineHeight < margin) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          currentY = pageHeight - margin;
        }
        currentPage.drawText(currentLine, {
          x: margin,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0.15, 0.15, 0.15),
        });
        currentY -= lineHeight;
        currentLine = words[w];
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (currentY - lineHeight < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
      currentPage.drawText(currentLine, {
        x: margin,
        y: currentY,
        size: fontSize,
        font,
        color: rgb(0.15, 0.15, 0.15),
      });
      currentY -= lineHeight;
    }

    // Paragraph gap
    currentY -= 6;
  }

  return await pdfDoc.save();
}

/**
 * Stamp an e-signature onto a specific PDF page
 */
export async function signPdf(
  buffer: ArrayBuffer,
  signatureDataUrl: string,
  options: {
    pageIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();
  const page = pages[options.pageIndex] || pages[0];

  const pngImage = await pdfDoc.embedPng(signatureDataUrl);
  page.drawImage(pngImage, {
    x: options.x,
    y: options.y,
    width: options.width,
    height: options.height,
  });

  return await pdfDoc.save();
}

/**
 * Crop / Adjust margins of a PDF
 */
export async function cropPdf(
  buffer: ArrayBuffer,
  marginPt: number = 20
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { x, y, width, height } = page.getMediaBox();
    page.setMediaBox(
      x + marginPt,
      y + marginPt,
      Math.max(100, width - marginPt * 2),
      Math.max(100, height - marginPt * 2)
    );
  }

  return await pdfDoc.save();
}
