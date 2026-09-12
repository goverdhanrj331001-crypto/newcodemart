"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../context/admin-context";
import { Plus, Trash2, Upload, ImageIcon } from "lucide-react";

export const AdminBannersView: React.FC = () => {
  const { banners, addBanner, deleteBanner, toggleBannerStatus } = useAdmin();

  // Form state: ONLY Banner Name, Banner Type, and Image Upload per user request
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"explore_carousel" | "courses_top" | "popup_promo">("explore_carousel");
  const [imageUrl, setImageUrl] = useState("https://picsum.photos/seed/pixerbanner2/800/400");
  const [imageFileName, setImageFileName] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addBanner({
      title,
      type,
      imageUrl: imageUrl || "https://picsum.photos/seed/pixerbanner/800/400",
      subtitle: "",
      badgeText: "BANNER",
      targetUrl: "/explore",
    });

    setTitle("");
    setImageFileName("");
    setIsAdding(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
            Promotional Banners
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding((prev) => !prev)}
          className="flex items-center gap-2 h-10 px-4 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>{isAdding ? "Close Form" : "+ Add Banner"}</span>
        </button>
      </div>

      {/* Add Banner Form: ONLY Banner Name, Banner Type, and Image Upload */}
      {isAdding && (
        <form onSubmit={handleCreateBanner} className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-6 space-y-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-neutral-800 pb-2">
            Add New Banner
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Banner Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Banner Name*
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Summer Promo Sale Banner"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>

            {/* 2. Banner Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Banner Type*
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "explore_carousel" | "courses_top" | "popup_promo")}
                className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              >
                <option value="explore_carousel">Explore Carousel Banner</option>
                <option value="courses_top">Courses Top Banner</option>
                <option value="popup_promo">Promotional Pop-up Banner</option>
              </select>
            </div>
          </div>

          {/* 3. Image Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 block">
              Image Upload*
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileSelect}
              accept="image/*"
              className="hidden"
              id="banner-image-file-input"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <label
                htmlFor="banner-image-file-input"
                className="sm:col-span-2 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg p-6 text-center hover:border-[#009f7f] transition-colors cursor-pointer bg-gray-50/50 dark:bg-[#181818]/50 flex flex-col items-center justify-center space-y-1.5"
              >
                <Upload className="h-6 w-6 text-gray-400 dark:text-neutral-500" />
                <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium">
                  <span className="text-[#009f7f] font-bold">Click to upload banner image</span> or drag & drop
                </p>
                <span className="text-[10px] text-gray-400">PNG, JPG, WEBP (Recommended 1200x400)</span>
              </label>

              {imageUrl && (
                <div className="relative h-28 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-900 group">
                  <Image
                    src={imageUrl}
                    alt="Banner preview"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {imageFileName && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/70 p-1.5 text-[10px] text-white truncate text-center">
                      {imageFileName}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-neutral-800">
            <button
              type="submit"
              className="h-10 px-6 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold shadow-xs cursor-pointer transition-all"
            >
              Save Banner
            </button>
          </div>
        </form>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-gray-900">
              <Image
                src={b.imageUrl}
                alt={b.title}
                fill
                className="object-cover opacity-85"
                sizes="(max-width: 768px) 100vw, 50vw"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 flex flex-col justify-end text-white space-y-1">
                <span className="inline-block self-start px-2 py-0.5 rounded bg-[#009f7f] text-[10px] font-bold uppercase tracking-wider">
                  {b.type.replace("_", " ")}
                </span>
                <h3 className="text-base font-bold line-clamp-1">{b.title}</h3>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between border-t border-gray-100 dark:border-neutral-800 text-xs">
              <span className="font-semibold text-gray-500 dark:text-neutral-400 capitalize">
                Banner Name: {b.title}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleBannerStatus(b.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                    b.isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400"
                  }`}
                >
                  {b.isActive ? "Active" : "Inactive"}
                </button>

                <button
                  type="button"
                  onClick={() => deleteBanner(b.id)}
                  title="Delete Banner"
                  className="p-1.5 rounded hover:bg-rose-50 text-gray-400 hover:text-rose-600 dark:hover:bg-rose-950/40 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

