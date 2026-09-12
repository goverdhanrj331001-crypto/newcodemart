"use client";

import React, { useRef } from "react";
import { CATEGORIES } from "../data/categories.data";

interface CategoryFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories?: string[];
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  categories = CATEGORIES,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 240,
        behavior: "smooth",
      });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -240,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      id="category-filter-bar"
      className="sticky bg-white dark:bg-neutral-900 box-border flex min-h-16 min-w-[auto] w-full z-20 border-gray-200 dark:border-zinc-800 overflow-hidden p-4 border-b border-solid top-16 md:min-h-[70px] md:px-7 md:py-5 md:top-[70px] transition-colors duration-200"
    >
      <div className="items-start box-border flex min-h-[auto] min-w-[auto] overflow-hidden -mb-4 w-full pr-8">
        <div
          ref={scrollContainerRef}
          id="category-pills-container"
          className="box-border gap-x-2.5 flex min-h-[auto] min-w-[auto] gap-y-2.5 scroll-smooth w-full overflow-x-auto no-scrollbar -mb-7 pb-7 items-center"
        >
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`category-pill-${category.toLowerCase().replace(/\s+/g, "-")}`}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={
                  isSelected
                    ? "text-white dark:text-neutral-900 text-xs font-semibold bg-[#111827] dark:bg-white caret-transparent block shrink-0 h-[32px] leading-4 min-h-[auto] min-w-[auto] text-center px-4 py-1.5 rounded-full shadow-xs cursor-pointer transition-all"
                    : "text-gray-700 dark:text-stone-200 text-xs font-medium bg-[#f0f2f5] dark:bg-zinc-800 hover:bg-[#e4e7eb] dark:hover:bg-neutral-700 caret-transparent block shrink-0 h-[32px] leading-4 min-h-[auto] min-w-[auto] text-center px-4 py-1.5 rounded-full border border-transparent dark:border-neutral-700 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-all"
                }
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next scroll arrow with subtle fade background */}
      <button
        id="category-scroll-next-btn"
        type="button"
        title="Next categories"
        aria-label="Scroll next categories"
        onClick={handleScrollRight}
        className="absolute text-gray-500 dark:text-zinc-400 items-center bg-white/95 dark:bg-neutral-900/90 border border-gray-200 dark:border-zinc-700 flex h-8 justify-center text-center w-8 z-20 -mt-4 p-0 rounded-full right-2 top-2/4 md:right-6 hover:text-gray-900 dark:hover:text-white cursor-pointer shadow-md transition-colors"
      >
        <img
          src="https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-16.svg"
          alt="Scroll forward"
          className="box-border h-[18px] w-[18px]"
        />
      </button>
    </div>
  );
};
