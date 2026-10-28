"use client";

import { useRef, useState } from "react";

interface ChecklistFormProps {
  onDataChange: (data: { checklistPre?: File | null }) => void;
}

export function ChecklistForm({ onDataChange }: ChecklistFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      onDataChange({ checklistPre: selectedFile });
    } else {
      setFile(null);
      setPreview("");
      onDataChange({ checklistPre: null });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-500 text-xl">
            checklist
          </span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Checklist Kondisi Kendaraan
          </h3>
          <p className="text-xs text-slate-400">
            Upload checklist sebelum sewa (Pre-Rental)
          </p>
        </div>
      </div>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        File Checklist
      </label>

      {file ? (
        <div className="relative border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          {file.type === "application/pdf" ? (
            <div className="w-full h-32 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined text-slate-400 text-3xl">
                picture_as_pdf
              </span>
            </div>
          ) : (
            <img
              src={preview}
              alt="Checklist preview"
              className="w-full h-32 object-contain rounded-lg"
            />
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-amber-500 text-lg">
                checklist
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                {file.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={triggerUpload}
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-amber-400 dark:hover:border-amber-500 transition-all bg-slate-50/50 dark:bg-slate-800/30 group cursor-pointer min-h-[200px]"
        >
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20 transition-all">
            <span className="material-symbols-outlined text-slate-400 group-hover:text-amber-500 transition-colors text-2xl">
              cloud_upload
            </span>
          </div>
          <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
            Upload Dokumen
          </h3>
          <p className="text-xs text-slate-400 mt-1.5">
            Seret & lepas atau{" "}
            <span className="text-amber-500 font-medium">browse</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-3">
            JPG, PNG atau PDF. Maks 2MB.
          </p>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
