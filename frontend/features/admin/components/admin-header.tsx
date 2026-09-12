"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, Sun, Moon, Store, User } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";

interface AdminHeaderProps {
  onToggleSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onToggleSidebar,
  searchQuery = "",
  onSearchChange,
}) => {
  const { theme, mounted, toggleTheme } = useTheme();
  const isDark = mounted ? theme === "dark" : true;

  return (
    <header className="sticky top-0 z-40 flex h-[70px] w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 dark:border-neutral-800 dark:bg-[#212121] transition-colors duration-200">
      {/* Left branding & Hamburger */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link href="/admin" className="flex items-center gap-2">
          <div className="relative h-9 w-28">
            <Image
              alt="Pixer Admin"
              src="https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/12.png"
              fill
              priority
              sizes="112px"
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="hidden sm:inline-block rounded bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#009f7f] uppercase">
            Admin
          </span>
        </Link>
      </div>

      {/* Middle Route Search Input */}
      <div className="hidden max-w-md grow px-4 md:block">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search your route..."
            className="h-10 w-full rounded-full border border-gray-200 bg-gray-50/80 pl-10 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#009f7f] dark:focus:bg-[#262626]"
          />
        </div>
      </div>

      {/* Right User Info & Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Switch to Storefront Button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-[#009f7f] hover:text-[#009f7f] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-[#009f7f] dark:hover:text-[#009f7f] transition-all"
          title="Return to Main Marketplace Storefront"
        >
          <Store className="h-4 w-4" />
          <span className="hidden sm:inline">Storefront</span>
        </Link>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600" />
          )}
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 border-l border-gray-200 pl-3 dark:border-neutral-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
            <User className="h-5 w-5" />
          </div>
          <div className="hidden flex-col text-left sm:flex">
            <span className="text-sm font-bold text-gray-900 dark:text-neutral-100">
              Jhon Doe
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
