import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { addWatermarkToPdf } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { Stamp, Download, Loader2, Sliders, Palette, RotateCw } from 'lucide-react';

export const WatermarkPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [text, setText] = useState('CONFIDENTIAL');
  const [color, setColor] = useState('#dc2626');
  const [opacity, setOpacity] = useState(0.35);
  const [fontSize, setFontSize] = useState(48);
  const [rotation, setRotation] = useState(45);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyWatermark = async () => {
    if (!file[0] || !text.trim()) return;

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const watermarkedBytes = await addWatermarkToPdf(buf, {
        text,
        opacity,
        fontSize,
        rotationDegrees: rotation,
        colorHex: color,
      });

      downloadPdf(watermarkedBytes, `${file[0].name.replace('.pdf', '')}_watermarked.pdf`);
      addToast('success', 'Watermark added successfully!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Failed to add watermark', err.message);
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
          onFilesChange={setFile}
          title="Upload a PDF file to add watermark"
          subtitle="Stamp your custom text watermark across every page"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Options Column */}
          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Watermark Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT, COPYRIGHT"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold tracking-wider text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300">{color}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Rotation Angle
                </label>
                <div className="flex items-center gap-1">
                  {[0, 45, -45, 90].map((deg) => (
                    <button
                      key={deg}
                      type="button"
                      onClick={() => setRotation(deg)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${
                        rotation === deg
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {deg}°
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Opacity</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Font Size</span>
                  <span>{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  step="2"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleApplyWatermark}
                disabled={isProcessing || !text.trim()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Applying Watermark...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Add Watermark & Download</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Visual Preview Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Watermark Preview
            </span>

            <div className="relative aspect-[3/4] w-full my-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
              <div className="p-4 text-center space-y-2 opacity-20 pointer-events-none select-none">
                <div className="h-2 w-32 bg-slate-400 rounded mx-auto" />
                <div className="h-2 w-48 bg-slate-400 rounded mx-auto" />
                <div className="h-2 w-40 bg-slate-400 rounded mx-auto" />
                <div className="h-2 w-44 bg-slate-400 rounded mx-auto" />
              </div>

              <div
                className="absolute font-bold tracking-widest text-center select-none pointer-events-none"
                style={{
                  color: color,
                  opacity: opacity,
                  fontSize: `${fontSize * 0.45}px`,
                  transform: `rotate(${rotation}deg)`,
                }}
              >
                {text || 'PREVIEW'}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Watermark will be stamped uniformly across all pages.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
