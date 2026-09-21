import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, detectFileTypeFromBuffer, downloadBlob, formatBytes, FileTypeInfo } from '../../../utils/fileUtils';
import { FileSearch, CheckCircle2, AlertTriangle, Download, FileCode, Shield } from 'lucide-react';

export const FileExtensionChecker: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [typeInfo, setTypeInfo] = useState<FileTypeInfo | null>(null);

  const handleFileChange = async (files: File[]) => {
    setFile(files);
    if (files[0]) {
      try {
        const buf = await readFileAsArrayBuffer(files[0]);
        const detected = detectFileTypeFromBuffer(buf);
        setTypeInfo(detected);
      } catch (err: any) {
        console.error(err);
        setTypeInfo(null);
      }
    } else {
      setTypeInfo(null);
    }
  };

  const currentExt = file[0]?.name.split('.').pop()?.toLowerCase() || '';
  const isMatch = typeInfo ? currentExt === typeInfo.ext.toLowerCase() : false;

  const handleDownloadFixed = () => {
    if (!file[0] || !typeInfo) return;
    const base = file[0].name.substring(0, file[0].name.lastIndexOf('.')) || file[0].name;
    downloadBlob(file[0], `${base}.${typeInfo.ext}`);
    addToast('success', `Saved file with verified .${typeInfo.ext} extension!`);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept="*"
          multiple={false}
          files={file}
          onFilesChange={handleFileChange}
          title="Upload any file to inspect true type"
          subtitle="Reads internal binary magic bytes and file signatures"
          buttonLabel="Select Any File"
        />
      </div>

      {file[0] && typeInfo && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Status Verdict Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isMatch
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {isMatch ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {isMatch ? 'Extension Matches Authentic File Signature!' : 'Potential Extension Mismatch Detected'}
                </h4>
                <p className="text-xs opacity-90">
                  {isMatch
                    ? `The file's internal magic bytes confirm it is a genuine .${typeInfo.ext} document.`
                    : `The file has extension ".${currentExt}", but binary header matches ".${typeInfo.ext}".`}
                </p>
              </div>
            </div>

            {!isMatch && (
              <button
                type="button"
                onClick={handleDownloadFixed}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-all shrink-0"
              >
                Fix & Download
              </button>
            )}
          </div>

          {/* Inspection Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-xs font-bold text-slate-400">Claimed Filename</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate font-mono">
                {file[0].name}
              </p>
              <p className="text-xs text-slate-400">{formatBytes(file[0].size)}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
              <span className="text-xs font-bold text-slate-400">Authentic Detected Format</span>
              <p className="text-sm font-bold text-brand-600 dark:text-brand-400">
                {typeInfo.description} (.{typeInfo.ext})
              </p>
              <p className="text-xs text-slate-400 font-mono">{typeInfo.mime}</p>
            </div>
          </div>

          {/* Hex Header Analysis */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internal Magic Header Bytes (First 16 Bytes)
            </span>
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900 text-brand-400 font-mono text-xs overflow-x-auto">
              {typeInfo.hexHeader}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
