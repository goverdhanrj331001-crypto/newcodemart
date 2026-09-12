"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Play, ShoppingCart, Eye, ExternalLink } from "lucide-react";
import { Product } from "../../types/product.types";
import {
  ShoppingCartIcon,
  DownloadIcon,
  PreviewIcon,
  HeartOutlineIcon,
  HeartFillIcon,
} from "./pixer-icons";

interface ProductDetailsPaperProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onWatchAd?: (product: Product) => void;
  onLivePreview?: (url: string) => void;
  className?: string;
  isStickyBar?: boolean;
}

export const ProductDetailsPaper: React.FC<ProductDetailsPaperProps> = ({
  product,
  onAddToCart,
  onWatchAd,
  onLivePreview,
  className = "",
  isStickyBar = false,
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const handleAdd = () => {
    setIsAdded(true);
    onAddToCart?.(product);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handlePreview = () => {
    const demoUrl = product.liveDemoUrl || `https://preview.pixer.io/demo/${product.slug}`;
    if (onLivePreview) {
      onLivePreview(demoUrl);
    } else {
      window.open(demoUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isFree = product.price?.toUpperCase() === "FREE" || Boolean(product.isFree);
  const displayPrice = isFree ? "$0.00" : product.price;

  // Initial for avatar circle (like 'N' in screenshot)
  const initial = product.title ? product.title.trim().charAt(0).toUpperCase() : "P";

  return (
    <div
      id={isStickyBar ? "product-sticky-bottom-bar" : `product-paper-${product.id}`}
      className={`items-center justify-between flex-col lg:flex-row gap-4 flex w-full ${className}`}
    >
      {/* Left side: Avatar Badge + Title & Stats */}
      <div className="flex items-center gap-3.5 min-w-0 pr-0 lg:pr-4 w-full lg:w-auto">
        {/* Circle Initials / Icon Badge matching screenshot */}
        <div className="w-9 h-9 rounded-full bg-neutral-900 dark:bg-black border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-xs">
          {initial}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-white tracking-tight truncate">
              {product.title}
            </h1>

            {/* Favorite button */}
            <button
              type="button"
              onClick={() => setIsFavorited(!isFavorited)}
              title={isFavorited ? "Remove from wishlist" : "Add to wishlist"}
              className="text-gray-400 dark:text-[#737373] hover:text-[#009f7f] transition-colors p-1 shrink-0 cursor-pointer"
            >
              {isFavorited ? (
                <HeartFillIcon className="h-4 w-4 text-rose-500" />
              ) : (
                <HeartOutlineIcon className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Sales count metadata */}
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-[#a8a8a8] mt-0.5">
            <div className="flex items-center gap-1.5 tracking-tight">
              <ShoppingCartIcon className="h-3.5 w-3.5 text-gray-400 dark:text-[#737373]" />
              <span>
                <strong className="text-gray-900 dark:text-white font-semibold">
                  {product.salesCount ? product.salesCount.toLocaleString() : "890"}
                </strong>{" "}
                Sales
              </span>
            </div>
            {product.downloadCount !== undefined && (
              <div className="hidden sm:flex items-center gap-1.5 tracking-tight">
                <DownloadIcon className="h-3.5 w-3.5 text-gray-400 dark:text-[#737373]" />
                <span>
                  <strong className="text-gray-900 dark:text-white font-semibold">{product.downloadCount.toLocaleString()}</strong> Downloads
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Exactly THREE buttons (Watch Ad, Buy Now with Price, Live Preview) */}
      <div className="flex items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-end flex-wrap sm:flex-nowrap shrink-0">
        {/* 1. Watch Ad ( 4 ) Button */}
        <button
          id={`paper-watch-ad-btn-${product.id}`}
          type="button"
          onClick={() => onWatchAd?.(product)}
          className="flex h-10 sm:h-11 items-center justify-center gap-1.5 rounded-md border border-gray-200 dark:border-[#383838] bg-white dark:bg-[#242424] hover:bg-gray-50 dark:hover:bg-[#2e2e2e] active:bg-gray-100 dark:active:bg-[#1a1a1a] px-3.5 sm:px-4 text-xs sm:text-sm font-medium text-gray-800 dark:text-white transition-colors cursor-pointer shadow-2xs flex-1 sm:flex-initial"
        >
          <Play className="h-3.5 w-3.5 fill-current text-gray-700 dark:text-white shrink-0" />
          <span className="whitespace-nowrap">Watch Ad ( 4 )</span>
        </button>

        {/* 2. Buy Now with Price Button */}
        <button
          id={`paper-add-to-cart-btn-${product.id}`}
          type="button"
          onClick={handleAdd}
          className={`flex h-10 sm:h-11 items-center justify-center gap-1.5 rounded-md bg-[#009f7f] hover:bg-[#008f72] active:bg-[#007a62] px-4 sm:px-5 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer shadow-sm flex-1 sm:flex-initial ${
            isAdded ? "bg-[#018066]" : ""
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 shrink-0" />
              <span className="whitespace-nowrap">
                {isFree ? "Download Free" : `Buy Now - ${displayPrice}`}
              </span>
            </>
          )}
        </button>

        {/* 3. Live Preview Button */}
        <button
          id={`paper-live-preview-btn-${product.id}`}
          type="button"
          onClick={handlePreview}
          className="flex h-10 sm:h-11 items-center justify-center gap-1.5 rounded-md border border-gray-200 dark:border-[#3e3e3e] bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-[#282828] active:bg-gray-100 dark:active:bg-[#1f1f1f] px-3.5 sm:px-4 text-xs sm:text-sm font-medium text-gray-800 dark:text-white transition-colors cursor-pointer shadow-2xs flex-1 sm:flex-initial"
        >
          <Eye className="h-4 w-4 text-gray-500 dark:text-[#a8a8a8] shrink-0" />
          <span className="whitespace-nowrap">Live Preview</span>
        </button>
      </div>
    </div>
  );
};

