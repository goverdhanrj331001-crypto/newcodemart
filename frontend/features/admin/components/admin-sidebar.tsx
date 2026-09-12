"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Package,
  Layers,
  GraduationCap,
  Users,
  Image as ImageIcon,
  MessageSquare,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronRight,
  Boxes,
  FileText,
  AlertTriangle,
  FolderTree,
} from "lucide-react";

interface AdminSidebarProps {
  isCollapsed?: boolean;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activePath?: string;
  onSelectRoute?: (route: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isCollapsed = false,
  isOpenMobile = false,
  onCloseMobile,
  activePath = "/admin/dashboard",
  onSelectRoute,
}) => {
  const currentPathname = usePathname();
  const current = activePath || currentPathname || "/admin/dashboard";

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    products: true,
    categories: true,
    courses: true,
  });

  const toggleSubmenu = (key: string) => {
    setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isNavActive = (path: string) => {
    if (path === "/admin" || path === "/admin/dashboard") {
      return current === "/admin" || current === "/admin/dashboard";
    }
    return current.startsWith(path);
  };

  const handleRouteClick = (path: string) => {
    onSelectRoute?.(path);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/50 md:hidden backdrop-blur-xs"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed bottom-0 top-[70px] z-30 flex flex-col justify-between border-r border-gray-200 bg-white dark:border-neutral-800 dark:bg-[#212121] transition-all duration-300 ${
          isOpenMobile ? "translate-x-0 w-60" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-[72px]" : "md:w-60"}`}
      >
        <div className="flex grow flex-col overflow-y-auto no-scrollbar py-4 px-3">
          {/* Section: MAIN */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase mb-2">
                Main
              </h3>
            )}
            <button
              type="button"
              onClick={() => handleRouteClick("/admin/dashboard")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                isNavActive("/admin/dashboard")
                  ? "bg-[#e6f5f1] text-[#009f7f] font-bold dark:bg-[#009f7f]/15 dark:text-[#009f7f]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </button>
          </div>

          {/* Section: PRODUCT MANAGEMENT */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase mb-2">
                Product Management
              </h3>
            )}

            {/* Products Dropdown Accordion */}
            <div>
              <button
                type="button"
                onClick={() => toggleSubmenu("products")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  current.includes("/admin/products")
                    ? "bg-gray-100/80 text-gray-900 font-semibold dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4.5 w-4.5 shrink-0" />
                  {!isCollapsed && <span>Products</span>}
                </div>
                {!isCollapsed && (
                  expandedMenus.products ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {/* Subitems */}
              {!isCollapsed && expandedMenus.products && (
                <div className="ml-4 border-l border-gray-200 pl-3 my-1 space-y-1 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleRouteClick("/admin/products")}
                    className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors cursor-pointer ${
                      current === "/admin/products"
                        ? "text-[#009f7f] font-bold bg-[#e6f5f1]/60 dark:bg-[#009f7f]/10"
                        : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    All Product
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRouteClick("/admin/products/create")}
                    className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors cursor-pointer ${
                      current === "/admin/products/create"
                        ? "text-[#009f7f] font-bold bg-[#e6f5f1]/60 dark:bg-[#009f7f]/10"
                        : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    Add new product
                  </button>
                </div>
              )}
            </div>

            {/* Categories Accordion */}
            <div className="mt-1">
              <button
                type="button"
                onClick={() => toggleSubmenu("categories")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  current.includes("/admin/categories")
                    ? "bg-gray-100/80 text-gray-900 font-semibold dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderTree className="h-4.5 w-4.5 shrink-0" />
                  {!isCollapsed && <span>Categories</span>}
                </div>
                {!isCollapsed && (
                  expandedMenus.categories ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {!isCollapsed && expandedMenus.categories && (
                <div className="ml-4 border-l border-gray-200 pl-3 my-1 space-y-1 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleRouteClick("/admin/categories")}
                    className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors cursor-pointer ${
                      current === "/admin/categories"
                        ? "text-[#009f7f] font-bold bg-[#e6f5f1]/60 dark:bg-[#009f7f]/10"
                        : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    All Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRouteClick("/admin/categories/create")}
                    className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors cursor-pointer ${
                      current === "/admin/categories/create"
                        ? "text-[#009f7f] font-bold bg-[#e6f5f1]/60 dark:bg-[#009f7f]/10"
                        : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    Add new category
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section: ACADEMY / COURSES */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase mb-2">
                Academy & Courses
              </h3>
            )}
            <div>
              <button
                type="button"
                onClick={() => toggleSubmenu("courses")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                  current.includes("/admin/courses")
                    ? "bg-gray-100/80 text-gray-900 font-semibold dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4.5 w-4.5 shrink-0" />
                  {!isCollapsed && <span>Courses</span>}
                </div>
                {!isCollapsed && (
                  expandedMenus.courses ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {!isCollapsed && expandedMenus.courses && (
                <div className="ml-4 border-l border-gray-200 pl-3 my-1 space-y-1 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => handleRouteClick("/admin/courses")}
                    className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors cursor-pointer ${
                      current === "/admin/courses"
                        ? "text-[#009f7f] font-bold bg-[#e6f5f1]/60 dark:bg-[#009f7f]/10"
                        : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    All Courses
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRouteClick("/admin/courses/create")}
                    className={`block w-full text-left py-1.5 px-2 rounded text-sm transition-colors cursor-pointer ${
                      current === "/admin/courses/create"
                        ? "text-[#009f7f] font-bold bg-[#e6f5f1]/60 dark:bg-[#009f7f]/10"
                        : "text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                    }`}
                  >
                    Add new course
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section: USER MANAGEMENT */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase mb-2">
                User Management
              </h3>
            )}
            <button
              type="button"
              onClick={() => handleRouteClick("/admin/users")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                isNavActive("/admin/users")
                  ? "bg-[#e6f5f1] text-[#009f7f] font-bold dark:bg-[#009f7f]/15 dark:text-[#009f7f]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <Users className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Users</span>}
            </button>
          </div>

          {/* Section: MARKETING & PROMO */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase mb-2">
                Marketing & Banners
              </h3>
            )}
            <button
              type="button"
              onClick={() => handleRouteClick("/admin/banners")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors mb-1 cursor-pointer ${
                isNavActive("/admin/banners")
                  ? "bg-[#e6f5f1] text-[#009f7f] font-bold dark:bg-[#009f7f]/15 dark:text-[#009f7f]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <ImageIcon className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Banners</span>}
            </button>

            <button
              type="button"
              onClick={() => handleRouteClick("/admin/reviews")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                isNavActive("/admin/reviews")
                  ? "bg-[#e6f5f1] text-[#009f7f] font-bold dark:bg-[#009f7f]/15 dark:text-[#009f7f]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Reviews</span>}
            </button>
          </div>

          {/* Section: SETTINGS */}
          <div className="mb-4">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-bold tracking-wider text-gray-400 dark:text-neutral-500 uppercase mb-2">
                Settings
              </h3>
            )}
            <button
              type="button"
              onClick={() => handleRouteClick("/admin/settings")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer ${
                isNavActive("/admin/settings")
                  ? "bg-[#e6f5f1] text-[#009f7f] font-bold dark:bg-[#009f7f]/15 dark:text-[#009f7f]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              <SettingsIcon className="h-4.5 w-4.5 shrink-0" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="border-t border-gray-200 p-3 text-center text-xs text-gray-400 dark:border-neutral-800 dark:text-neutral-500">
            ©2026 <span className="font-semibold text-[#009f7f]">Pixer</span>. Copyright © REDQ. All rights reserved.
          </div>
        )}
      </aside>
    </>
  );
};
