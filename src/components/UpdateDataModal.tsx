import React, { useState } from 'react';
import { X, UploadCloud, Download, RefreshCw, CheckCircle2, AlertCircle, FileSpreadsheet, Database } from 'lucide-react';
import { useCelebrations } from '../context/CelebrationContext';

interface UpdateDataModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateDataModal: React.FC<UpdateDataModalProps> = ({ isOpen, onClose }) => {
  const { uploadExcelFile, downloadJsonBackup, resetToDefault, isCustomData, uploadedFilename, stats } = useCelebrations();
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      setErrorMsg('Please upload a valid Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const count = await uploadExcelFile(file);
      setSuccessMsg(`Successfully loaded ${count} celebrations from "${file.name}" into browser memory!`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to parse Excel file. Ensure columns Name, Month, Date, and Event exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
    >
      <div className="glass-panel max-w-lg w-full p-6 relative shadow-2xl border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 border border-purple-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-main">Upload Excel Sheet</h2>
              <p className="text-xs text-muted">Keep your sheet in memory across sessions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-main hover:bg-tertiary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current State Status Banner */}
        <div className="my-5 p-4 rounded-xl bg-tertiary/80 border border-border flex items-center justify-between gap-3 text-xs shadow-inner">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${uploadedFilename ? 'bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20' : 'bg-purple-400'}`} />
            <div>
              <span className="text-muted block text-[11px] uppercase tracking-wider font-semibold">Active Sheet in Memory:</span>
              <span className="font-extrabold text-main text-sm block mt-0.5">
                {uploadedFilename || 'Default Repository Sheet (BD&WA.xlsx)'}
              </span>
              <span className="text-[11px] text-muted">
                {stats?.total || 0} total celebrations loaded ({stats?.birthdays || 0} Birthdays, {stats?.anniversaries || 0} Anniversaries)
              </span>
            </div>
          </div>

          {uploadedFilename && (
            <button
              onClick={() => { resetToDefault(); setSuccessMsg('Cleared custom sheet from memory.'); }}
              className="px-2.5 py-1.5 rounded-lg bg-secondary border border-border text-pink-400 hover:text-pink-300 hover:border-pink-500/30 font-semibold text-[11px] transition-all flex-shrink-0"
              title="Clear custom memory copy and revert to repository dataset"
            >
              Clear Memory
            </button>
          )}
        </div>

        {/* Drag and Drop Zone */}
        <div className="mb-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-purple-500 bg-purple-500/10 scale-[1.01]'
                : 'border-border hover:border-purple-500/60 hover:bg-tertiary/60'
            }`}
            onClick={() => document.getElementById('excel-file-input')?.click()}
          >
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx, .xls, .csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-purple-500/15 text-purple-400 mx-auto flex items-center justify-center mb-3 shadow-md shadow-purple-500/10">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-main text-sm mb-1">
              Click or drag & drop another Excel file here
            </h3>
            <p className="text-xs text-muted max-w-xs mx-auto leading-relaxed">
              When you upload, this sheet stays safely in browser memory until you upload another Excel file or click Clear Memory.
            </p>
          </div>

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-purple-400 font-semibold animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Reading sheet across all 12 months...
            </div>
          )}

          {successMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-start gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Excel Sheet Active in Memory!</span>
                {successMsg}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Upload Error</span>
                {errorMsg}
              </div>
            </div>
          )}
        </div>

        {/* Optional Backup section */}
        <div className="p-3.5 rounded-xl bg-tertiary/50 border border-border/60 text-xs text-muted flex items-center justify-between">
          <div>
            <span className="font-bold text-main block">Need to commit this to GitHub?</span>
            <span>Download JSON backup to replace `src/data/celebrations.json`</span>
          </div>
          <button
            onClick={downloadJsonBackup}
            className="btn btn-secondary text-[11px] px-3 py-1.5 flex items-center gap-1.5 flex-shrink-0 hover:border-purple-500/40"
            title="Download celebrations.json"
          >
            <Download className="w-3.5 h-3.5 text-purple-400" /> Export JSON
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn btn-primary text-sm px-5">
            Done & View Celebrations
          </button>
        </div>

      </div>
    </div>
  );
};
