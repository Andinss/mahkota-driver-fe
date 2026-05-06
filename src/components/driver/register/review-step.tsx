"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog"; // Import ConfirmDialog
import { PersonalDetailsData } from "./personal-details-form";
import { ContactInfoData } from "./contact-info-form";
import { DocumentsData } from "./documents-form";

export interface DriverReviewData {
  personal: PersonalDetailsData;
  contact: ContactInfoData;
  documents: DocumentsData;
  photo?: string;
}

interface ReviewStepProps {
  data: DriverReviewData;
  onBack: () => void;
  onSaveDraft?: () => void;
  onSubmit: () => void;
  mode?: "add" | "edit";
}

export function ReviewStep({
  data,
  onBack,
  onSaveDraft,
  onSubmit,
  mode = "add",
}: ReviewStepProps) {
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleConfirmSubmit = async () => {
    setIsConfirmDialogOpen(false);

    // simulasi loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const driverName = `${data.personal.firstName} ${data.personal.lastName}`;
    const action = mode === "edit" ? "updated" : "registered";

    window.location.href = `/dashboard/driver?success=${action}&driver=${encodeURIComponent(driverName)}`;
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8">
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl">
                  badge
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Step 4: Review
              </h2>
            </div>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-primary text-[10px] font-bold rounded-full border border-blue-100 dark:border-blue-800 uppercase tracking-widest">
              Draft Auto-saved
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Personal & Contact Info Section */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Personal &amp; Contact Info
                </h3>
                <button className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Edit
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="shrink-0">
                  {data.photo ? (
                    <img
                      alt="Driver Photo"
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-sm"
                      src={data.photo}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-300 text-4xl">
                        person
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12 flex-1">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Full Name</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.personal.firstName} {data.personal.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Employee ID</p>
                    <p className="font-semibold text-primary">
                      {data.personal.employeeId || "Auto-generated"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Email Address</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.contact.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Phone Number</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.contact.phoneNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Date of Birth</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.personal.dateOfBirth}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Gender</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.personal.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Citizenship</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.personal.citizenship}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Emergency Contact
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.contact.emergencyContactName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">
                      Emergency Relationship
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.contact.emergencyContactRelationship}
                    </p>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <p className="text-xs text-slate-400 mb-1">
                      Permanent Address
                    </p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.contact.permanentAddress}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Address Type</p>
                    <p className="font-semibold text-slate-800 dark:text-white">
                      {data.contact.addressType}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Documents Section */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Technical Documents
                </h3>
                <button className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline">
                  <span className="material-symbols-outlined text-sm">
                    edit
                  </span>{" "}
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">
                      description
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      Driver&apos;s License (SIM)
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {data.documents.simFront?.name || "Not uploaded"}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">
                      badge
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      National ID Card (KTP)
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {data.documents.ktpFront?.name || "Not uploaded"}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">
                      receipt_long
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">NPWP (Tax ID)</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {data.documents.npwpFront?.name || "Not uploaded"}
                    </p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                  <div className="w-16 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-2xl">
                      home
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">
                      House &amp; Garage Photo
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                      {data.documents.houseGaragePhoto?.name || "Not uploaded"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkbox Section */}
            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary dark:bg-slate-900 dark:border-slate-700"
                  type="checkbox"
                  required
                />
                <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  I hereby certify that the information provided above is true
                  and accurate to the best of my knowledge. I agree to Mahkota
                  Drive&apos;s{" "}
                  <a
                    className="text-primary font-semibold hover:underline"
                    href="#"
                  >
                    Terms of Service
                  </a>{" "}
                  and
                  <a
                    className="text-primary font-semibold hover:underline"
                    href="#"
                  >
                    Privacy Policy
                  </a>{" "}
                  regarding driver management and data processing.
                </span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <Button variant="ghost" onClick={onBack} icon="arrow_back">
              Back
            </Button>

            <div className="flex gap-4">
              <Button variant="ghost" onClick={onSaveDraft}>
                Save as Draft
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsConfirmDialogOpen(true)} // Buka dialog konfirmasi
                icon="how_to_reg"
                iconPosition="right"
              >
                Complete Registration
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirm Registration"
        message="Please review all information carefully. Are you sure all the data is correct? This action cannot be undone."
        confirmText="Yes, Complete Registration"
        cancelText="Review Again"
        variant="info"
      />
    </>
  );
}
