"use client";

import React from "react";
import Link from "next/link";
import { LongArrowIcon } from "./pixer-icons";

interface ProductBackNavProps {
  label?: string;
  href?: string;
}

export const ProductBackNav: React.FC<ProductBackNavProps> = ({
  label = "Back to Marketplace",
  href = "/",
}) => {
  return (
    <div className="mb-4 flex items-center">
      <Link
        id="product-back-link"
        href={href}
        className="group inline-flex items-center gap-2 font-medium text-13px text-gray-500 dark:text-[#a8a8a8] hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <span className="transition-transform group-hover:-translate-x-1">
          <LongArrowIcon className="h-3.5 w-3.5" />
        </span>
        <span>{label}</span>
      </Link>
    </div>
  );
};

