"use client";

import React from "react";
import {
  ShoppingCart,
  Smartphone,
  LayoutDashboard,
  Globe,
  Layers,
  BookOpen,
  GraduationCap,
  UtensilsCrossed,
  Building2,
  Cloud,
  Gift,
  Box,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import { CategoryItem } from "../types/categories.types";

interface CategoryCardProps {
  category: CategoryItem;
  onSelect: (category: CategoryItem) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  ShoppingCart,
  Smartphone,
  LayoutDashboard,
  Globe,
  Layers,
  BookOpen,
  GraduationCap,
  UtensilsCrossed,
  Building2,
  Cloud,
  Gift,
  Box,
  Sparkles,
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onSelect,
}) => {
  const IconComponent = category.iconName ? ICON_MAP[category.iconName] : null;

  return (
    <div
      id={`category-card-${category.id}`}
      role="button"
      tabIndex={0}
      onClick={() => onSelect(category)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(category);
        }
      }}
      className="box-border bg-white dark:bg-[#212121] hover:bg-gray-50 dark:hover:bg-[#282828] border border-gray-200 dark:border-transparent hover:border-gray-300 dark:hover:border-[#383838] rounded-2xl p-5 md:p-6 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer group shadow-2xs hover:shadow-md hover:-translate-y-1 select-none"
    >
      {/* Centered Large App Badge Icon */}
      <div
        className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg relative overflow-hidden transition-transform duration-200 group-hover:scale-105 bg-gradient-to-br ${category.gradient}`}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/20 pointer-events-none" />

        {IconComponent ? (
          <IconComponent className="w-10 h-10 md:w-11 md:h-11 text-white stroke-[1.8] relative z-10 drop-shadow-md" />
        ) : (
          <span className="text-white font-black text-2xl md:text-3xl tracking-tight relative z-10 drop-shadow-md select-none">
            {category.monogram || category.name.charAt(0)}
          </span>
        )}
      </div>

      {/* Category Name */}
      <h3 className="text-gray-900 dark:text-white font-bold text-sm md:text-base mt-4 group-hover:text-[#009f7f] dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
        {category.name}
      </h3>

      {/* Product Count */}
      <span className="text-gray-500 dark:text-neutral-400 text-xs mt-1 font-medium">
        {category.count}
      </span>
    </div>
  );
};
