"use client";

import { useState } from "react";
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

type Step = 1 | 2 | 3 | 4;

export default function DriverRegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<{
    personal?: PersonalDetailsData;
    contact?: ContactInfoData;
    documents?: DocumentsData;
    photo?: string;
  }>({});

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

  const handleSubmit = () => {
    console.log("Submitting driver registration:", formData);
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
            onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <ContactInfoForm
            onNext={handleContactNext}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
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
              personal: formData.personal || {} as PersonalDetailsData,
              contact: formData.contact || {} as ContactInfoData,
              documents: formData.documents || {} as DocumentsData,
              photo: formData.photo,
            }}
            onBack={handleBack}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
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
