"use client";

import React, { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { COURSE_CATEGORIES } from "../data/courses.data";

interface CourseFilterBarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CourseFilterBar: React.FC<CourseFilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
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

  return (
    <div
      id="course-filter-bar"
      className="sticky bg-neutral-900 box-border flex min-h-16 min-w-[auto] w-full z-20 border-zinc-800 overflow-hidden p-4 border-b border-solid top-16 md:min-h-[70px] md:px-7 md:py-5 md:top-[70px]"
    >
      <div className="items-start box-border flex min-h-[auto] min-w-[auto] overflow-hidden -mb-4 w-full pr-8">
        <div
          ref={scrollContainerRef}
          id="course-pills-container"
          className="box-border gap-x-3 flex min-h-[auto] min-w-[auto] gap-y-3 scroll-smooth w-full overflow-x-auto no-scrollbar -mb-7 pb-7"
        >
          {COURSE_CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                id={`course-pill-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                type="button"
                onClick={() => onSelectCategory(category)}
                className={
                  isSelected
                    ? "text-neutral-900 text-xs font-medium bg-white caret-transparent block shrink-0 h-[30px] leading-4 min-h-[auto] min-w-[auto] text-center border px-3.5 py-1.5 rounded-full border-white shadow-xs cursor-pointer transition-all"
                    : "text-stone-50 text-xs font-medium bg-zinc-800 caret-transparent block shrink-0 h-[30px] leading-4 min-h-[auto] min-w-[auto] text-center border border-neutral-700 px-3.5 py-1.5 rounded-full hover:text-white hover:bg-neutral-700 cursor-pointer transition-all"
                }
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next scroll arrow */}
      <button
        id="course-scroll-next-btn"
        type="button"
        title="Next course categories"
        aria-label="Scroll next categories"
        onClick={handleScrollRight}
        className="absolute text-zinc-400 items-center bg-neutral-900/90 flex h-8 justify-center text-center w-8 z-20 -mt-4 p-0 rounded-full right-2 top-2/4 md:right-6 hover:text-white cursor-pointer shadow-md transition-colors border border-neutral-800"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
