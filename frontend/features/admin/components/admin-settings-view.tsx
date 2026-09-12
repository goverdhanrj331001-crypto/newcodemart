"use client";

import React, { useState } from "react";
import { useAdmin } from "../context/admin-context";
import { CheckCircle2, Save, Globe, Shield, CreditCard } from "lucide-react";

export const AdminSettingsView: React.FC = () => {
  const { settings, updateSettings } = useAdmin();

  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [siteDescription, setSiteDescription] = useState(settings.siteDescription);
  const [supportEmail, setSupportEmail] = useState(settings.supportEmail);
  const [contactNumber, setContactNumber] = useState(settings.contactNumber);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [enableVendorRegistration, setEnableVendorRegistration] = useState(settings.enableVendorRegistration);
  const [popupBannerEnabled, setPopupBannerEnabled] = useState(settings.popupBannerEnabled);

  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      siteTitle,
      siteDescription,
      supportEmail,
      contactNumber,
      currencySymbol,
      enableVendorRegistration,
      popupBannerEnabled,
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
          Admin Platform Settings
        </h1>

        {isSaved && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-md text-xs font-bold dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Settings Updated!
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#009f7f]" />
            General Information
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Update site title, branding, contact email and storefront details
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Site Title Tagline
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Site Description
            </label>
            <input
              type="text"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Support Email
            </label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* Payment & Currency */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-[#009f7f]" />
            Payment & Currency
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Configure currency symbol and contact parameters
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Currency Symbol
            </label>
            <select
              value={currencySymbol}
              onChange={(e) => setCurrencySymbol(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            >
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="₹">₹ (INR)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Contact Phone Number
            </label>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-neutral-800">
        <button
          type="submit"
          className="flex items-center gap-2 h-10 px-6 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </form>
  );
};
