"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export interface UserFormData {
  fullname: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

interface AddUserFormProps {
  onNext?: (data: UserFormData) => void;
  onCancel?: () => void;
  onSaveDraft?: () => void;
}

export function AddUserForm({
  onNext,
  onCancel,
  onSaveDraft,
}: AddUserFormProps) {
  const [isActive, setIsActive] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: UserFormData = {
      fullname: formData.get("fullname") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      role: formData.get("role") as string,
      isActive: isActive,
    };
    
    onNext?.(data);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Left Side */}
        <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-8 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-none">
              <span
                className="material-symbols-outlined text-white text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                person_add
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              User Onboarding
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Ensure the email address is correct as an invitation link
              will be sent automatically to the new user.
            </p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-blue-600 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="text-xs font-medium text-slate-500">
                  Secure access control
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="material-symbols-outlined text-blue-600 text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span className="text-xs font-medium text-slate-500">
              Role-based permissions
              </span>
              </div>
          </div>
        </div>

              {/* Right Side - Form */}
              <div className="md:col-span-8 p-8 md:p-10">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="fullname"
                      name="fullname"
                      label="Full Name"
                      placeholder="Enter full name"
                      required
                    />

                    <Input
                      id="email"
                      name="email"
                      label="Email Address"
                      placeholder="Enter email address"
                      type="email"
                      required
                    />

                    <Input
                      id="phone"
                      name="phone"
                      label="Phone Number"
                      placeholder="Enter phone number"
                      type="tel"
                      required
                    />

                    <Select id="role" name="role" label="Assign Role" required>
                      <option value="">Select a role</option>
                      <option value="administrator">Administrator</option>
                      <option value="fleet_manager">Fleet Manager</option>
                      <option value="staff">Staff</option>
                      <option value="driver">Driver</option>
                    </Select>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800 my-6" />

                  {/* Account Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-blue-600 dark:text-blue-400"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          bolt
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Account Status
                        </p>
                        <p className="text-xs text-slate-500">
                          Enable immediate login access
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        checked={isActive}
                        className="sr-only peer"
                        type="checkbox"
                        onChange={(e) => setIsActive(e.target.checked)}
                      />
                      <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400">
                        Active
                      </span>
                    </label>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-6">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                    {onSaveDraft && (
                      <button
                        type="button"
                        className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors"
                        onClick={onSaveDraft}
                      >
                        Save Draft
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                    >
                      <span>Create User</span>
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
  );
}