"use client";
import { useState, useRef } from "react";

export interface DocumentsData {
  contractFile?: File | null;
}

interface DocumentsFormProps {}

export function DocumentsForm({}: DocumentsFormProps) {
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
    }
  };

  const handleRemoveContract = () => {
    setContractFile(null);
    setContractPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerContractUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data: DocumentsData = {
      contractFile: contractFile,
    };
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
    <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
          4
        </span>
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
          Contract &amp; Documentation
        </h3>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
          Contract File
        </label>

        {contractPreview ? (
          <div className="border-2 border-solid border-primary bg-primary/5 rounded-2xl p-4 relative">
            {contractFile?.type === "application/pdf" ? (
              <div className="w-full h-40 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="text-slate-500">PDF Preview</span>
              </div>
            ) : (
              <img
                src={contractPreview}
                alt="Contract preview"
                className="w-full h-40 object-contain rounded-lg"
              />
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={handleRemoveContract}
                className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-lg"
              >
                Remove
              </button>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
              {contractFile?.name}
            </p>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-slate-50/50 dark:bg-slate-800/30 group cursor-pointer"
            onClick={triggerContractUpload}
          >
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-3xl">
                badge
              </span>
            </div>
            <h3 className="font-semibold text-sm text-slate-700 dark:text-slate-300">
              Upload Contract Document
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Drag &amp; drop or{" "}
              <span className="text-primary font-medium">browse</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-4 italic">
              JPG, PNG or PDF. Max size 2MB.
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
    </section>
  );
};

export default UploadDocument;
