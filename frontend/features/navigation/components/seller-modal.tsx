"use client";

import React, { useState } from "react";

interface SellerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SellerModal: React.FC<SellerModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      id="seller-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="seller-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative bg-neutral-800 border border-zinc-700 rounded-xl max-w-lg w-full p-6 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold">
              ★
            </span>
            <h3 className="text-xl font-bold text-white">Become a Pixer Creator</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 text-xl">
              ✓
            </div>
            <h4 className="text-white text-base font-semibold mb-1">
              Application Submitted!
            </h4>
            <p className="text-zinc-400 text-xs mb-6">
              Our reviewer team will inspect your portfolio and get back to your registered email address within 24 hours.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-5 py-2.5 rounded transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <p className="text-zinc-300 text-xs leading-relaxed">
              Sell your digital assets, WordPress themes, Laravel scripts, React components, or 3D art on Pixer and keep up to 85% revenue split.
            </p>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Studio / Creator Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Acme Studio"
                className="w-full bg-neutral-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Portfolio or GitHub URL
              </label>
              <input
                required
                type="url"
                placeholder="https://dribbble.com/yourhandle"
                className="w-full bg-neutral-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Primary Asset Category
              </label>
              <select className="w-full bg-neutral-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                <option>WordPress Themes & Plugins</option>
                <option>React & Next.js Templates</option>
                <option>PHP & Laravel Scripts</option>
                <option>UI Kits & Mobile Wireframes</option>
                <option>3D Assets & Illustrations</option>
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs px-5 py-2.5 rounded transition-colors shadow-md"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
