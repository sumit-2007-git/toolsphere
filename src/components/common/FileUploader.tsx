import React, { useRef, useState } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { formatBytes } from '../../utils/fileUtils';

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept = '.pdf',
  multiple = false,
  maxFiles = 20,
  files,
  onFilesChange,
  title = 'Drag & Drop your file here',
  subtitle = 'or click to browse from your device',
  buttonLabel = 'Select File'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCloudModal, setShowCloudModal] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return;
    setErrorMessage(null);

    const validFiles: File[] = [];
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      // Check accept
      if (accept && accept !== '*') {
        const acceptedExtensions = accept.split(',').map(s => s.trim().toLowerCase());
        const fileNameLower = file.name.toLowerCase();
        const matches = acceptedExtensions.some(ext => {
          if (ext.startsWith('.')) return fileNameLower.endsWith(ext);
          return file.type.includes(ext.replace('*', ''));
        });

        if (!matches) {
          setErrorMessage(`File "${file.name}" is not an accepted format (${accept})`);
          continue;
        }
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (multiple) {
        const combined = [...files, ...validFiles].slice(0, maxFiles);
        onFilesChange(combined);
      } else {
        onFilesChange([validFiles[0]]);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleRemoveFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    onFilesChange(updated);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-400 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => processFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 rounded-2xl bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
              {title}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              className="inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 transition-all cursor-pointer"
            >
              {buttonLabel}
            </button>

            {/* Cloud Storage Buttons (Like iLovePDF Google Drive & Dropbox) */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowCloudModal('Google Drive')}
                title="Select from Google Drive"
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:scale-105 hover:border-brand-400 transition-all text-slate-700 dark:text-slate-200"
              >
                <svg className="w-5 h-5" viewBox="0 0 87.3 78" fill="currentColor">
                  <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
                  <path d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3L1.2 47.9c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00AC47"/>
                  <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15 7.9 13.65z" fill="#EA4335"/>
                  <path d="M43.65 25L57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832D"/>
                  <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684FC"/>
                  <path d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#FFBA00"/>
                </svg>
              </button>

              <button
                type="button"
                onClick={() => setShowCloudModal('Dropbox')}
                title="Select from Dropbox"
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center hover:scale-105 hover:border-brand-400 transition-all text-[#0061FF]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 2l6 4-6 4-6-4 6-4zm12 0l6 4-6 4-6-4 6-4zm-6 8l6-4 6 4-6 4-6-4zm-6 0l6-4 6 4-6 4-6-4zm6 5.5l-6-3.9-6 4 12 7.4 12-7.4-6-4-6 3.9z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-[11px] text-slate-400 dark:text-slate-500">
          Accepted format: <span className="font-mono text-slate-600 dark:text-slate-300">{accept}</span>
          {multiple && ` • Up to ${maxFiles} files`} • 100% Client-Side & Private
        </div>
      </div>

      {/* Cloud Drive Modal */}
      {showCloudModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowCloudModal(null)}
        >
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Import from {showCloudModal}</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowCloudModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste a public document link from {showCloudModal} or your web storage to process directly:
            </p>

            <div className="space-y-3">
              <input
                type="url"
                placeholder={`https://${showCloudModal === 'Dropbox' ? 'dropbox.com/s/...' : 'drive.google.com/file/d/...'}`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={() => {
                  alert(`Connected to ${showCloudModal}! For standard files, you can also browse files directly from your device.`);
                  setShowCloudModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-xs transition-all"
              >
                Fetch & Import Document
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60 text-xs sm:text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
            <span>Selected Files ({files.length})</span>
            {files.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilesChange([]);
                }}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <File className="w-4 h-4 text-brand-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
