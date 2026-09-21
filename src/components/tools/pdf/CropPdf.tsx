import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { FileUploader } from '../../common/FileUploader';
import { cropPdf } from '../../../utils/pdfUtils';
import { readFileAsArrayBuffer, downloadPdf } from '../../../utils/fileUtils';
import { Crop, Download, Loader2 } from 'lucide-react';

export const CropPdf: React.FC = () => {
  const { addToast } = useApp();
  const [file, setFile] = useState<File[]>([]);
  const [margin, setMargin] = useState<number>(25);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCrop = async () => {
    if (!file[0]) return;

    try {
      setIsProcessing(true);
      const buf = await readFileAsArrayBuffer(file[0]);
      const croppedBytes = await cropPdf(buf, margin);
      downloadPdf(croppedBytes, `${file[0].name.replace('.pdf', '')}_cropped.pdf`);
      addToast('success', 'PDF margins trimmed and downloaded!');
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Crop failed', err.message);
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
          title="Upload a PDF file to crop"
          subtitle="Trim margins and remove unwanted white borders"
          buttonLabel="Select PDF File"
        />
      </div>

      {file.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span>Trim Margin Size</span>
              <span>{margin} pt</span>
            </div>
            <input
              type="range"
              min="5"
              max="75"
              value={margin}
              onChange={(e) => setMargin(parseInt(e.target.value, 10))}
              className="w-full accent-brand-600 cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCrop}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-sm transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Trimming margins...</span>
                </>
              ) : (
                <>
                  <Crop className="w-4 h-4" />
                  <span>Crop Margins & Download</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
