"use client";

import React, { useRef } from "react";
import {
  GraduationCap,
  Laptop,
  Smartphone,
  Layout,
  Server,
  Code2,
  BarChart3,
  Brain,
  Briefcase,
  Palette,
  Megaphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { COURSE_PILL_CATEGORIES } from "../data/courses.data";

interface CoursesFilterPillsProps {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "Laptop":
      return <Laptop className="w-3.5 h-3.5" />;
    case "Smartphone":
      return <Smartphone className="w-3.5 h-3.5" />;
    case "Layout":
      return <Layout className="w-3.5 h-3.5" />;
    case "Server":
      return <Server className="w-3.5 h-3.5" />;
    case "Code2":
      return <Code2 className="w-3.5 h-3.5" />;
    case "BarChart3":
      return <BarChart3 className="w-3.5 h-3.5" />;
    case "Brain":
      return <Brain className="w-3.5 h-3.5" />;
    case "Briefcase":
      return <Briefcase className="w-3.5 h-3.5" />;
    case "Palette":
      return <Palette className="w-3.5 h-3.5" />;
    case "Megaphone":
      return <Megaphone className="w-3.5 h-3.5" />;
    default:
      return <GraduationCap className="w-3.5 h-3.5" />;
  }
};

export const CoursesFilterPills: React.FC<CoursesFilterPillsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="relative flex items-center mb-6 group/filter">
      {/* Left Scroll Button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#383838] shadow-md text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333333] absolute -left-3.5 z-10 opacity-0 group-hover/filter:opacity-100 transition-opacity cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal Pills Container */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-0.5 w-full scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {COURSE_PILL_CATEGORIES.map((cat) => {
          const isActive =
            selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
            (cat.name === "All Courses" &&
              (selectedCategory === "All" || selectedCategory === "All Courses"));

          return (
            <button
              key={cat.id}
              id={`filter-pill-${cat.id}`}
              type="button"
              onClick={() => onSelectCategory(cat.name)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 shrink-0 cursor-pointer shadow-2xs ${
                isActive
                  ? "bg-[#009f7f] dark:bg-emerald-600 text-white border border-[#009f7f] dark:border-emerald-500 shadow-emerald-500/20"
                  : "bg-white dark:bg-[#212121] text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-[#333333] hover:bg-gray-50 dark:hover:bg-[#2c2c2c] hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-[#444444]"
              }`}
            >
              {getCategoryIcon(cat.icon)}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Right Scroll Button */}
      <button
        type="button"
        onClick={() => scroll("right")}
        className="hidden md:flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#383838] shadow-md text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#333333] absolute -right-3.5 z-10 opacity-0 group-hover/filter:opacity-100 transition-opacity cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
