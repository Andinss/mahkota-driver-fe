"use client";

import { useState, useEffect } from "react";
import { Stepper } from "@/components/driver/register/stepper";
import {
  PersonalDetailsForm,
  PersonalDetailsData,
} from "@/components/driver/register/personal-details-form";
import {
  ContactInfoForm,
  ContactInfoData,
} from "@/components/driver/register/contact-info-form";
import {
  DocumentsForm,
  DocumentsData,
  DocumentsUrlData,
} from "@/components/driver/register/documents-form";
import { ReviewStep } from "@/components/driver/register/review-step";
import { useSearchParams, useRouter } from "next/navigation";
import { driverApi } from "@/lib/api/driver";
import { supervisorApi } from "@/lib/api/supervisor";
import { useAuth } from "@/lib/auth-context";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { HttpClientError } from "@/lib/api-http";
import { renameFile } from "@/lib/utils/file";
import { toastError } from "@/components/ui/toast-provider";
type Step = 1 | 2 | 3 | 4;

export default function DriverRegisterPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const driverIdParam = searchParams.get("id");
  const [mode, setMode] = useState<"add" | "edit">("add");

  const isSupervisor = user?.role?.code === "SUPERVISOR";

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<{
    personal?: PersonalDetailsData;
    contact?: ContactInfoData;
    documents?: DocumentsData;
    documentsUrl?: DocumentsUrlData;
    photo?: string;
  }>({});

  useEffect(() => {
    if (driverIdParam) {
      setMode("edit");
      const fetchDriver = isSupervisor
        ? supervisorApi.getById(driverIdParam)
        : driverApi.getById(driverIdParam);

      fetchDriver.then((res: any) => {
        const driver = (res as any)?.data ?? res;
        if (driver?.employee_id) {
          const imageBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");
          const buildUrl = (path: string) => path ? (path.startsWith("http") ? path : `${imageBase}/${path.replace(/^\//, "")}`) : "";
          const photo = driver.profile_photo || "";
          setFormData({
            personal: {
              firstName: driver.first_name || "",
              lastName: driver.last_name || "",
              dateOfBirth: driver.date_of_birth || "",
              gender: driver.gender || "",
              employeeId: driver.employee_id || "",
              citizenship: driver.citizenship || "Indonesian (WNI)",
              phoneNumber: driver.phone || "",
              email: driver.email || "",
            },
            contact: {
              emergencyContactName: driver.emergency_contact || "",
              emergencyContactRelationship: driver.emergency_email || "",
              addressType: driver.house_type || "",
              readySignContract: driver.ready_sign_contract != null ? String(driver.ready_sign_contract) : "",
              willingToBeSurveyed: driver.willing_to_be_survey != null ? String(driver.willing_to_be_survey) : "",
              province: driver.province || "",
              province_name: driver.province_name || "",
              city: driver.city || "",
              city_name: driver.city_name || "",
              district: driver.district || "",
              district_name: driver.district_name || "",
              subdistrict: driver.subdistrict || "",
              subdistrict_name: driver.subdistrict_name || "",
              fullAddress: driver.full_address || driver.permanent_address || "",
            },
            photo: buildUrl(photo),
            documentsUrl: {
              sim: buildUrl(driver.sim_card || ""),
              ktp: buildUrl(driver.national_id_card || ""),
              npwp: buildUrl(driver.npwp_photo || ""),
              house: buildUrl(driver.garage_photo || ""),
            },
          });
        } else {
          toastError("Driver data not found.");
        }
      }).catch((err: any) => {
        const msg = err instanceof HttpClientError ? err.message : "Failed to load driver data.";
        toastError(msg);
      });
    } else {
      setMode("add");
    }
  }, [driverIdParam, isSupervisor]);

  const handlePersonalNext = (data: PersonalDetailsData) => {
    setFormData({ ...formData, personal: data });
    setCurrentStep(2);
  };

  const handleContactNext = (data: ContactInfoData) => {
    setFormData({ ...formData, contact: data });
    setCurrentStep(3);
  };

  const handleDocumentsNext = (data: DocumentsData) => {
    setFormData({ ...formData, documents: data });
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    const personal = formData.personal!;
    const contact = formData.contact!;
    const docs = formData.documents;

    const fd = new FormData();

    fd.append("first_name", personal.firstName);
    fd.append("last_name", personal.lastName);
    fd.append("date_of_birth", personal.dateOfBirth);
    fd.append("gender", personal.gender);
    fd.append("employee_id", personal.employeeId);
    fd.append("phone", personal.phoneNumber);
    fd.append("email", personal.email);
    fd.append("emergency_contact", contact.emergencyContactName);
    fd.append("emergency_email", contact.emergencyContactRelationship);
    fd.append("house_type", contact.addressType);
    fd.append("ready_sign_contract", contact.readySignContract);
    fd.append("willing_to_be_survey", contact.willingToBeSurveyed);
    fd.append("citizenship", personal.citizenship || "Indonesian (WNI)");
    fd.append("province", contact.province || "");
    fd.append("province_name", contact.province_name || "");
    fd.append("city", contact.city || "");
    fd.append("city_name", contact.city_name || "");
    fd.append("district", contact.district || "");
    fd.append("district_name", contact.district_name || "");
    fd.append("subdistrict", contact.subdistrict || "");
    fd.append("subdistrict_name", contact.subdistrict_name || "");
    fd.append("permanent_address", contact.fullAddress || "");

    const namePrefix = `${personal.firstName}_${personal.lastName}`.toLowerCase().replace(/\s+/g, "_");

    if (docs?.ktpFront) fd.append("images", renameFile(docs.ktpFront, `${namePrefix}_ktp`));
    if (docs?.simFront) fd.append("images", renameFile(docs.simFront, `${namePrefix}_sim`));
    if (docs?.npwpFront) fd.append("images", renameFile(docs.npwpFront, `${namePrefix}_npwp`));
    if (docs?.houseGaragePhoto) fd.append("images", renameFile(docs.houseGaragePhoto, `${namePrefix}_rumah`));
    if (personal.profilePhoto) fd.append("images", renameFile(personal.profilePhoto, `${namePrefix}_profil`));

    try {
      if (mode === "edit" && driverIdParam) {
        if (isSupervisor) {
          await supervisorApi.update(driverIdParam, fd);
        } else {
          await driverApi.update(driverIdParam, fd);
        }
      } else {
        if (isSupervisor) {
          await supervisorApi.create(fd);
        } else {
          await driverApi.create(fd);
        }
      }

      const driverName = `${personal.firstName} ${personal.lastName}`;
      const successType = mode === "edit" ? "updated" : "registered";
      router.push(`/dashboard/drivers?success=${successType}&driver=${encodeURIComponent(driverName)}`);
    } catch (error: any) {
      toastError(error?.message || `Failed to ${mode === "edit" ? "update" : "create"} driver. Please try again.`);
    }
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
  };

  const handleCancel = () => {
    router.push("/dashboard/drivers");
  };

  const handleEditSection = (section: "personal" | "emergency" | "address" | "survey" | "documents") => {
    switch (section) {
      case "personal":
        setCurrentStep(1);
        break;
      case "emergency":
      case "address":
      case "survey":
        setCurrentStep(2);
        break;
      case "documents":
        setCurrentStep(3);
        break;
    }
  };

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    1: { title: "Informasi Personal", subtitle: "Lengkapi data diri driver yang akan didaftarkan" },
    2: { title: "Informasi Kontak", subtitle: "Masukkan data kontak dan alamat driver" },
    3: { title: "Upload Dokumen", subtitle: "Unggah dokumen penting driver (SIM, KTP, NPWP)" },
    4: { title: "Review & Konfirmasi", subtitle: "Periksa kembali semua data sebelum disimpan" },
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsForm
            onNext={handlePersonalNext}
            initialData={formData.personal}
            initialProfilePhotoUrl={formData.photo}
            mode={mode}
          />
        );
      case 2:
        return (
          <ContactInfoForm
            onNext={handleContactNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            initialData={formData.contact}
          />
        );
      case 3:
        return (
          <DocumentsForm
            onNext={handleDocumentsNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            initialData={formData.documents}
            initialUrlData={formData.documentsUrl}
          />
        );
      case 4:
        return (
            <ReviewStep
            data={{
              personal: formData.personal || ({} as PersonalDetailsData),
              contact: {
                ...(formData.contact || ({} as ContactInfoData)),
                email: formData.personal?.email || "",
                phoneNumber: formData.personal?.phoneNumber || "",
              },
              documents: formData.documents || ({} as DocumentsData),
              documentsUrl: formData.documentsUrl,
              photo: formData.photo,
            }}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            onEditSection={handleEditSection}
            mode={mode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PermissionGuard permission="driver.create">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={currentStep > 1 ? handleBack : handleCancel}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "add" ? "Tambah Driver Baru" : "Edit Driver"}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {mode === "add"
                  ? "Lengkapi form di bawah untuk mendaftarkan driver baru"
                  : "Perbarui informasi data driver"}
              </p>
            </div>
          </div>
        </div>

        {/* Stepper */}
        <Stepper currentStep={currentStep} />

        {/* Form Sections */}
        <div className="space-y-6">
          {renderStep()}
        </div>
      </div>
    </div>
    </PermissionGuard>
  );
}
