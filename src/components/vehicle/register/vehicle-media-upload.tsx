"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toastError } from "@/components/ui/toast-provider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface UploadedImage {
  file: File;
  preview: string;
  id: string;
}

interface VehicleMediaUploadProps {
  onImagesSelect?: (files: File[]) => void;
  initialImageUrls?: string[];
  acceptedFormats?: string[];
  maxSizeMB?: number;
  minPhotos?: number;
}

export function VehicleMediaUpload({
  onImagesSelect,
  initialImageUrls,
  acceptedFormats = ["JPG", "PNG", "JPEG", "WEBP"],
  maxSizeMB = 5,
  minPhotos = 4,
}: VehicleMediaUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [mainIndex, setMainIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const onImagesSelectRef = useRef(onImagesSelect);
  const hasSetInitial = useRef(false);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const lightboxImgRef = useRef<HTMLImageElement>(null);

  // Keep ref in sync
  useEffect(() => {
    onImagesSelectRef.current = onImagesSelect;
  });

  // Set initial images only once (wait until initialImageUrls is resolved)
  useEffect(() => {
    if (hasSetInitial.current) return;
    if (initialImageUrls === undefined) return;
    hasSetInitial.current = true;

    if (initialImageUrls.length > 0) {
      const initialImages: UploadedImage[] = initialImageUrls.map(
        (url, idx) => ({
          file: new File([], `initial-${idx}`),
          preview: url,
          id: `initial-${idx}-${Date.now()}`,
        }),
      );
      setImages(initialImages);
    }
  }, [initialImageUrls]);

  // Notify parent when images change (but not on initial mount)
  useEffect(() => {
    if (!hasSetInitial.current) return;
    if (onImagesSelectRef.current) {
      onImagesSelectRef.current(
        images.map((img) => img.file).filter((f) => f.size > 0),
      );
    }
  }, [images]);

  const isValidFile = (file: File): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toastError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }
    const accepted = acceptedFormats.flatMap((f) => {
      const lower = f.toLowerCase();
      if (lower === "jpg" || lower === "jpeg") return ["jpg", "jpeg"];
      return [lower];
    });
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const mime = file.type.split("/")[1]?.toLowerCase() || "";
    if (!accepted.includes(ext) && !accepted.includes(mime)) {
      toastError(`Invalid file format. Accepted: ${acceptedFormats.join(", ")}`);
      return false;
    }
    return true;
  };

  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (isValidFile(file)) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: UploadedImage = {
            file,
            preview: reader.result as string,
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          };
          setImages((prev) => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent event from bubbling to parent
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  // Lightbox functions
  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setZoomLevel(1);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setZoomLevel(1);
  };

  const lightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === 0 ? images.length - 1 : (prev || 0) - 1,
    );
    setZoomLevel(1);
  };

  const lightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) =>
      prev === images.length - 1 ? 0 : (prev || 0) + 1,
    );
    setZoomLevel(1);
  };

  const zoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const zoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel((prev) => Math.max(prev - 0.5, 0.5));
  };

  const resetZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(1);
  };

  const remainingPhotos = minPhotos - images.length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-emerald-500 text-xl">photo_camera</span>
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            Foto Kendaraan
          </h3>
          <p className="text-xs text-slate-400">Upload foto kendaraan (min. 4 foto)</p>
        </div>
      </div>

      {images.length > 0 ? (
        <div className="space-y-4">
          {/* Main Swiper Slider */}
          <div className="relative rounded-xl overflow-hidden bg-[#f0f2f4] dark:bg-[#1a2632]">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              loop={images.length > 1}
              onSlideChange={(swiper) => setMainIndex(swiper.realIndex)}
              className="vehicle-photo-swiper"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={img.id}>
                  <div
                    className="relative aspect-video w-full cursor-pointer"
                    onClick={() => openLightbox(idx)}
                  >
                    <img
                      src={img.preview}
                      alt="Vehicle"
                      className="w-full h-full object-cover"
                    />
                    {/* Delete button overlay - FIXED: Now properly stops propagation */}
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, img.id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    {/* Photo counter */}
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-medium px-3 py-1 rounded-full">
                      {idx + 1} / {images.length}
                    </div>
                    {/* Main photo badge */}
                    {idx === 0 && (
                      <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                        MAIN PHOTO
                      </div>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors ${
                    idx === mainIndex
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300"
                  }`}
                  onClick={() => {
                    openLightbox(idx);
                    const swiperEl = document.querySelector(
                      ".vehicle-photo-swiper",
                    );
                    if (swiperEl && (swiperEl as any).swiper) {
                      (swiperEl as any).swiper.slideTo(idx);
                    }
                  }}
                >
                  <img
                    src={img.preview}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <div className="absolute inset-0 bg-primary/20 flex items-end justify-center">
                      <span className="text-[10px] text-white font-bold bg-primary/80 w-full text-center py-0.5">
                        MAIN
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {/* Add more photos button in thumbnail strip */}
              <div
                onClick={handleClickUpload}
                className="shrink-0 w-16 h-16 rounded-lg border-2 border-dashed border-[#dbe0e6] dark:border-[#4b5563] hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#f0f2f4] dark:bg-[#1a2632]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#617589]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Photo count info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#617589] dark:text-slate-400">
              {images.length} photo{images.length > 1 ? "s" : ""} uploaded
              {remainingPhotos > 0 && (
                <span className="text-amber-600 dark:text-amber-400 ml-1">
                  (add {remainingPhotos} more)
                </span>
              )}
              {remainingPhotos <= 0 && (
                <span className="text-green-600 dark:text-green-400 ml-1">
                  (minimum reached)
                </span>
              )}
            </p>
            <button
              type="button"
              onClick={handleClickUpload}
              className="text-sm text-primary font-semibold hover:underline"
            >
              + Add More
            </button>
          </div>
        </div>
      ) : (
        /* Empty state - initial upload */
        <div
          className={`relative group ${isDragging ? "border-primary bg-primary/5" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div
            className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#dbe0e6] dark:border-[#4b5563] bg-white dark:bg-[#1a2632] px-6 py-16 hover:border-primary transition-colors cursor-pointer"
            onClick={handleClickUpload}
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[#111418] dark:text-white font-bold text-lg">
                Upload Vehicle Photos
              </p>
              <p className="text-[#617589] text-sm mt-1">
                Click to browse or drag & drop
              </p>
              <p className="text-[#617589] text-sm mt-1">
                Minimum {minPhotos} photos required
              </p>
            </div>
            <button
              type="button"
              className="mt-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleClickUpload();
              }}
            >
              Select Photos
            </button>
          </div>
          <input
            ref={fileInputRef}
            accept={acceptedFormats
              .flatMap((f) => {
                const lower = f.toLowerCase();
                if (lower === "jpg" || lower === "jpeg")
                  return [".jpg", ".jpeg"];
                return [`.${lower}`];
              })
              .join(",")}
            className="hidden"
            type="file"
            multiple
            onChange={handleFileSelect}
          />
        </div>
      )}

      {/* Hidden input for adding more photos */}
      {images.length > 0 && (
        <input
          ref={fileInputRef}
          accept={acceptedFormats
            .flatMap((f) => {
              const lower = f.toLowerCase();
              if (lower === "jpg" || lower === "jpeg")
                return [".jpg", ".jpeg"];
              return [`.${lower}`];
            })
            .join(",")}
          className="hidden"
          type="file"
          multiple
          onChange={handleFileSelect}
        />
      )}

      <p className="text-xs text-[#617589] dark:text-slate-400 mt-3 italic text-center">
        Accepted formats: {acceptedFormats.join(", ")}. Max size {maxSizeMB}MB
        per file. Minimum {minPhotos} photos. Drag & drop supported.
      </p>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center cursor-zoom-out"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center z-20 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation - Previous */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={lightboxPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center z-20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Navigation - Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={lightboxNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center z-20 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 rounded-full px-4 py-2 z-20">
            <button
              type="button"
              onClick={zoomOut}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            </button>
            <span className="text-white text-sm font-medium min-w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="text-white text-xs hover:underline ml-2"
            >
              Reset
            </button>
          </div>

          {/* Main Image */}
          <div
            className="max-w-[90vw] max-h-[90vh] overflow-auto flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={lightboxImgRef}
              src={images[lightboxIndex].preview}
              alt={`Vehicle ${lightboxIndex + 1}`}
              className="object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            />
          </div>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm font-medium px-4 py-2 rounded-full z-20">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
