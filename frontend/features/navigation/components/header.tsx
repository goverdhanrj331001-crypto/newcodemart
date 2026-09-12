"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sun, Moon, Search, ShoppingCart, User, Menu, LayoutGrid } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { useAuth } from "@/features/auth/auth-context";

interface HeaderProps {
  onToggleSidebar?: () => void;
  onOpenSearch?: () => void;
  onOpenCart?: () => void;
  onOpenSellerModal?: () => void;
  onOpenUserModal?: () => void;
  onToggleLayout?: () => void;
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  onOpenSearch,
  onOpenCart,
  onOpenSellerModal,
  onOpenUserModal,
  onToggleLayout,
  cartCount = 0,
}) => {
  const { theme, mounted, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [layoutMode, setLayoutMode] = useState<"standard" | "compact">("standard");

  const isDark = mounted ? theme === "dark" : true;

  const handleLayoutClick = () => {
    setLayoutMode((prev) => (prev === "standard" ? "compact" : "standard"));
    onToggleLayout?.();
  };

  const initials = user?.name
    ?.split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) || "U";

  return (
    <header
      id="main-header"
      className="sticky items-center bg-white dark:bg-neutral-800 box-border flex h-16 justify-between min-h-[auto] min-w-[auto] w-full z-30 border-gray-200 dark:border-zinc-800 px-4 py-1 border-b border-solid left-0 top-0 md:h-[70px] md:px-6 transition-colors duration-200"
    >
      {/* Left section: Hamburger + Brand Logo */}
      <div className="items-center box-border gap-x-4 flex min-h-[auto] min-w-[auto] gap-y-4">
        <button
          id="header-hamburger-btn"
          type="button"
          aria-label="Toggle navigation menu"
          onClick={onToggleSidebar}
          title="Toggle / Minimize Sidebar"
          className="text-gray-600 dark:text-zinc-400 font-semibold items-center bg-transparent flex justify-center h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link
          href="/"
          id="header-logo-link"
          className="relative text-gray-900 dark:text-white items-center box-border flex min-h-[auto] min-w-[auto] w-20 cursor-pointer"
        >
          <span className="relative box-border block h-10 min-h-[auto] min-w-[auto] w-32 overflow-hidden">
            <Image
              alt="Pixer"
              src="https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/12.png"
              fill
              priority
              sizes="(max-width: 768px) 120px, 140px"
              className="object-contain"
              referrerPolicy="no-referrer"
            />
          </span>
        </Link>
      </div>

      {/* Right section: Search, Theme, Layout, Cart, User */}
      <div className="relative items-center box-border gap-x-3 flex min-h-[auto] min-w-[auto] sm:gap-x-4 md:gap-x-5 pr-0.5">
        {/* Search button */}
        <button
          id="header-search-btn"
          type="button"
          aria-label="Search products"
          onClick={onOpenSearch}
          title="Search products and categories (Ctrl+K)"
          className="text-gray-600 dark:text-zinc-400 font-semibold items-center bg-transparent flex justify-center h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Theme switcher button (Light / Dark) */}
        <button
          id="header-theme-switcher-btn"
          type="button"
          aria-label="Theme Switcher"
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="text-gray-600 dark:text-zinc-400 font-semibold items-center bg-transparent flex h-9 w-9 justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-amber-500 transition-colors cursor-pointer"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
          ) : (
            <Moon className="h-5 w-5 text-indigo-600 transition-transform duration-300" />
          )}
        </button>

        {/* Layout toggle button */}
        <button
          id="header-layout-btn"
          type="button"
          aria-label="Layout density toggle"
          onClick={handleLayoutClick}
          title={`Grid density: ${layoutMode === "standard" ? "Standard (Click for Compact)" : "Compact (Click for Standard)"}`}
          className={`text-gray-600 dark:text-zinc-400 font-semibold items-center bg-transparent hidden justify-center h-9 w-9 rounded-lg md:flex hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ${
            layoutMode === "compact" ? "text-emerald-500 bg-gray-100 dark:bg-zinc-700/40" : ""
          }`}
        >
          <LayoutGrid className="h-5 w-5" />
        </button>

        {/* Cart button */}
        <button
          id="header-cart-btn"
          type="button"
          aria-label="View Shopping Cart"
          onClick={onOpenCart}
          title="View Shopping Cart"
          className="text-gray-600 dark:text-zinc-400 font-semibold items-center bg-transparent flex justify-center h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-colors relative cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span
              id="header-cart-counter"
              className="absolute text-white text-[10px] font-bold items-center bg-emerald-500 box-border flex shrink-0 justify-center leading-[10px] h-4.5 min-w-4.5 px-1 rounded-full border-2 border-white dark:border-neutral-800 -right-1 -top-1"
            >
              {cartCount}
            </span>
          )}
        </button>

        {/* Admin Panel button */}
        <Link
          href="/admin"
          id="header-admin-btn"
          title="Go to Pixer Admin Dashboard"
          className="items-center bg-emerald-500/10 text-[#009f7f] hover:bg-[#009f7f] hover:text-white font-bold text-xs px-2.5 py-1.5 rounded-lg border border-[#009f7f]/30 transition-all cursor-pointer hidden sm:flex gap-1.5"
        >
          <span>Admin</span>
        </Link>

        {/* User account button */}
        <button
          id="header-user-btn"
          type="button"
          aria-label="User Account"
          onClick={onOpenUserModal}
          title={isAuthenticated ? `${user?.name} (${user?.role})` : "Sign in / Register"}
          className="text-gray-600 dark:text-zinc-400 font-semibold items-center bg-transparent flex justify-center h-9 w-9 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700/50 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer overflow-hidden"
        >
          {isAuthenticated && user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={user.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : isAuthenticated ? (
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center border border-emerald-500/30">
              {initials}
            </div>
          ) : (
            <User className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
};
