"use client";

import { Input } from "../ui/input";
import { Select } from "../ui/select";

const SecurityCard = () => {
  return (
    <div>
      <section
        className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 p-6 shadow-sm"
        id="security"
      >
        <div className="flex items-center gap-3 mb-6">
          <span
            className="material-symbols-outlined text-blue-600"
            data-icon="verified_user"
          >
            verified_user
          </span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            System Security
          </h3>
        </div>
        <div className="space-y-5">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Autentikasi dua faktor (MFA) diatur per akun pada panel{" "}
              <span className="font-bold">Autentikasi Dua Faktor (MFA)</span> di
              halaman ini.
            </p>
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
