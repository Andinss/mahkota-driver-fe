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
} from "@/components/driver/register/documents-form";
import { ReviewStep } from "@/components/driver/register/review-step";
import { useSearchParams } from "next/navigation";

type Step = 1 | 2 | 3 | 4;

// MOCK DATA 
const mockDriverData: Record<string, any> = {
  "MD-0042": {
    personal: {
      firstName: "Marcus",
      lastName: "Wright",
      dateOfBirth: "1988-05-14",
      gender: "Male",
      employeeId: "MD-0042",
      citizenship: "Indonesian (WNI)",
      phoneNumber: "+62 812-3456-7890",
      email: "marcus.wright@email.com",
    },
    contact: {
      phoneNumber: "+62 812-3456-7890",
      email: "marcus.wright@email.com",
      emergencyContactName: "Jane Wright",
      emergencyContactRelationship: "Spouse",
      permanentAddress: "Jl. Merdeka No. 42, Jakarta Pusat",
      addressType: "contract",
    },
  },
  "MD-0015": {
    personal: {
      firstName: "Sarah",
      lastName: "Jenkins",
      dateOfBirth: "1990-03-22",
      gender: "Female",
      employeeId: "MD-0015",
      citizenship: "Indonesian (WNI)",
      phoneNumber: "+62 811-9876-5432",
      email: "sarah.jenkins@email.com",
    },
    contact: {
      phoneNumber: "+62 811-9876-5432",
      email: "sarah.jenkins@email.com",
      emergencyContactName: "Mike Jenkins",
      emergencyContactRelationship: "Brother",
      permanentAddress: "Jl. Sudirman No. 15, Jakarta Selatan",
      addressType: "property_parent",
    },
  },
};

export default function DriverRegisterPage() {
  const searchParams = useSearchParams();
  const driverIdParam = searchParams.get("id");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<{
    personal?: PersonalDetailsData;
    contact?: ContactInfoData;
    documents?: DocumentsData;
    photo?: string;
  }>({});

  useEffect(() => {
    if (driverIdParam && mockDriverData[driverIdParam]) {
      setMode("edit");
      setIsLoading(true);
      // Simulasi loading data
      const driver = mockDriverData[driverIdParam];
      setFormData({
        personal: driver.personal,
        contact: driver.contact,
      });
      setIsLoading(false);
    } else {
      setMode("add");
    }
  }, [driverIdParam]);

  if (isLoading) {
    return (
      <div className="p-7 flex justify-center items-center h-64">
        <div className="text-center">Loading driver data...</div>
      </div>
    );
  }

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
    console.log("Submitting driver registration:", formData);

    // proses submit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const action = mode === "edit" ? "updated" : "registered";
    const driverName = formData.personal 
      ? `${formData.personal.firstName} ${formData.personal.lastName}` 
      : "New Driver";
    
    window.location.href = `/dashboard/driver?success=${action}&driver=${encodeURIComponent(driverName)}`;
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", formData);
  };

  const handleCancel = () => {
    console.log("Cancel registration");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsForm
            onNext={handlePersonalNext}
            initialData={mode === "edit" ? formData.personal : undefined}
            // onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <ContactInfoForm
            onNext={handleContactNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            initialData={mode === "edit" ? formData.contact : undefined}
          />
        );
      case 3:
        return (
          <DocumentsForm
            onNext={handleDocumentsNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={{
              personal: formData.personal || ({} as PersonalDetailsData),
              contact: formData.contact || ({} as ContactInfoData),
              documents: formData.documents || ({} as DocumentsData),
              photo: formData.photo,
            }}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            mode={mode}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-7">
      <Stepper currentStep={currentStep} />
      {renderStep()}
    </div>
  );
}
