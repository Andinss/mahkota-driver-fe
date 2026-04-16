'use client';

import React, { useState } from 'react';

export default function AddNewUserPage() {
  const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    phone: '',
    role: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('User created successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Main Content - Full Width seperti contoh */}
      <main className="flex-1 min-w-0">
        <div className="p-8">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Add New User</h1>
            <p className="text-slate-500 mt-1">Create a new account for the Mahkota Drive ecosystem.</p>
          </header>

          {/* Form Card - Full Width */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
              {/* Form Left Side: Visual/Context */}
              <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-8 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 dark:shadow-none">
                    <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">User Onboarding</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Ensure the email address is correct as an invitation link will be sent automatically to the new user.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-medium text-slate-500">Secure access control</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-600 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-xs font-medium text-slate-500">Role-based permissions</span>
                  </div>
                </div>
              </div>

              {/* Form Right Side: Inputs */}
              <div className="md:col-span-8 p-8 md:p-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="fullname">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                        </div>
                        <input 
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" 
                          id="fullname" 
                          placeholder="John Doe" 
                          type="text"
                          value={formData.fullname}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="email">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-sm">mail</span>
                        </div>
                        <input 
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" 
                          id="email" 
                          placeholder="john@mahkota.com" 
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="phone">
                        Phone Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-sm">call</span>
                        </div>
                        <input 
                          className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm" 
                          id="phone" 
                          placeholder="+1 (555) 000-0000" 
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Assign Role */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="role">
                        Assign Role
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-sm">manage_accounts</span>
                        </div>
                        <select 
                          className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all text-sm" 
                          id="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a role</option>
                          <option value="administrator">Administrator</option>
                          <option value="fleet_manager">Fleet Manager</option>
                          <option value="staff">Staff</option>
                          <option value="driver">Driver</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-sm">expand_more</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Account Status Toggle */}
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Account Status</p>
                        <p className="text-xs text-slate-500">Enable immediate login access</p>
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
                      <span className="ml-3 text-sm font-medium text-slate-600 dark:text-slate-400">Active</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4">
                    <button 
                      className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors" 
                      type="button"
                      onClick={() => {
                        setFormData({ fullname: '', email: '', phone: '', role: '' });
                        setIsActive(true);
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2" 
                      type="submit"
                    >
                      <span>Create User</span>
                      <span className="material-symbols-outlined text-sm">send</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Help/Info Section - Full Width */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
              <span className="material-symbols-outlined text-blue-600">verified_user</span>
              <h4 className="text-sm font-bold">Permissions</h4>
              <p className="text-xs text-slate-500 leading-normal">System defaults for the selected role will be applied. You can customize them in 'Role Settings'.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
              <span className="material-symbols-outlined text-blue-600">lock_reset</span>
              <h4 className="text-sm font-bold">Initial Password</h4>
              <p className="text-xs text-slate-500 leading-normal">The user will be prompted to set a secure password upon their first login attempt via email.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col gap-3">
              <span className="material-symbols-outlined text-blue-600">monitoring</span>
              <h4 className="text-sm font-bold">Audit Tracking</h4>
              <p className="text-xs text-slate-500 leading-normal">This action will be logged in the system audit logs for security and compliance purposes.</p>
            </div>
          </div>

          {/* Global Footer */}
          <footer className="mt-8 text-center">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">© 2024 Mahkota Drive User Management System. All rights reserved.</p>
          </footer>
        </div>
      </main>
    </div>
  );
}