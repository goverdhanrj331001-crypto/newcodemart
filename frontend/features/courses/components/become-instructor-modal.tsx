"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Award, BookOpen, Users, DollarSign } from "lucide-react";

interface BecomeInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomeInstructorModal: React.FC<BecomeInstructorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [courseTitle, setCourseTitle] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#1c1c1c] rounded-2xl shadow-2xl border border-[#333333] text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2e2e2e]">
          <div>
            <h2 className="text-lg font-bold text-white">
              Become a Pixer Instructor
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Share your skills with over 100,000+ developers worldwide
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262626] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              Application Received!
            </h3>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Thank you for applying to become an instructor. Our curriculum team will review your application within 48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Benefits Banner */}
            <div className="grid grid-cols-3 gap-2 bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/40 text-center">
              <div>
                <DollarSign className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[11px] font-bold text-emerald-300">
                  85% Revenue Share
                </span>
              </div>
              <div>
                <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[11px] font-bold text-emerald-300">
                  100k+ Students
                </span>
              </div>
              <div>
                <Award className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="block text-[11px] font-bold text-emerald-300">
                  Global Reach
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#383838] bg-[#242424] text-white focus:outline-emerald-500 placeholder:text-neutral-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-[#383838] bg-[#242424] text-white focus:outline-emerald-500 placeholder:text-neutral-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Primary Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#383838] bg-[#242424] text-white focus:outline-emerald-500"
              >
                <option>Web Development</option>
                <option>Mobile App</option>
                <option>UI/UX Design</option>
                <option>Backend & APIs</option>
                <option>Programming</option>
                <option>Data Science</option>
                <option>AI & Machine Learning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Proposed Course Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Full-Stack Next.js 15 with Tailwind Architecture"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#383838] bg-[#242424] text-white focus:outline-emerald-500 placeholder:text-neutral-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Instructor Experience & Bio
              </label>
              <textarea
                rows={3}
                placeholder="Share your teaching or development background, GitHub profile, or portfolio..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#383838] bg-[#242424] text-white focus:outline-emerald-500 placeholder:text-neutral-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
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
