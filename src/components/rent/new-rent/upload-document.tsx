"use client";
import { useState, useRef } from "react";

export interface DocumentsData {
  contractFile?: File | null;
}

interface DocumentsFormProps {
  onDataChange?: (data: { documents?: File[] }) => void;
}

export function DocumentsForm({ onDataChange }: DocumentsFormProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [contractFile, setContractFile] = useState<File | null>(null);
  const [contractPreview, setContractPreview] = useState<string>("");

  const handleContractUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContractFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setContractPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (onDataChange) {
        onDataChange({ documents: [file] });
      }
    }
  };

  const handleRemoveContract = () => {
    setContractFile(null);
    setContractPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onDataChange) {
      onDataChange({ documents: [] });
    }
  };

  const triggerContractUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <UploadDocument
      contractFile={contractFile}
      contractPreview={contractPreview}
      handleContractUpload={handleContractUpload}
      handleRemoveContract={handleRemoveContract}
      triggerContractUpload={triggerContractUpload}
      fileInputRef={fileInputRef}
    />
  );
}

interface UploadDocumentProps {
  contractFile?: File | null;
  contractPreview: string;
  handleContractUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveContract: () => void;
  triggerContractUpload: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadDocument = ({
  contractFile,
  contractPreview,
  handleContractUpload,
  handleRemoveContract,
  triggerContractUpload,
  fileInputRef,
}: UploadDocumentProps) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-500 text-xl">description</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Dokumen Kontrak
          </h3>
          <p className="text-xs text-slate-400">Upload dokumen kontrak sewa</p>
        </div>
      </div>

      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
        File Kontrak
      </label>

      {contractPreview ? (
        <div className="relative border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
          {contractFile?.type === "application/pdf" ? (
            <div className="w-full h-32 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
              <span className="material-symbols-outlined text-slate-400 text-3xl">picture_as_pdf</span>
            </div>
          ) : (
            <img
              src={contractPreview}
              alt="Contract preview"
              className="w-full h-32 object-contain rounded-lg"
            />
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-amber-500 text-lg">description</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
                {contractFile?.name}
              </p>
            </div>
            <button
              type="button"
              onClick={handleRemoveContract}
              className="shrink-0 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-amber-400 dark:hover:border-amber-500 transition-all bg-slate-50/50 dark:bg-slate-800/30 group cursor-pointer"
          onClick={triggerContractUpload}
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
          <input
            ref={fileInputRef}
            id="contractFileInput"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={handleContractUpload}
          />
        </div>
      )}
    </div>
  );
};

export default UploadDocument;
