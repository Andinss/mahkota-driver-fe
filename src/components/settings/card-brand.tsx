"use client";

import { useState, useRef } from "react";
import { Input } from "../ui/input";

const PRESET_COLORS = [
  "#2563EB", "#7C3AED", "#DB2777", "#DC2626", "#EA580C",
  "#CA8A04", "#16A34A", "#0D9488", "#0284C7", "#4B5563",
];

const CardBrandUpload = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#2563EB");
  const [accentColor, setAccentColor] = useState("#4B5563");
  const [brandName, setBrandName] = useState("The apps");
  const [tagline, setTagline] = useState("The Logistics Authority");
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
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

  const ColorPicker = ({
    value,
    onChange,
    onClose,
  }: {
    value: string;
    onChange: (color: string) => void;
    onClose: () => void;
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-4 w-72">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Choose Color
        </h4>
        <div className="grid grid-cols-5 gap-2 mb-4">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                onChange(color);
                onClose();
              }}
              className="w-10 h-10 rounded-lg border-2 border-transparent hover:border-slate-300 transition-all"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-600 p-2 rounded-lg">
          <div
            className="w-8 h-8 rounded"
            style={{ backgroundColor: value }}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-sm bg-transparent border-none outline-none text-slate-900 dark:text-white"
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 cursor-pointer border-none"
          />
        </div>
        <button
          onClick={onClose}
          className="w-full mt-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {showPrimaryPicker && (
        <ColorPicker
          value={primaryColor}
          onChange={setPrimaryColor}
          onClose={() => setShowPrimaryPicker(false)}
        />
      )}
      {showAccentPicker && (
        <ColorPicker
          value={accentColor}
          onChange={setAccentColor}
          onClose={() => setShowAccentPicker(false)}
        />
      )}

      <section
        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm"
        id="branding"
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-blue-600"
            data-icon="palette"
          >
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
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">
                      edit
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 bg-gray-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-slate-600 flex flex-col items-center justify-center text-gray-400 group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-colors"
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    data-icon="upload_file"
                  >
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
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-700">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                PRIMARY COLOR
              </label>
              <button
                onClick={() => setShowPrimaryPicker(true)}
                className="w-full flex items-center gap-2 border border-gray-300 dark:border-slate-600 p-2 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: primaryColor }}
                />
                <span className="text-xs text-gray-700 dark:text-slate-200">
                  {primaryColor}
                </span>
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-slate-400 mb-2">
                ACCENT COLOR
              </label>
              <button
                onClick={() => setShowAccentPicker(true)}
                className="w-full flex items-center gap-2 border border-gray-300 dark:border-slate-600 p-2 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              >
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: accentColor }}
                />
                <span className="text-xs text-gray-700 dark:text-slate-200">
                  {accentColor}
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default CardBrandUpload;