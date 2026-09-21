import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { formatBytes, downloadBlob } from '../../../utils/fileUtils';
import { FileImage, Download, Sliders, ArrowDownRight, CheckCircle2 } from 'lucide-react';

export const ImageCompressor: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(75);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (file[0]) {
      const url = URL.createObjectURL(file[0]);
      setOriginalPreview(url);
      compressImage(file[0], quality, maxWidth);
      return () => URL.revokeObjectURL(url);
    } else {
      setOriginalPreview(null);
      setCompressedPreview(null);
      setCompressedBlob(null);
    }
  }, [file]);

  const compressImage = (imgFile: File, q: number, maxW: number) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > maxW) {
          height = Math.round((height * maxW) / width);
          width = maxW;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = imgFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              setCompressedBlob(blob);
              setCompressedPreview(URL.createObjectURL(blob));
            }
            setIsProcessing(false);
          },
          mimeType,
          q / 100
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(imgFile);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file[0]) {
      compressImage(file[0], newQ, maxWidth);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file[0]) return;
    const ext = file[0].name.split('.').pop() || 'jpg';
    downloadBlob(compressedBlob, `${file[0].name.replace(`.${ext}`, '')}_compressed.${ext}`);
    addToast('success', 'Compressed image downloaded!');
  };

  const savingsPercent = file[0] && compressedBlob
    ? Math.max(0, Math.round((1 - compressedBlob.size / file[0].size) * 100))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          multiple={false}
          files={file}
          onFilesChange={setFile}
          title="Upload an image to compress"
          subtitle="Compress JPG, PNG, or WebP images client-side with instant preview"
          buttonLabel="Select Image"
        />
      </div>

      {file.length > 0 && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-brand-500" />
                <span>Compression Settings</span>
              </h3>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                Quality: {quality}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="95"
              value={quality}
              onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
              className="w-full accent-brand-600 cursor-pointer"
            />

            {/* Savings Banner */}
            {compressedBlob && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-semibold text-slate-900 dark:text-white">Savings: </span>
                    <span className="line-through text-slate-400 mr-1">{formatBytes(file[0].size)}</span>
                    <ArrowDownRight className="w-3.5 h-3.5 inline text-emerald-600" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 mx-1">
                      {formatBytes(compressedBlob.size)}
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-bold bg-emerald-200/60 dark:bg-emerald-800/60 text-emerald-800 dark:text-emerald-200">
                      -{savingsPercent}%
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/20 text-xs sm:text-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </button>
              </div>
            )}
          </div>

          {/* Side-by-side Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Original File</span>
                <span>{formatBytes(file[0].size)}</span>
              </div>
              <div className="aspect-video rounded-xl bg-slate-50 dark:bg-slate-850 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {originalPreview && (
                  <img src={originalPreview} alt="Original" className="w-full h-full object-contain" />
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <span>Optimized Preview</span>
                <span>{compressedBlob ? formatBytes(compressedBlob.size) : 'Processing...'}</span>
              </div>
              <div className="aspect-video rounded-xl bg-slate-50 dark:bg-slate-850 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                {compressedPreview && (
                  <img src={compressedPreview} alt="Compressed" className="w-full h-full object-contain" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
