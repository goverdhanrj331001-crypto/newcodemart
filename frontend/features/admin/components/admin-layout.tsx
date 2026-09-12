"use client";

import React, { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminDashboardView } from "./admin-dashboard-view";
import { AdminProductsView } from "./admin-products-view";
import { AdminAddProductView } from "./admin-add-product-view";
import { AdminCategoriesView } from "./admin-categories-view";
import { AdminAddCategoryView } from "./admin-add-category-view";
import { AdminUsersView } from "./admin-users-view";
import { AdminCoursesView } from "./admin-courses-view";
import { AdminAddCourseView } from "./admin-add-course-view";
import { AdminBannersView } from "./admin-banners-view";
import { AdminReviewsView } from "./admin-reviews-view";
import { AdminSettingsView } from "./admin-settings-view";

interface AdminLayoutProps {
  initialPath?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  initialPath = "/admin/dashboard",
}) => {
  const [activeRoute, setActiveRoute] = useState<string>(initialPath);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const renderActiveView = () => {
    switch (activeRoute) {
      case "/admin":
      case "/admin/dashboard":
        return <AdminDashboardView />;

      case "/admin/products":
      case "/admin/products/drafts":
        return (
          <AdminProductsView
            onNavigateAddProduct={() => setActiveRoute("/admin/products/create")}
          />
        );

      case "/admin/products/create":
        return (
          <AdminAddProductView
            onSuccess={() => setActiveRoute("/admin/products")}
          />
        );

      case "/admin/categories":
        return (
          <AdminCategoriesView
            onNavigateAddCategory={() => setActiveRoute("/admin/categories/create")}
          />
        );

      case "/admin/categories/create":
        return (
          <AdminAddCategoryView
            onSuccess={() => setActiveRoute("/admin/categories")}
          />
        );

      case "/admin/users":
        return <AdminUsersView />;

      case "/admin/courses":
        return (
          <AdminCoursesView
            onNavigateAddCourse={() => setActiveRoute("/admin/courses/create")}
          />
        );

      case "/admin/courses/create":
        return (
          <AdminAddCourseView
            onSuccess={() => setActiveRoute("/admin/courses")}
          />
        );

      case "/admin/banners":
        return <AdminBannersView />;

      case "/admin/reviews":
        return <AdminReviewsView />;

      case "/admin/settings":
        return <AdminSettingsView />;

      default:
        return <AdminDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900 dark:bg-[#181818] dark:text-neutral-100 flex flex-col antialiased">
      {/* Top Fixed Header */}
      <AdminHeader
        onToggleSidebar={() => {
          setIsSidebarCollapsed((prev) => !prev);
          setIsMobileSidebarOpen((prev) => !prev);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 pt-[70px]">
        {/* Left Sidebar */}
        <AdminSidebar
          isCollapsed={isSidebarCollapsed}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          activePath={activeRoute}
          onSelectRoute={(route) => setActiveRoute(route)}
        />

        {/* Full-width Main Right Content Area */}
        <main
          className={`flex-1 transition-all duration-300 w-full min-h-[calc(100vh-70px)] ${
            isSidebarCollapsed ? "md:ml-[72px]" : "md:ml-60"
          }`}
        >
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};
