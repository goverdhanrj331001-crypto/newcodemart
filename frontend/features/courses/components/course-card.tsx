"use client";

import React from "react";
import Image from "next/image";
import { Play, ShoppingCart } from "lucide-react";
import { CourseDetailItem } from "../data/courses.data";
import { getProductUrl } from "@/features/products/utils/product.utils";

interface CourseCardProps {
  course: CourseDetailItem;
  onPreview?: (course: CourseDetailItem) => void;
  onDetails?: (course: CourseDetailItem) => void;
  onAddToCart?: (course: CourseDetailItem) => void;
  onAuthorClick?: (authorName: string) => void;
  onWatchAd?: (course: CourseDetailItem) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onPreview,
  onDetails,
  onAddToCart,
  onAuthorClick,
  onWatchAd,
}) => {
  const courseUrl = getProductUrl(course.slug);
  const isFree = course.price?.toUpperCase() === "FREE" || Boolean(course.isFree);
  const displayPrice = isFree ? "$0.00" : course.price;

  return (
    <div
      id={`course-card-${course.id}`}
      title={course.title}
      className="group box-border min-h-[auto] min-w-[auto] transition-transform duration-200"
    >
      {/* Thumbnail with Hover Overlay - Clicking takes to details */}
      <div
        onClick={() => onDetails?.(course)}
        className="relative aspect-[3/2] box-border flex justify-center w-full overflow-hidden rounded-sm bg-zinc-800 cursor-pointer"
      >
        <Image
          alt={course.title}
          src={course.image}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Hover action overlay with ONLY Details */}
        <div className="absolute inset-0 items-center backdrop-blur-xs bg-black/60 box-border flex h-full justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full z-10 p-4">
          <div
            id={`course-details-btn-${course.id}`}
            className="text-white text-xs font-medium bg-transparent flex flex-col items-center leading-4 text-center p-0 cursor-pointer group/btn"
          >
            <div className="items-center backdrop-blur-sm bg-zinc-600/80 box-border flex h-11 justify-center w-11 mb-2 rounded-full transition-colors group-hover/btn:bg-[#009f7f] shadow-md">
              <img
                src="https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-18.svg"
                alt="Details"
                className="box-border h-4 w-4"
              />
            </div>
            <span>Details</span>
          </div>
        </div>
      </div>

      {/* Course metadata footer */}
      <div className="box-border flex flex-col pt-3">
        <h3
          title={course.title}
          className="text-gray-900 dark:text-white font-medium box-border min-h-[auto] min-w-[auto] text-ellipsis text-nowrap overflow-hidden text-sm"
        >
          <button
            type="button"
            onClick={() => onDetails?.(course)}
            className="box-border text-nowrap text-left hover:text-[#009f7f] dark:hover:text-emerald-400 transition-colors cursor-pointer block truncate w-full"
          >
            {course.title}
          </button>
        </h3>
      </div>

      {/* Action Buttons Row: Watch Ad & Buy Now matching screenshot */}
      <div className="flex items-center gap-2 mt-3 w-full">
        <button
          id={`course-btn-watch-ad-${course.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWatchAd?.(course);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md bg-white dark:bg-[#242424] hover:bg-gray-100 dark:hover:bg-[#2d2d2d] active:bg-gray-200 dark:active:bg-[#1f1f1f] border border-gray-200 dark:border-[#383838] text-gray-800 dark:text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
        >
          <Play className="w-3.5 h-3.5 fill-current text-gray-800 dark:text-white shrink-0" />
          <span className="truncate">Watch Ad ( 4 )</span>
        </button>

        <button
          id={`course-btn-buy-now-${course.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(course);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md bg-[#009f7f] hover:bg-[#008f72] active:bg-[#007a62] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
        >
          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Buy Now {displayPrice}</span>
        </button>
      </div>
    </div>
  );
};

