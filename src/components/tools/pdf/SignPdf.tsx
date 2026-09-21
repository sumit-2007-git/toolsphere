import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { signPdf, getPdfPageCount } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { PenTool, Download, Loader2, Eraser, Type, Upload } from 'lucide-react';

export const SignPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [signatureMode, setSignatureMode] = useState<'draw' | 'type'>('draw');
  const [typedName, setTypedName] = useState('');
  const [penColor, setPenColor] = useState('#0f172a');
  const [totalPages, setTotalPages] = useState<number>(1);
  const [targetPage, setTargetPage] = useState<number>(0); // 0-indexed
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    if (signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = penColor;
      }
    }
  }, [signatureMode, penColor]);

  const handleFileChange = async (files: File[]) => {
    setFile(files);
    if (files[0]) {
      try {
        const buf = await readFileAsArrayBuffer(files[0]);
        const count = await getPdfPageCount(buf);
        setTotalPages(count);
        setTargetPage(count - 1); // default to last page
      } catch {
        setTotalPages(1);
      }
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
    setHasSignature(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  };

  const getSignatureDataUrl = (): string => {
    if (signatureMode === 'draw') {
      return canvasRef.current?.toDataURL('image/png') || '';
    } else {
      // Render cursive text to canvas
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.font = 'italic 44px "Brush Script MT", "Segoe Script", cursive';
        ctx.fillStyle = penColor;
        ctx.fillText(typedName || 'Signature', 40, 80);
      }
      return canvas.toDataURL('image/png');
    }
  };

  const handleSign = async () => {
    if (!file[0]) return;
    const sigUrl = getSignatureDataUrl();
    if (!sigUrl || (signatureMode === 'draw' && !hasSignature) || (signatureMode === 'type' && !typedName.trim())) {
      addToast('error', 'Please provide a signature before applying.');
      return;
    }

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);

      const signedBytes = await signPdf(buf, sigUrl, {
        pageIndex: targetPage,
        x: 350,
        y: 60,
        width: 180,
        height: 70,
      });

      downloadPdf(signedBytes, `${file[0].name.replace('.pdf', '')}_signed.pdf`);
      addToast('success', 'Signed PDF generated and downloaded!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to sign PDF', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={file}
          onFilesChange={handleFileChange}
          title="Upload a PDF file to sign"
          subtitle="Place your electronic signature on the document"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Signature Mode Toggle */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSignatureMode('draw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  signatureMode === 'draw'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Draw Signature</span>
              </button>

              <button
                type="button"
                onClick={() => setSignatureMode('type')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  signatureMode === 'type'
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>Type Signature</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Color:</span>
              {['#0f172a', '#1d4ed8', '#b91c1c'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPenColor(c)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    penColor === c ? 'border-brand-500 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Signature Pad */}
          {signatureMode === 'draw' ? (
            <div className="space-y-2">
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-800/30">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={180}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-44 cursor-crosshair touch-none"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-slate-400">
                    Draw your signature here using mouse or fingertip
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Clear Pad</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="text"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Type your full name..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
                <span
                  style={{
                    fontFamily: '"Brush Script MT", "Segoe Script", cursive',
                    fontSize: '38px',
                    color: penColor,
                  }}
                >
                  {typedName || 'Your Signature'}
                </span>
              </div>
            </div>
          )}

          {/* Target Page Selector */}
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Place on Page:
              </label>
              <select
                value={targetPage}
                onChange={(e) => setTargetPage(parseInt(e.target.value, 10))}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i} value={i}>
                    Page {i + 1} {i === totalPages - 1 ? '(Last Page)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSign}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Applying Signature...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Sign & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
