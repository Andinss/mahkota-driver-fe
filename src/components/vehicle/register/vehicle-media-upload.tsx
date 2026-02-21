"use client";

import { useState, useRef, useEffect } from "react";

interface VehicleMediaUploadProps {
  onImageSelect?: (file: File | null) => void;
  initialImageUrl?: string;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export function VehicleMediaUpload({
  onImageSelect,
  initialImageUrl,
  acceptedFormats = ["JPG", "PNG"],
  maxSizeMB = 5,
}: VehicleMediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialImageUrl) {
      setSelectedImage(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file)) {
      processFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      processFile(file);
    }
  };

  const isValidFile = (file: File) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      alert(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }
    return true;
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    onImageSelect?.(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
    onImageSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <h3 className="text-[#111418] dark:text-white text-lg font-bold mb-4">
        Vehicle Media
      </h3>
      <div
        className={`relative group ${isDragging ? "border-primary" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-6 py-16 hover:border-primary transition-colors cursor-pointer ${
            selectedImage ? "py-8" : ""
          }`}
          onClick={handleClick}
        >
          {selectedImage ? (
            <div className="w-full">
              <img
                src={selectedImage}
                alt="Vehicle preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-[#f0f2f4] dark:bg-[#2a3845] text-[#111418] dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3a4855] transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-primary text-3xl">
                  add_a_photo
                </span>
              </div>
              <div className="text-center">
                <p className="text-[#111418] dark:text-white font-bold">
                  Upload Vehicle Photo
                </p>
                <p className="text-[#617589] text-sm mt-1">
                  Click to browse or drag & drop
                </p>
              </div>
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-[#f0f2f4] dark:bg-[#2a3845] text-[#111418] dark:text-white rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-[#3a4845] transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Select File
              </button>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          accept={acceptedFormats.map((f) => `image/${f.toLowerCase()}`).join(",")}
          className="hidden"
          type="file"
          onChange={handleFileSelect}
        />
      </div>
      <p className="text-xs text-[#617589] dark:text-slate-400 mt-3 italic text-center">
        Accepted formats: {acceptedFormats.join(", ")}. Max size {maxSizeMB}MB.
      </p>
    </div>
  );
}
