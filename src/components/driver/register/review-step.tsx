"use client";

import { Button } from "@/components/ui/button";
import { confirmToast } from "@/components/ui/toast-provider";
import { PersonalDetailsData } from "./personal-details-form";
import { ContactInfoData } from "./contact-info-form";
import { DocumentsData, DocumentsUrlData } from "./documents-form";

export interface DriverReviewData {
  personal: PersonalDetailsData;
  contact: ContactInfoData;
  documents: DocumentsData;
  documentsUrl?: DocumentsUrlData;
  photo?: string;
}

interface ReviewStepProps {
  data: DriverReviewData;
  onBack: () => void;
  onSaveDraft?: () => void;
  onSubmit: () => Promise<void>;
  onEditSection?: (section: "personal" | "emergency" | "address" | "survey" | "documents") => void;
  mode?: "add" | "edit";
}

const fileNameFromUrl = (url?: string) =>
  url ? url.split("/").pop() || "Uploaded" : "";

export function ReviewStep({
  data,
  onBack,
  onSaveDraft,
  onSubmit,
  onEditSection,
  mode = "add",
}: ReviewStepProps) {
  return (
    <>
      {/* Personal & Contact Info Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-500 text-xl">person</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Personal &amp; Contact Info</h3>
            <p className="text-xs text-slate-400">Ringkasan data diri dan kontak driver</p>
          </div>
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

          <div className="grid grid-cols-1 gap-8">
            {/* Personal & Contact Info Section */}
            <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Personal, Contact &amp; Address Details
                </h3>
                <button
                  type="button"
                  onClick={() => onEditSection?.("personal")}
                  className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-sm">edit</span> Edit
                </button>
              </div>

              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">account_circle</span>
                    Personal Information
                  </h4>
                  <div className="flex gap-6">
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
                        <p className="text-xs text-slate-400 mb-1">Phone Number</p>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {data.contact.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Email Address</p>
                        <p className="font-semibold text-slate-800 dark:text-white">
                          {data.contact.email}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0">
                      {data.photo ? (
                        <img
                          alt="Driver Photo"
                          className="w-24 h-24 rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                          src={data.photo}
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                          <span className="material-symbols-outlined text-slate-300 text-3xl">person</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">contact_emergency</span>
                    Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Emergency Contact</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.emergencyContactName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Emergency Relationship</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.emergencyContactRelationship}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                    Address Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">House Type</p>
                      <p className="font-semibold text-slate-800 dark:text-white capitalize">
                        {data.contact.addressType?.replace(/_/g, " ") || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Province</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.province_name || data.contact.province || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">City / Regency</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.city_name || data.contact.city || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">District</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.district_name || data.contact.district || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Subdistrict</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.subdistrict_name || data.contact.subdistrict || "-"}
                      </p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3">
                      <p className="text-xs text-slate-400 mb-1">Full Address</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.fullAddress || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Survey & Contract */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">fact_check</span>
                    Survey & Contract
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Willing To Be Surveyed</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.willingToBeSurveyed === "true" ? "Yes" : "No"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Ready To Sign Contract</p>
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {data.contact.readySignContract === "true" ? "Yes" : "No"}
                      </p>
                    </div>
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
                <button
                  type="button"
                  onClick={() => onEditSection?.("documents")}
                  className="text-primary text-xs font-semibold flex items-center gap-1 hover:underline"
                >
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
                      {data.documents.simFront?.name || fileNameFromUrl(data.documentsUrl?.sim) || "Not uploaded"}
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
                      {data.documents.ktpFront?.name || fileNameFromUrl(data.documentsUrl?.ktp) || "Not uploaded"}
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
                      {data.documents.npwpFront?.name || fileNameFromUrl(data.documentsUrl?.npwp) || "Not uploaded"}
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
                      {data.documents.houseGaragePhoto?.name || fileNameFromUrl(data.documentsUrl?.house) || "Not uploaded"}
                    </p>
                  </div>
                </div>
              </div>
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-500 text-xl">description</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base">Technical Documents</h3>
            <p className="text-xs text-slate-400">Dokumen yang telah diunggah</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-16 h-12 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 text-2xl">
                description
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400">
                Driver&apos;s License (SIM)
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {data.documents.simFront?.name || fileNameFromUrl(data.documentsUrl?.sim) || "Not uploaded"}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-16 h-12 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 text-2xl">
                badge
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400">
                National ID Card (KTP)
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {data.documents.ktpFront?.name || fileNameFromUrl(data.documentsUrl?.ktp) || "Not uploaded"}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-16 h-12 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 text-2xl">
                receipt_long
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400">NPWP (Tax ID)</p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {data.documents.npwpFront?.name || fileNameFromUrl(data.documentsUrl?.npwp) || "Not uploaded"}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className="w-16 h-12 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 dark:border-slate-700">
              <span className="material-symbols-outlined text-slate-400 text-2xl">
                home
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400">
                House &amp; Garage Photo
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">
                {data.documents.houseGaragePhoto?.name || fileNameFromUrl(data.documentsUrl?.house) || "Not uploaded"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkbox Section */}
      <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 p-4">
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
              {" "}Privacy Policy
            </a>{" "}
            regarding driver management and data processing.
          </span>
        </label>
      </div>

      {/* Footer Buttons */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
          >
            Back
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              const confirmed = await confirmToast({
                title: "Confirm Registration",
                message:
                  "Please review all information carefully. Are you sure all the data is correct? This action cannot be undone.",
                confirmText: "Yes, Complete Registration",
                cancelText: "Review Again",
                variant: "info",
              });
              if (confirmed) {
                await onSubmit();
              }
            }}
            icon="how_to_reg"
            iconPosition="right"
          >
            Complete Registration
          </Button>
        </div>
      </div>
    </>
  );
}