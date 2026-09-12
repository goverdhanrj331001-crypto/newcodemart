"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export const ContactView: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    }, 800);
  };

  return (
    <div
      id="contact-page-root"
      className="w-full bg-gray-50 dark:bg-[#181818] min-h-[calc(100vh-70px)] text-gray-900 dark:text-white flex flex-col justify-between px-4 sm:px-6 lg:px-8 py-10 sm:py-14 transition-colors duration-200"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Centered Page Headings matching image */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Need help? Contact us
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-2">
            Looking for help? Drop your contact details here
          </p>
        </div>

        {/* Main Card Container */}
        <div
          id="contact-card-container"
          className="w-full bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#2d2d2d] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-sm dark:shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
            {/* Left Column: Contact Information */}
            <div className="md:col-span-5 flex flex-col justify-between h-full space-y-8">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h2>
                <p className="text-xs sm:text-[13px] text-gray-500 dark:text-neutral-400 leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>

                {/* 3 Contact items with circular green outline icons */}
                <div className="space-y-6 mt-8">
                  {/* Item 1: Office Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 text-[#009f7f] dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polygon
                          points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
                          fill="currentColor"
                          fillOpacity="0.25"
                        />
                        <line x1="12" y1="2" x2="12" y2="5" />
                        <line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="2" y1="12" x2="5" y2="12" />
                        <line x1="19" y1="12" x2="22" y2="12" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Office Location
                      </h4>
                      <p className="text-xs sm:text-[13px] text-gray-500 dark:text-neutral-400 mt-1">
                        NY State Thruway, New York, USA
                      </p>
                    </div>
                  </div>

                  {/* Item 2: Call us anytime */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 text-[#009f7f] dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                        <path d="M8.5 9.5a1.5 1.5 0 0 0 1.5 1.5c1 0 2-1 2-2a1.5 1.5 0 0 0-1.5-1.5" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Call us anytime
                      </h4>
                      <p className="text-xs sm:text-[13px] text-gray-500 dark:text-neutral-400 mt-1">
                        +129290122122
                      </p>
                    </div>
                  </div>

                  {/* Item 3: Visit Website */}
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full border border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/20 text-[#009f7f] dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="4" />
                        <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        Visit Website
                      </h4>
                      <p className="text-xs sm:text-[13px] text-gray-500 dark:text-neutral-400 mt-1">
                        <a
                          href="https://redq.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#009f7f] dark:hover:text-emerald-400 transition-colors"
                        >
                          https://redq.io
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Icons matching image */}
              <div className="flex items-center gap-4 pt-4 text-gray-400 dark:text-neutral-400">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="md:col-span-7">
              {isSubmitted && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-start gap-3 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 text-[#009f7f] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      Message Sent Successfully!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-200/90 mt-0.5">
                      Thank you for contacting us. We will get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1: Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs sm:text-[13px] text-gray-700 dark:text-neutral-300 mb-2 font-medium"
                    >
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#181818] text-gray-900 dark:text-white focus:outline-none focus:border-[#009f7f] dark:focus:border-emerald-500 transition-colors shadow-2xs"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs sm:text-[13px] text-gray-700 dark:text-neutral-300 mb-2 font-medium"
                    >
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#181818] text-gray-900 dark:text-white focus:outline-none focus:border-[#009f7f] dark:focus:border-emerald-500 transition-colors shadow-2xs"
                    />
                  </div>
                </div>

                {/* Row 2: Subject */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs sm:text-[13px] text-gray-700 dark:text-neutral-300 mb-2 font-medium"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#181818] text-gray-900 dark:text-white focus:outline-none focus:border-[#009f7f] dark:focus:border-emerald-500 transition-colors shadow-2xs"
                  />
                </div>

                {/* Row 3: Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs sm:text-[13px] text-gray-700 dark:text-neutral-300 mb-2 font-medium"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-md border border-gray-300 dark:border-[#333333] bg-white dark:bg-[#181818] text-gray-900 dark:text-white focus:outline-none focus:border-[#009f7f] dark:focus:border-emerald-500 transition-colors resize-y min-h-[140px] shadow-2xs"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    id="btn-contact-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#009f7f] hover:bg-[#008f72] active:bg-[#007f65] text-white font-medium text-xs sm:text-sm px-6 py-2.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isSubmitting ? "Sending..." : "Contact Us"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer matching image */}
      <footer className="w-full text-center py-8 text-gray-400 dark:text-neutral-500 text-xs mt-12">
        <p>©2026 Pixer. Copyright © REDQ. All rights reserved worldwide. REDQ</p>
      </footer>
    </div>
  );
};
