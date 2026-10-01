"use client";

import { useState } from "react";

import CardBrandUpload from "@/components/settings/card-brand";
// import GeneralParamaters from "@/components/settings/general-parameters";
import SecurityCard from "@/components/settings/system-security";
import { Button } from "@/components/ui/button";
import { confirmToast, toastSuccess } from "@/components/ui/toast-provider";
import { PermissionGuard } from "@/components/auth-guard-permission";
import { usePalette } from "@/lib/palette-context";

const SettingPage = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [autoUpdated, setAutoUpdated] = useState(false);
  const { commitPalette } = usePalette();

  return (
    <PermissionGuard permission="setting.read">
      <div className="m-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-5">
            <div className="lg:col-span-7 space-y-8">
              <CardBrandUpload />
              {/* <GeneralParamaters /> */}
            </div>

            <div className="lg:col-span-5 space-y-8">
              <SecurityCard />
            </div>
          </div>
          <div className="flex justify-start mt-6">
            <Button
              onClick={async () => {
                const confirmed = await confirmToast({
                  title: "Save Changes?",
                  message:
                    "Are you sure you want to save all your settings? This action will update the system configuration.",
                  confirmText: "Save",
                  cancelText: "Cancel",
                  variant: "info",
                });
                if (confirmed) {
                  commitPalette();
                  toastSuccess("Settings saved successfully.");
                }
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </PermissionGuard>
  );
};
export default SettingPage;