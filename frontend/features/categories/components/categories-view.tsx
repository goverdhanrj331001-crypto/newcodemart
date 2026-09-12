"use client";

import React, { useState, useMemo } from "react";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import { CategoryGroupType, CategoryItem } from "../types/categories.types";
import { CATEGORIES_BY_TECH, CATEGORIES_BY_PROJECT_TYPE } from "../data/categories.data";
import { CategoryCard } from "./category-card";

interface CategoriesViewProps {
  onSelectCategory?: (categoryName: string) => void;
  onExploreCategory?: (category: CategoryItem) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  onSelectCategory,
  onExploreCategory,
}) => {
  const [activeGroup, setActiveGroup] = useState<CategoryGroupType>("tech");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewCategory, setPreviewCategory] = useState<CategoryItem | null>(null);

  const currentList = activeGroup === "tech" ? CATEGORIES_BY_TECH : CATEGORIES_BY_PROJECT_TYPE;

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return currentList;
    const query = searchQuery.toLowerCase().trim();
    return currentList.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query) ||
        cat.filterCategory.toLowerCase().includes(query)
    );
  }, [currentList, searchQuery]);

  const handleCardClick = (category: CategoryItem) => {
    if (onSelectCategory) {
      onSelectCategory(category.filterCategory);
    } else if (onExploreCategory) {
      onExploreCategory(category);
    } else {
      setPreviewCategory(category);
    }
  };

  return (
    <div
      id="categories-page-container"
      className="w-full min-h-screen bg-gray-50 dark:bg-[#181818] text-gray-900 dark:text-white px-4 py-5 md:px-8 md:py-7 flex flex-col transition-colors duration-200"
    >
      {/* Sub-header Controls Bar (Matching User's Screenshot Layout) */}
      <div
        id="categories-controls-bar"
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 md:pb-8 border-b border-gray-200 dark:border-[#262626]"
      >
        {/* Left: Search by name... input */}
        <div className="relative flex items-center bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] hover:border-gray-300 dark:hover:border-[#444] focus-within:border-gray-400 dark:focus-within:border-neutral-200 rounded-full px-4 h-[48px] sm:h-[52px] w-full sm:w-80 md:w-96 transition-colors shadow-2xs">
          <Search className="w-4 h-4 text-gray-400 dark:text-neutral-400 shrink-0 mr-3" />
          <input
            id="category-search-input"
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 text-sm focus:outline-none w-full min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="text-gray-400 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white p-1 ml-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: By Tech / By Project Type Toggle Switch (Matches screenshot's pill switcher - Large & Full-width on mobile) */}
        <div
          id="categories-toggle-switch"
          className="w-full sm:w-auto flex items-center bg-gray-200/80 dark:bg-[#212121] p-1.5 rounded-full border border-gray-300/80 dark:border-[#333333] shadow-inner sm:min-w-[360px] md:min-w-[420px]"
        >
          <button
            type="button"
            id="toggle-by-tech"
            onClick={() => setActiveGroup("tech")}
            className={`cursor-pointer flex-1 text-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 select-none ${
              activeGroup === "tech"
                ? "bg-white text-gray-900 shadow-sm scale-[1.01]"
                : "text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            By Tech
          </button>
          <button
            type="button"
            id="toggle-by-project-type"
            onClick={() => setActiveGroup("project_type")}
            className={`cursor-pointer flex-1 text-center justify-center px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 select-none ${
              activeGroup === "project_type"
                ? "bg-white text-gray-900 shadow-sm scale-[1.01]"
                : "text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
          >
            By Project type
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="pt-6 md:pt-8 grow">
        {filteredCategories.length > 0 ? (
          <div
            id="categories-cards-grid"
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 md:gap-5"
          >
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onSelect={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center justify-center text-gray-400 dark:text-neutral-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-gray-900 dark:text-white text-base font-semibold">No categories found</h3>
            <p className="text-gray-500 dark:text-neutral-400 text-xs sm:text-sm mt-1 max-w-sm">
              No categories matched &ldquo;{searchQuery}&rdquo;. Try another search term or reset your filter.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 text-gray-900 dark:text-white rounded-lg text-xs font-medium border border-gray-200 dark:border-neutral-700 transition-colors cursor-pointer shadow-2xs"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>

      {/* Quick Category Preview Drawer / Modal if no parent handler */}
      {previewCategory && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewCategory(null)}
        >
          <div
            className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#383838] rounded-2xl max-w-md w-full p-6 text-gray-900 dark:text-white shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewCategory(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:text-neutral-400 dark:hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${previewCategory.gradient} shadow-md`}
              >
                <span className="text-white font-black text-2xl">
                  {previewCategory.monogram || previewCategory.name.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{previewCategory.name}</h4>
                <p className="text-xs text-[#009f7f] dark:text-emerald-400 font-semibold mt-0.5">
                  {previewCategory.count} Available
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-neutral-300 text-sm mt-4 leading-relaxed">
              {previewCategory.description}
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(previewCategory.filterCategory);
                  }
                  setPreviewCategory(null);
                }}
                className="grow bg-[#009f7f] hover:bg-[#008f72] text-white py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                Browse {previewCategory.name} Products
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
