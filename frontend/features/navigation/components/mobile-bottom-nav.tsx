"use client";

import React from "react";
import {
  Compass,
  LayoutGrid,
  Search,
  GraduationCap,
  ShoppingBag,
  User,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface MobileBottomNavProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
  onOpenSearch: () => void;
  onOpenCart: () => void;
  cartCount: number;
  onOpenUserModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeNav,
  onSelectNav,
  onOpenSearch,
  onOpenCart,
  cartCount,
  onOpenUserModal,
}) => {
  const navItems = [
    {
      id: "explore",
      label: "Explore",
      icon: Compass,
      action: () => onSelectNav("explore"),
    },
    {
      id: "categories",
      label: "Categories",
      icon: LayoutGrid,
      action: () => onSelectNav("categories"),
    },
    {
      id: "search",
      label: "Search",
      icon: Search,
      action: onOpenSearch,
    },
    {
      id: "courses",
      label: "Courses",
      icon: GraduationCap,
      action: () => onSelectNav("courses"),
    },
    {
      id: "cart",
      label: "Cart",
      icon: ShoppingBag,
      action: onOpenCart,
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: "profile",
      label: "Account",
      icon: User,
      action: onOpenUserModal,
    },
  ];

  return (
    <nav
      id="mobile-bottom-navbar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800 shadow-lg px-1 py-2 flex items-center justify-around"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.action}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative cursor-pointer transition-colors ${
              isActive
                ? "text-[#009f7f] dark:text-[#009f7f] font-bold"
                : "text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200"
            }`}
          >
            <div className="relative">
              <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 bg-[#009f7f] text-white text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center leading-none shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight font-medium">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute bottom-0 w-6 h-0.5 bg-[#009f7f] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
