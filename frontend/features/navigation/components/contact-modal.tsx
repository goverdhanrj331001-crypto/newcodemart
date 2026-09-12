"use client";

import React, { useState } from "react";
import { X, Mail, Send, CheckCircle, Clock, MapPin } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      }, 2500);
    }, 800);
  };

  return (
    <div
      id="contact-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="contact-modal-card"
        className="bg-[#1c1c1c] border border-[#333333] w-full max-w-xl rounded-2xl p-5 sm:p-7 text-white shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2e2e2e]">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Help &amp; Inquiries
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">Contact Us</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#262626] hover:bg-[#333333] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
            <p className="text-neutral-400 text-sm mt-2 max-w-sm">
              Thank you for reaching out. Our support engineering team will review your inquiry and get back to you within 2-4 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto grow py-4 space-y-4 no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#242424] border border-[#333] focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#242424] border border-[#333] focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                placeholder="Product question, licensing, custom inquiry..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-[#242424] border border-[#333] focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your project or what you need assistance with..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#242424] border border-[#333] focus:border-emerald-500 rounded-lg px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="bg-[#242424] border border-[#333] rounded-xl p-3 flex items-center justify-between text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Typical response time: ~2 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <span className="text-neutral-300">support@pixer.redq.io</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
