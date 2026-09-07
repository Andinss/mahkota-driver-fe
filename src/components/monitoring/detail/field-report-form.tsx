"use client";

import { useState, useRef, useEffect } from "react";
import { confirmToast, toastWarning, toastError } from "@/components/ui/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Radio } from "@/components/ui/radio";
import { Checkbox } from "@/components/ui/checkbox";

interface FieldReportFormProps {
  onSaveDraft: (data: any) => void;
  onSubmitReport: (data: any) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export const FieldReportForm = ({ onSaveDraft, onSubmitReport }: FieldReportFormProps) => {
  const [formData, setFormData] = useState({
    isDrivable: "no",
    odometer: "",
    damages: [] as string[],
    notes: ""
  });
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_PHOTOS = 3;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDamageToggle = (damage: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      damages: checked
        ? [...prev.damages, damage]
        : prev.damages.filter(d => d !== damage)
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentCount = uploadedImages.length;
    const remainingSlots = MAX_PHOTOS - currentCount;
    
    if (files.length > remainingSlots) {
      toastWarning(`Maximum ${MAX_PHOTOS} photos. You can upload ${remainingSlots} more photo(s).`);
      return;
    }

    const newImages: UploadedImage[] = [];
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!allowedTypes.includes(file.type)) {
        toastError(`File ${file.name} is not supported. Please use JPG, PNG, or GIF.`);
        continue;
      }
      
      if (file.size > maxSize) {
        toastError(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      
      const preview = URL.createObjectURL(file);
      newImages.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        file: file,
        preview: preview
      });
    }

