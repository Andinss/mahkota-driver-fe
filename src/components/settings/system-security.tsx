"use client";
import { useState } from "react";

import { Input } from "../ui/input";
import { Select } from "../ui/select";

const SecurityCard = () => {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [autoUpdated, setAutoUpdated] = useState(false);
  return (
    <div>
      <section
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        id="security"
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-blue-600"
            data-icon="verified_user"
          >
            verified_user
          </span>
          <h3 className="text-lg font-semibold text-gray-900">
            System Security
          </h3>
        </div>
        <div className="space-y-5">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">
                Multi-Factor Authentication
              </p>
              <p className="text-xs text-gray-600">
                Enforce MFA for all admin accounts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="mfa-toggle"
                type="checkbox"
                checked={mfaEnabled}
                onChange={(e) => setMfaEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div>
            <Select
              id="password-complexity"
              name="password-complexity"
              label="Password Complexity"
            >
              <option>High (12+ chars, symbols, cases)</option>
              <option>Medium (8+ chars, numbers)</option>
              <option>Enterprise (SSO Only)</option>
            </Select>
          </div>
          <div>
            <Input
              type="number"
              placeholder="20"
              label="Session Time Out"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
export default SecurityCard;
