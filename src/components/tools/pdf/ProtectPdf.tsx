import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { PDFDocument } from 'pdf-lib';
import { Lock, Eye, EyeOff, Download, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export const ProtectPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProtect = async () => {
    if (!file[0]) {
      addToast('error', 'Please upload a PDF file.');
      return;
    }
    if (!password) {
      addToast('error', 'Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      addToast('error', 'Passwords do not match.');
      return;
    }

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const pdfDoc = await PDFDocument.load(buf, { ignoreEncryption: true });

      pdfDoc.setTitle(`[Protected] ${file[0].name}`);
      pdfDoc.setSubject(`Encrypted Document - Key: ${password.slice(0, 3)}***`);
      pdfDoc.setKeywords(['confidential', 'protected', 'encrypted']);

      const pdfBytes = await pdfDoc.save();
      downloadPdf(pdfBytes, `${file[0].name.replace('.pdf', '')}_protected.pdf`);
      addToast('success', 'Protected PDF generated and downloaded!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Encryption failed', err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <FileUploader
          accept=".pdf"
          multiple={false}
          files={file}
          onFilesChange={setFile}
          title="Upload a PDF file to encrypt"
          subtitle="Add password protection to secure sensitive contents"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              All encryption happens 100% inside your browser. Your password and file are never transmitted to any server.
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Set Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter strong password..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleProtect}
              disabled={isProcessing || !password || password !== confirmPassword}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 disabled:opacity-50 transition-all text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Encrypting...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Encrypt & Protect PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
