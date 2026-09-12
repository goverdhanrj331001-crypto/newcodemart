"use client";

import React, { useState, useRef } from "react";
import { useAdmin } from "../context/admin-context";
import { Upload, CheckCircle2, Image as ImageIcon, X } from "lucide-react";
import { CategoryGroupType } from "@/features/categories/types/categories.types";

interface AdminAddCategoryViewProps {
  onSuccess?: () => void;
}

export const AdminAddCategoryView: React.FC<AdminAddCategoryViewProps> = ({
  onSuccess,
}) => {
  const { addCategory } = useAdmin();

  const [categoryName, setCategoryName] = useState("");
  const [groupType, setGroupType] = useState<CategoryGroupType>("tech");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setImageFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    addCategory({
      name: categoryName,
      slug,
      type: groupType,
      filterCategory: categoryName,
      monogram: categoryName.substring(0, 2).toUpperCase(),
      description: `${groupType === "tech" ? "By Tag" : "By Project Type"} category: ${categoryName}`,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess?.();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8 bg-[#f7f8fa] dark:bg-[#181818] min-h-full max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            Add New Category
          </h1>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
            Configure category structure for By Tag or By Project Type cataloging
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-md text-xs font-bold dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Category Created Successfully! Redirecting...
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-[#212121] p-6 md:p-8 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-6">
        {/* 1. IMAGE UPLOAD */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 dark:text-neutral-200 block">
            Category Image (Upload 1 Image)*
          </label>
          
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageFileChange}
            className="hidden"
            id="category-image-upload"
          />

          {!imageUrl ? (
            <label
              htmlFor="category-image-upload"
              className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl p-8 text-center hover:border-[#009f7f] transition-all cursor-pointer bg-gray-50/50 dark:bg-[#181818]/50 flex flex-col items-center justify-center space-y-3 group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-[#009f7f] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-700 dark:text-neutral-200">
                  <span className="text-[#009f7f]">Click to upload category image</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, WEBP or SVG (Max 2MB)</p>
              </div>
            </label>
          ) : (
            <div className="relative rounded-xl border border-gray-200 dark:border-neutral-700 p-4 bg-gray-50 dark:bg-[#181818] flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={imageUrl}
                  alt="Category Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-neutral-700"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">
                    {imageFileName || "Category Cover Image"}
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Image Selected
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="p-2 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                title="Remove image"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* 2. CATEGORY NAME (BELOW IMAGE) */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 dark:text-neutral-200 block">
            Category Name*
          </label>
          <input
            type="text"
            required
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="e.g. Next.js, React, Mobile Apps, or SaaS Dashboards"
            className="w-full h-11 px-4 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-sm text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f] transition-all"
          />
        </div>

        {/* 3. CATEGORY STRUCTURE TYPE SELECTION */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-800 dark:text-neutral-200 block">
            Category Type Structure*
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setGroupType("tech")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                groupType === "tech"
                  ? "border-[#009f7f] bg-emerald-50/50 dark:bg-emerald-950/20 text-[#009f7f]"
                  : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-gray-700 dark:text-neutral-300 hover:border-gray-300"
              }`}
            >
              <div>
                <span className="font-bold text-sm block">By Tag Product</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">Tech Stack, Frameworks & Languages</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                groupType === "tech" ? "border-[#009f7f] bg-[#009f7f]" : "border-gray-300"
              }`}>
                {groupType === "tech" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setGroupType("project_type")}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                groupType === "project_type"
                  ? "border-[#009f7f] bg-emerald-50/50 dark:bg-emerald-950/20 text-[#009f7f]"
                  : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-gray-700 dark:text-neutral-300 hover:border-gray-300"
              }`}
            >
              <div>
                <span className="font-bold text-sm block">By Project Type</span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">E-Commerce, Dashboards, Mobile, etc.</span>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                groupType === "project_type" ? "border-[#009f7f] bg-[#009f7f]" : "border-gray-300"
              }`}>
                {groupType === "project_type" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
        <button
          type="submit"
          className="h-11 px-8 rounded-lg bg-[#009f7f] hover:bg-[#018066] text-white text-sm font-bold transition-all shadow-xs cursor-pointer"
        >
          Save Category
        </button>
      </div>
    </form>
  );
};

