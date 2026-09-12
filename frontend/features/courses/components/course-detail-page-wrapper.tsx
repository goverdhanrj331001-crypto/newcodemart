"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/features/navigation/components/header";
import { Sidebar } from "@/features/navigation/components/sidebar";
import { CartDrawer } from "@/features/navigation/components/cart-drawer";
import { SearchModal } from "@/features/navigation/components/search-modal";
import { SellerModal } from "@/features/navigation/components/seller-modal";
import { UserAccountModal } from "@/features/navigation/components/user-account-modal";
import { CourseDetailsView } from "./course-details-view";
import { CourseDetailItem } from "../data/courses.data";
import { useProductCatalog } from "@/features/products/hooks/use-product-catalog";
import { getCleanSlug } from "@/features/products/utils/product.utils";

interface CourseDetailPageWrapperProps {
  course: CourseDetailItem;
}

export const CourseDetailPageWrapper: React.FC<CourseDetailPageWrapperProps> = ({
  course: initialCourse,
}) => {
  const router = useRouter();
  const [currentCourse, setCurrentCourse] = useState<CourseDetailItem>(initialCourse);
  const [activeNav, setActiveNav] = useState("courses");

  const {
    cartItems,
    isSearchModalOpen,
    isCartOpen,
    isSellerModalOpen,
    isUserModalOpen,
    isMobileSidebarOpen,
    allProducts,
    handleAddToCart,
    handleRemoveFromCart,
    handleCheckout,
    setIsSearchModalOpen,
    setIsCartOpen,
    setIsSellerModalOpen,
    setIsUserModalOpen,
    setIsMobileSidebarOpen,
  } = useProductCatalog();

  const handleSelectRelatedCourse = (course: CourseDetailItem) => {
    setCurrentCourse(course);
    const clean = getCleanSlug(course.slug);
    router.push(`/courses/${clean}`);
  };

  return (
    <div className="text-[13px] box-border min-h-screen leading-[19.5px] bg-[#f8fafc]">
      {/* Top Navigation Header matching user screenshot */}
      <Header
        onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
      />

      <div className="box-border flex basis-[0%] grow min-h-[auto] min-w-[auto]">
        {/* Left Navigation Sidebar */}
        <Sidebar
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          activeItem={activeNav}
          onSelectItem={(id) => {
            setActiveNav(id);
            if (id === "explore") {
              router.push("/explore");
            } else if (id === "home") {
              router.push("/");
            } else if (id === "categories") {
              router.push("/categories");
            } else if (id === "courses") {
              router.push("/courses");
            } else if (id === "contact-us") {
              router.push("/contact-us");
            } else if (id === "social") {
              router.push("/social");
            } else if (id === "popular-products") {
              router.push("/explore");
            }
          }}
        />

        {/* Main Content Area */}
        <main className="box-border flex flex-col w-full pl-0 md:pl-60 min-h-screen pb-20">
          <CourseDetailsView
            course={currentCourse}
            onBack={() => router.push("/courses")}
            onSelectRelatedCourse={handleSelectRelatedCourse}
            onAddToCart={(c) => {
              handleAddToCart(c);
              setIsCartOpen(true);
            }}
          />
        </main>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        products={allProducts}
        onSelectProduct={(prod) => {
          if (prod.id.startsWith("course-")) {
            setCurrentCourse(prod as CourseDetailItem);
            const clean = getCleanSlug(prod.slug);
            router.push(`/courses/${clean}`);
          } else {
            const clean = getCleanSlug(prod.slug);
            router.push(`/products/${clean}`);
          }
        }}
      />

      {/* Seller & Account Modals */}
      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
      />

      <UserAccountModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />
    </div>
  );
};
