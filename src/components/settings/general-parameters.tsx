"use client";
import { useState } from "react";

import { Checkbox } from "../ui/checkbox";
import { Select } from "../ui/select";

const GeneralParamaters = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [autoUpdated, setAutoUpdated] = useState(false);
  return (
    <div>
      <section
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        id="parameters"
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-blue-600"
            data-icon="tune"
          >
            tune
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            General Parameters
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Select
              id="site-language"
              name="site-language"
              label="Site Language"
            >
              <option>English (US)</option>
              <option>German (DE)</option>
              <option>Spanish (ES)</option>
              <option>French (FR)</option>
            </Select>
          </div>
          <div>
            <Select id="timezone" name="timezone" label="Timezone">
              <option>(UTC-05:00) Eastern Time</option>
              <option>(UTC+00:00) GMT</option>
              <option>(UTC+01:00) Central European</option>
            </Select>
          </div>
          <div className="md:col-span-2">
            <div className="flex items-center gap-4">
              <Select
                id="currency"
                name="currency"
                label="Currency"
                className="flex-1"
              >
                <option>USD - US Dollar ($)</option>
                <option>EUR - Euro (€)</option>
                <option>GBP - British Pound (£)</option>
              </Select>
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Checkbox
                  id="autoupdated"
                  name="autoupdated"
                  checked={autoUpdated}
                  onChange={(e) => setAutoUpdated(e.target.checked)}
                  label="Auto Updated"
                  className="mt-6 w-4 h-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default GeneralParamaters;
