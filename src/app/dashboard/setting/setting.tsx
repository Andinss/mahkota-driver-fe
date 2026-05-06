"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import CardBrandUpload from "@/components/settings/card-brand";
import GeneralParamaters from "@/components/settings/general-parameters";
import SecurityCard from "@/components/settings/system-security";
import { PageHeader } from "@/components/page-header";

const SettingPage = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [autoUpdated, setAutoUpdated] = useState(false);
  return (
    <div className="m-8">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title="Setting Overview"
          description="Monitor active rentals, handle pending and late payments, and review daily completed transactions."
          buttonText="Save Changes"
          buttonHref="/save"
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-5">
          <div className="lg:col-span-7 space-y-8">
            <CardBrandUpload />
            <GeneralParamaters />
          </div>

          <div className="lg:col-span-5 space-y-8">
            <SecurityCard />
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingPage;