    setUploadedImages(prev => [...prev, ...newImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDeleteImage = (id: string) => {
    setUploadedImages(prev => {
      const imageToDelete = prev.find(img => img.id === id);
      if (imageToDelete) {
        URL.revokeObjectURL(imageToDelete.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const handleReplaceImage = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;
      
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
      
      if (!allowedTypes.includes(file.type)) {
        toastError(`File ${file.name} is not supported. Please use JPG, PNG, or GIF.`);
        return;
      }
      
      if (file.size > maxSize) {
        toastError(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      const preview = URL.createObjectURL(file);
      setUploadedImages(prev => prev.map(img => 
        img.id === id ? { ...img, file: file, preview: preview } : img
      ));
      
      const oldImage = uploadedImages.find(img => img.id === id);
      if (oldImage) {
        URL.revokeObjectURL(oldImage.preview);
      }
    };
    input.click();
  };

  const handleAddMore = () => {
    if (uploadedImages.length >= MAX_PHOTOS) {
      toastWarning(`Maximum ${MAX_PHOTOS} photos. Cannot add more.`);
      return;
    }
    fileInputRef.current?.click();
  };

  const handleSubmitClick = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (uploadedImages.length === 0) {
      toastWarning("Please upload at least 1 photo as evidence.");
      return;
    }
    
    const confirmed = await confirmToast({
      title: "Submit Field Report",
      message: "Are you sure you want to submit this field report? This action cannot be undone.",
      confirmText: "Yes, Submit",
      cancelText: "Cancel",
      variant: "info",
    });

    if (!confirmed) return;

    const submitData = {
      ...formData,
      photos: uploadedImages.map(img => ({
        id: img.id,
        name: img.file.name,
        size: img.file.size,
        type: img.file.type,
        preview: img.preview
      }))
    };
    
    onSubmitReport(submitData);
  };

  const handleSaveDraft = () => {
    const draftData = {
      ...formData,
      photosCount: uploadedImages.length
    };
    onSaveDraft(draftData);
  };

  const damageOptions = ["Body Damage", "Engine Issue", "Flat Tire", "Interior"];

  if (!isMounted) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 flex flex-col flex-1">
        <div className="animate-pulse p-6">
          <div className="h-8 bg-slate-200 dark:bg-gray-700 rounded w-32 mb-4"></div>
          <div className="h-32 bg-slate-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-[#e7edf3] dark:border-gray-800 flex flex-col flex-1">
        <div className="p-6 border-b border-[#e7edf3] dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-primary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0d141b] dark:text-white text-lg">Field Report</h3>
              <p className="text-sm text-[#4c739a] dark:text-slate-400">Document the incident details</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitClick}>
          <div className="p-6 lg:p-8 flex flex-col gap-8">
            {/* Section 1: Quick Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-[#0d141b] dark:text-white">Is the vehicle drivable?</label>
                <div className="flex gap-4">
                  <Radio
                    name="drivable"
                    value="yes"
                    checked={formData.isDrivable === "yes"}
                    onChange={(e) => setFormData({...formData, isDrivable: e.target.value})}
                    label="Yes, safe to drive"
                  />
                  <Radio
                    name="drivable"
                    value="no"
                    checked={formData.isDrivable === "no"}
                    onChange={(e) => setFormData({...formData, isDrivable: e.target.value})}
                    label="No, requires tow"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#0d141b] dark:text-white">Current Odometer Reading</label>
                <Input
                  type="number"
                  value={formData.odometer}
                  onChange={(e) => setFormData({...formData, odometer: e.target.value})}
                  placeholder="e.g. 45250"
                />
              </div>
            </div>

            {/* Section 2: Damage Checklist */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-bold text-[#0d141b] dark:text-white">Condition Checklist</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {damageOptions.map((damage) => (
                  <div
                    key={damage}
                    className={`p-1 rounded-lg transition-colors
                      ${formData.damages.includes(damage) 
                        ? "bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800" 
                        : ""
                      }`}
                  >
                    <Checkbox
                      label={damage}
                      checked={formData.damages.includes(damage)}
                      onChange={(e) => handleDamageToggle(damage, e.target.checked)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Evidence Upload */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-[#0d141b] dark:text-white">Photo Evidence</label>
                <span className={`text-xs ${uploadedImages.length >= 1 ? 'text-green-500' : 'text-red-500'}`}>
                  {uploadedImages.length}/{MAX_PHOTOS} files {uploadedImages.length === 0 && "(required)"}
                </span>
              </div>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/jpeg,image/png,image/jpg,image/gif"
                multiple
                className="hidden"
                id="photo-upload"
              />
              
              {uploadedImages.length === 0 && (
                <label
                  htmlFor="photo-upload"
                  className="border-2 border-dashed border-red-300 dark:border-red-700 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-red-50/20 dark:bg-red-900/10 hover:bg-red-50/40 dark:hover:bg-red-900/20 transition-colors cursor-pointer group"
                >
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-2xl">cloud_upload</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-[#0d141b] dark:text-white">Click to upload or drag and drop</p>
                    <p className="text-xs text-red-500 font-medium">* Required: Minimum 1 photo</p>
                    <p className="text-xs text-[#4c739a] dark:text-slate-400 mt-1">Max {MAX_PHOTOS} photos • JPG, PNG, GIF (max. 5MB each)</p>
                  </div>
                </label>
              )}

              {uploadedImages.length > 0 && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative rounded-xl overflow-hidden border border-[#e7edf3] dark:border-gray-700 group">
                        <img 
                          src={image.preview} 
                          alt="Uploaded evidence" 
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleReplaceImage(image.id)}
                            icon="refresh"
                          >
                            Replace
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteImage(image.id)}
                            icon="delete"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {uploadedImages.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={handleAddMore}
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 dark:border-gray-700 bg-slate-50 dark:bg-gray-800/50 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors min-h-[160px]"
                      >
                        <div className="p-2 bg-white dark:bg-gray-900 rounded-full shadow-sm">
                          <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
                        </div>
                        <p className="text-sm font-medium text-[#0d141b] dark:text-white">Add More</p>
                        <p className="text-xs text-[#4c739a] dark:text-slate-400">{MAX_PHOTOS - uploadedImages.length} slot(s) left</p>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Section 4: Notes */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#0d141b] dark:text-white">Additional Notes</label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Describe the damage or retrieval situation details..."
                rows={4}
              />
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-900 p-6 border-t border-[#e7edf3] dark:border-gray-800 rounded-b-xl z-10 flex justify-between items-center">
            <span className="text-xs text-[#4c739a] dark:text-slate-400"></span>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon="send"
              >
                Submit Report
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};