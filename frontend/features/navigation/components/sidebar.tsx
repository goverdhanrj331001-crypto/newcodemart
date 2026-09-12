"use client";

import React from "react";
import Link from "next/link";
import {
  Home,
  Compass,
  Flame,
  LayoutGrid,
  GraduationCap,
  Mail,
  Share2,
  Settings,
  HelpCircle,
  LucideIcon,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { PRIMARY_NAV_ITEMS, SECONDARY_NAV_ITEMS, FOOTER_LINKS } from "../data/navigation.data";

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  activeItem?: string;
  onSelectItem?: (id: string) => void;
}

const NAV_ICON_MAP: Record<string, LucideIcon> = {
  home: Home,
  explore: Compass,
  "popular-products": Flame,
  categories: LayoutGrid,
  courses: GraduationCap,
  "contact-us": Mail,
  social: Share2,
  profile: Settings,
  help: HelpCircle,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenMobile = false,
  onCloseMobile,
  isCollapsed = false,
  onToggleCollapse,
  activeItem = "home",
  onSelectItem,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed text-gray-600 dark:text-neutral-400 bg-white dark:bg-neutral-800 box-border flex flex-col h-full justify-between z-30 md:z-20 overflow-visible pt-[70px] md:pt-[76px] bottom-0 transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-zinc-800 ${
          isOpenMobile ? "translate-x-0 w-60" : "-translate-x-full md:translate-x-0"
        } ${isCollapsed ? "md:w-[72px]" : "md:w-60"}`}
      >
        <div className="relative items-stretch box-border flex h-full min-h-0 min-w-0 w-full overflow-hidden md:min-h-[auto] md:min-w-[auto]">
          <div className="relative box-border grow min-h-0 w-full z-0 overflow-y-auto left-0 top-0 md:min-h-[auto] no-scrollbar">
            <div className="box-border flex flex-col h-full w-full">
              {/* Primary Navigation */}
              <nav
                id="sidebar-primary-nav"
                className="box-border flex flex-col min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]"
              >
                {PRIMARY_NAV_ITEMS.map((item) => {
                  const isActive = activeItem === item.id;
                  const IconComp = NAV_ICON_MAP[item.id];
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      type="button"
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => {
                        onSelectItem?.(item.id);
                        onCloseMobile?.();
                      }}
                      className={`items-center box-border flex min-h-0 min-w-0 my-0.5 transition-colors w-full cursor-pointer group relative ${
                        isCollapsed
                          ? "justify-center px-0 py-3"
                          : "gap-x-2 px-4 py-3 md:px-6 text-left"
                      } ${
                        isActive
                          ? "text-gray-900 dark:text-neutral-200 font-semibold bg-gray-100 dark:bg-zinc-800"
                          : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <span
                        className={`items-center box-border flex shrink-0 justify-center ${
                          isCollapsed ? "w-full" : "w-6 md:w-7"
                        }`}
                      >
                        {IconComp ? (
                          <IconComp
                            className={`box-border h-[18px] w-[18px] transition-colors ${
                              isActive
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-gray-400 dark:text-neutral-400 group-hover:text-gray-700 dark:group-hover:text-neutral-200"
                            }`}
                          />
                        ) : (
                          <img
                            src={item.icon}
                            alt=""
                            aria-hidden="true"
                            className="box-border h-[18px] w-[18px]"
                          />
                        )}
                      </span>
                      {!isCollapsed && (
                        <span className="box-border flex min-h-0 min-w-0 truncate text-xs md:text-[13px]">
                          {item.label}
                        </span>
                      )}

                      {/* Tooltip on collapsed hover */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 dark:bg-zinc-900 text-white text-xs font-medium rounded shadow-lg border border-gray-800 dark:border-zinc-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Secondary Navigation (Settings / Help) */}
              <nav
                id="sidebar-secondary-nav"
                className="box-border flex flex-col min-h-0 min-w-0 mt-auto pb-4 md:min-h-[auto] md:min-w-[auto]"
              >
                {SECONDARY_NAV_ITEMS.map((item) => {
                  const isActive = activeItem === item.id;
                  const IconComp = NAV_ICON_MAP[item.id];
                  return (
                    <button
                      key={item.id}
                      id={`sidebar-nav-${item.id}`}
                      type="button"
                      title={isCollapsed ? item.label : undefined}
                      onClick={() => {
                        onSelectItem?.(item.id);
                        onCloseMobile?.();
                      }}
                      className={`items-center box-border flex min-h-0 min-w-0 my-0.5 transition-colors w-full cursor-pointer group relative ${
                        isCollapsed
                          ? "justify-center px-0 py-3"
                          : "gap-x-2 px-4 py-3 md:px-6 text-left"
                      } ${
                        isActive
                          ? "text-gray-900 dark:text-neutral-200 font-semibold bg-gray-100 dark:bg-zinc-800"
                          : "text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-200 hover:bg-gray-50 dark:hover:bg-zinc-800/60"
                      }`}
                    >
                      <span
                        className={`items-center box-border flex shrink-0 justify-center ${
                          isCollapsed ? "w-full" : "w-6 md:w-7"
                        }`}
                      >
                        {IconComp ? (
                          <IconComp
                            className={`box-border h-[18px] w-[18px] transition-colors ${
                              isActive
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-gray-400 dark:text-neutral-400 group-hover:text-gray-700 dark:group-hover:text-neutral-200"
                            }`}
                          />
                        ) : (
                          <img
                            src={item.icon}
                            alt=""
                            aria-hidden="true"
                            className="box-border h-[18px] w-[18px]"
                          />
                        )}
                      </span>
                      {!isCollapsed && (
                        <span className="box-border flex min-h-0 min-w-0 truncate text-xs md:text-[13px]">
                          {item.label}
                        </span>
                      )}

                      {/* Tooltip on collapsed hover */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-gray-900 dark:bg-zinc-900 text-white text-xs font-medium rounded shadow-lg border border-gray-800 dark:border-zinc-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                          {item.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        {!isCollapsed ? (
          <footer
            id="sidebar-footer"
            className="box-border flex flex-col min-h-0 min-w-0 text-center border-gray-200 dark:border-zinc-800 pt-3 pb-4 border-t border-solid md:min-h-[auto] md:min-w-[auto]"
          >
            <nav className="font-medium items-center box-border gap-x-5 flex justify-center tracking-[0.2px] min-h-0 min-w-0 gap-y-5 capitalize pb-1.5 md:min-h-[auto] md:min-w-[auto]">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 dark:text-neutral-500 box-border block min-h-0 min-w-0 py-1 hover:text-emerald-500 transition-colors text-xs"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <span className="text-gray-400 dark:text-neutral-500 text-xs font-medium box-border inline tracking-[0.2px] leading-4 min-h-0 min-w-0 px-2 md:block md:min-h-[auto] md:min-w-[auto]">
              ©2026{" "}
              <Link
                href="/"
                className="box-border text-gray-500 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
              >
                Pixer
              </Link>
              . All rights reserved.
            </span>
          </footer>
        ) : (
          <div className="py-3 border-t border-gray-200 dark:border-zinc-800 flex justify-center">
            <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-500">PXR</span>
          </div>
        )}
      </aside>
    </>
  );
};
