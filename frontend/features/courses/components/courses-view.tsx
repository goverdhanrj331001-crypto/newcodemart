"use client";

import React, { useState, useMemo } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { Product } from "@/features/products/types/product.types";
import { POPULAR_COURSES } from "../data/courses.data";
import { CoursesHeroGrid } from "./courses-hero-grid";
import { CoursesFilterPills } from "./courses-filter-pills";
import { CourseCard } from "./course-card";

interface CoursesViewProps {
  onAddToCart?: (product: Product) => void;
  onPreview?: (product: Product) => void;
  onDetails?: (product: Product) => void;
  onWatchAd?: (product: Product) => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  onAddToCart,
  onPreview,
  onDetails,
  onWatchAd,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Courses");
  const [activeInstructorFilter, setActiveInstructorFilter] = useState<string | null>(null);

  // Filter courses based on selected category pill
  const filteredCourses = useMemo(() => {
    let list = POPULAR_COURSES;

    if (activeInstructorFilter) {
      list = list.filter(
        (c) => c.author.name.toLowerCase() === activeInstructorFilter.toLowerCase()
      );
    }

    if (selectedCategory && selectedCategory !== "All Courses" && selectedCategory !== "All") {
      list = list.filter((c) => {
        const cat = c.category.toLowerCase();
        const sel = selectedCategory.toLowerCase();
        return cat.includes(sel) || sel.includes(cat);
      });
    }

    return list;
  }, [selectedCategory, activeInstructorFilter]);

  const handleSelectHeroCourse = (heroId: string) => {
    const courseId = heroId === "hero-1" ? "course-1" : heroId === "hero-2" ? "course-4" : "course-5";
    const course = POPULAR_COURSES.find((c) => c.id === courseId);
    if (course) {
      if (onDetails) onDetails(course);
      else if (onPreview) onPreview(course);
    }
  };

  return (
    <div
      id="courses-view-container"
      className="w-full bg-gray-50 dark:bg-[#181818] min-h-screen text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-200"
    >
      {/* Top Header Row: Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Learn new skills, build your future. Explore our curated courses and start your journey today.
          </p>
        </div>
      </div>

      {/* Active Instructor Filter Banner (if clicked) */}
      {activeInstructorFilter && (
        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
          <span className="text-xs font-medium text-emerald-800 dark:text-emerald-300">
            Showing courses taught by <strong>{activeInstructorFilter}</strong>
          </span>
          <button
            type="button"
            onClick={() => setActiveInstructorFilter(null)}
            className="text-xs font-semibold text-[#009f7f] dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Category Pills Filter Bar matching user image */}
      <CoursesFilterPills
        selectedCategory={selectedCategory}
        onSelectCategory={(catName) => {
          setSelectedCategory(catName);
        }}
      />

      {/* Top 3 Featured Hero Cards Grid matching user image */}
      <CoursesHeroGrid onSelectHeroCourse={handleSelectHeroCourse} />

      {/* Section Header: "Popular Courses" and "View All Courses ->" */}
      <div className="flex items-center justify-between mb-4 pt-2">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
          Popular Courses
        </h2>
        <button
          type="button"
          id="btn-view-all-courses"
          onClick={() => {
            setSelectedCategory("All Courses");
            setActiveInstructorFilter(null);
          }}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#009f7f] dark:text-emerald-400 hover:text-[#008f72] dark:hover:text-emerald-300 transition-colors cursor-pointer group"
        >
          <span>View All Courses</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Responsive Grid: Mobile 1 col, Tablet 2 cols, Laptop/Desktop 3 cols */}
      {filteredCourses.length > 0 ? (
        <div
          id="popular-courses-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4 md:gap-5"
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPreview={(item) => onPreview?.(item)}
              onDetails={(item) => onDetails?.(item)}
              onAddToCart={(item) => onAddToCart?.(item)}
              onWatchAd={(item) => onWatchAd?.(item as unknown as Product)}
              onAuthorClick={(authorName) => setActiveInstructorFilter(authorName)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] rounded-2xl p-8 shadow-2xs">
          <BookOpen className="w-10 h-10 text-gray-400 dark:text-neutral-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            No courses found in this category
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            Try switching to &quot;All Courses&quot; or explore another category from the filter bar above.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All Courses");
              setActiveInstructorFilter(null);
            }}
            className="mt-4 px-4 py-2 bg-[#009f7f] hover:bg-[#008f72] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
