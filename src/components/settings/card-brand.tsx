"use client";

import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { usePalette, type Palette } from "@/lib/palette-context";

const PALETTE_OPTIONS: {
  id: Palette;
  name: string;
  description: string;
  swatches: string[];
}[] = [
  {
    id: "blue",
    name: "Blue (Default)",
    description: "Palet warna biru yang sedang aktif saat ini.",
    swatches: ["#eff6ff", "#155dfc", "#1e3a8a"],
  },
  {
    id: "gold",
    name: "Gold (Logo)",
    description: "Palet warna emas, diambil dari logo perusahaan.",
    swatches: ["#fbf7ef", "#a9822e", "#52391b"],
  },
  {
    id: "noir",
    name: "Noir (Gold & Black)",
    description: "Kombinasi emas, hitam, dan putih untuk tampilan luxury.",
    swatches: ["#ffffff", "#d4af37", "#1c1c1f"],
  },
];

const CardBrandUpload = () => {
  const { pendingPalette, selectPalette } = usePalette();
  const [logo, setLogo] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("The apps");
  const [tagline, setTagline] = useState("The Logistics Authority");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <section
        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm"
        id="branding"
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="material-symbols-outlined text-primary" data-icon="palette">
            palette
          </span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Site Branding
          </h3>
        </div>
        <div className="space-y-6">
          <div className="flex items-start gap-6">
            <div className="relative group">
              {logo ? (
                <div className="relative">
                  <img
                    src={logo}
                    alt="Logo"
                    className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 object-contain"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center text-gray-400 group-hover:border-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-3xl" data-icon="upload_file">
                    upload_file
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">
                    Change Logo
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <Input
                  type="text"
                  className="w-full"
                  placeholder="The apps"
                  label="Brand Name"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="The Logistics Authority"
                  className="w-full"
                  label="Tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-3">
              COLOR PALETTE
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {PALETTE_OPTIONS.map((option) => {
                const isActive = pendingPalette === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => selectPalette(option.id)}
                    className={`relative text-left border-2 rounded-lg p-3 transition-all ${
                      isActive
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-gray-200 dark:border-slate-600 hover:border-primary/50"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-2 right-2 material-symbols-outlined text-primary text-lg">
                        check_circle
                      </span>
                    )}
                    <div className="flex gap-1 mb-2">
                      {option.swatches.map((color) => (
                        <div
                          key={color}
                          className="w-8 h-8 rounded-md border border-black/5"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {option.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CardBrandUpload;