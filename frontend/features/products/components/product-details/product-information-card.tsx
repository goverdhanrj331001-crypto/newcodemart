"use client";

import React from "react";
import { ProductSpecification } from "../../types/product.types";
import {
  UpdateIcon,
  CalenderIcon,
  ResponsiveIcon,
  LabelIcon,
} from "./pixer-icons";

interface ProductInformationCardProps {
  specifications?: ProductSpecification;
  category: string;
  className?: string;
  onTagClick?: (tag: string) => void;
}

export const ProductInformationCard: React.FC<ProductInformationCardProps> = ({
  specifications,
  className = "",
  onTagClick,
}) => {
  const specs = specifications || {
    lastUpdate: "Aug 18, 2026",
    published: "Jan 27, 2026",
    layoutType: "Responsive",
    highResolution: true,
    compatibleBrowsers: ["Chrome", "Firefox", "Safari", "Edge"],
    filesIncluded: ["PHP Files", "HTML 5", "CSS Files", "JS Files", "Documentation"],
    tags: ["Dashboard", "E-commerce", "Landing Page", "Retail", "WooCommerce"],
  };

  return (
    <div
      id="product-information-card"
      className={`space-y-4 text-[13px] ${className}`}
    >
      {/* Last Update */}
      <div className="flex items-start text-gray-900 dark:text-white">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-gray-500 dark:text-[#a8a8a8]">
          <span className="w-8 flex-shrink-0 text-gray-400 dark:text-[#737373]">
            <UpdateIcon className="h-[18px] w-[18px]" />
          </span>
          Last Update:
        </strong>
        <span className="font-medium text-gray-900 dark:text-white">{specs.lastUpdate}</span>
      </div>

      {/* Published */}
      <div className="flex items-start text-gray-900 dark:text-white">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-gray-500 dark:text-[#a8a8a8]">
          <span className="w-8 flex-shrink-0 text-gray-400 dark:text-[#737373]">
            <CalenderIcon className="h-[18px] w-[18px]" />
          </span>
          Published:
        </strong>
        <span className="font-medium text-gray-900 dark:text-white">{specs.published}</span>
      </div>

      {/* Layout */}
      <div className="flex items-start text-gray-900 dark:text-white">
        <strong className="flex w-36 flex-shrink-0 items-center font-normal text-gray-500 dark:text-[#a8a8a8]">
          <span className="w-8 flex-shrink-0 text-gray-400 dark:text-[#737373]">
            <ResponsiveIcon className="h-[18px] w-[18px]" />
          </span>
          Layout:
        </strong>
        <span className="font-medium text-gray-900 dark:text-white">{specs.layoutType}</span>
      </div>

      {/* High Resolution */}
      {specs.highResolution && (
        <div className="flex items-start text-gray-900 dark:text-white">
          <strong className="flex w-36 flex-shrink-0 items-center font-normal text-gray-500 dark:text-[#a8a8a8]">
            <span className="w-8 flex-shrink-0 text-gray-400 dark:text-[#737373]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            High Resolution:
          </strong>
          <span className="font-medium text-gray-900 dark:text-white">Yes</span>
        </div>
      )}

      {/* Files Included */}
      {specs.filesIncluded && specs.filesIncluded.length > 0 && (
        <div className="flex items-start text-gray-900 dark:text-white">
          <strong className="flex w-36 flex-shrink-0 items-center font-normal text-gray-500 dark:text-[#a8a8a8]">
            <span className="w-8 flex-shrink-0 text-gray-400 dark:text-[#737373]">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </span>
            Files Included:
          </strong>
          <span className="font-medium text-gray-900 dark:text-white">{specs.filesIncluded.join(", ")}</span>
        </div>
      )}

      {/* Tags */}
      {specs.tags && specs.tags.length > 0 && (
        <div className="flex items-start text-gray-900 dark:text-white">
          <strong className="flex w-36 flex-shrink-0 items-center pt-0.5 font-normal text-gray-500 dark:text-[#a8a8a8]">
            <span className="w-8 flex-shrink-0 text-gray-400 dark:text-[#737373]">
              <LabelIcon className="h-5 w-5" />
            </span>
            Tags:
          </strong>
          <div className="flex flex-wrap gap-2">
            {specs.tags.map((tag, idx) => (
              <button
                key={`tag-${idx}`}
                type="button"
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-[#3e3e3e] bg-white dark:bg-transparent px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-[#a8a8a8] transition-all hover:bg-gray-100 dark:hover:bg-[#2e2e2e] hover:text-gray-900 dark:hover:text-white cursor-pointer shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

