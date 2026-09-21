import { saveAs } from 'file-saver';

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  saveAs(blob, filename);
}

export function downloadPdf(bytes: Uint8Array, filename: string): void {
  const blob = new Blob([bytes as any], { type: 'application/pdf' });
  saveAs(blob, filename);
}

export interface FileTypeInfo {
  ext: string;
  mime: string;
  description: string;
  hexHeader: string;
}

export function detectFileTypeFromBuffer(buffer: ArrayBuffer): FileTypeInfo {
  const bytes = new Uint8Array(buffer.slice(0, 16));
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  // PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { ext: 'pdf', mime: 'application/pdf', description: 'Adobe Portable Document Format (PDF)', hexHeader: hex };
  }
  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    return { ext: 'png', mime: 'image/png', description: 'Portable Network Graphics (PNG)', hexHeader: hex };
  }
  // JPEG / JPG
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    return { ext: 'jpg', mime: 'image/jpeg', description: 'JPEG Image', hexHeader: hex };
  }
  // GIF
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { ext: 'gif', mime: 'image/gif', description: 'Graphics Interchange Format (GIF)', hexHeader: hex };
  }
  // WebP: RIFF ... WEBP
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
    return { ext: 'webp', mime: 'image/webp', description: 'Google WebP Image', hexHeader: hex };
  }
  // ZIP / DOCX / XLSX / PPTX
  if (bytes[0] === 0x50 && bytes[1] === 0x4B && (bytes[2] === 0x03 || bytes[2] === 0x05 || bytes[2] === 0x07)) {
    return { ext: 'zip', mime: 'application/zip', description: 'ZIP Compressed Archive / Office Open XML', hexHeader: hex };
  }
  // MP4
  if (bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) {
    return { ext: 'mp4', mime: 'video/mp4', description: 'MPEG-4 Video', hexHeader: hex };
  }
  // MP3: ID3
  if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
    return { ext: 'mp3', mime: 'audio/mpeg', description: 'MP3 Audio (ID3 tag)', hexHeader: hex };
  }

  // Fallback: check if text / JSON
  try {
    const textSample = new TextDecoder('utf-8', { fatal: true }).decode(buffer.slice(0, 256));
    if (textSample.trim().startsWith('{') || textSample.trim().startsWith('[')) {
      return { ext: 'json', mime: 'application/json', description: 'JSON Data Document', hexHeader: hex };
    }
    if (textSample.includes('<html') || textSample.includes('<!DOCTYPE')) {
      return { ext: 'html', mime: 'text/html', description: 'HTML Document', hexHeader: hex };
    }
    return { ext: 'txt', mime: 'text/plain', description: 'Plain Text Document', hexHeader: hex };
  } catch {
    return { ext: 'bin', mime: 'application/octet-stream', description: 'Binary Data / Unknown Format', hexHeader: hex };
  }
}
