"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ShoppingCart } from "lucide-react";
import { Product } from "../types/product.types";
import { getProductUrl } from "../utils/product.utils";

interface ProductCardProps {
  product: Product;
  onPreview?: (product: Product) => void;
  onDetails?: (product: Product) => void;
  onAuthorClick?: (authorName: string) => void;
  onAddToCart?: (product: Product) => void;
  onWatchAd?: (product: Product) => void;
}

const AUTHOR_COLORS = [
  "bg-emerald-500 text-white",
  "bg-teal-500 text-white",
  "bg-amber-500 text-white",
  "bg-indigo-500 text-white",
  "bg-purple-500 text-white",
  "bg-blue-500 text-white",
  "bg-rose-500 text-white",
  "bg-cyan-500 text-white",
];

function getAuthorColorClass(name: string = ""): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AUTHOR_COLORS[Math.abs(hash) % AUTHOR_COLORS.length];
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPreview,
  onDetails,
  onAuthorClick,
  onAddToCart,
  onWatchAd,
}) => {
  const productUrl = getProductUrl(product.slug);
  const isFree = product.price?.toUpperCase() === "FREE" || Boolean(product.isFree);
  const displayPrice = isFree ? "$0.00" : product.price;
  const authorInitial = product.author?.name ? product.author.name.charAt(0).toUpperCase() : "P";
  const authorBg = getAuthorColorClass(product.author?.name || product.title);

  return (
    <div
      id={`product-card-${product.id}`}
      title={product.title}
      className="group box-border min-h-[auto] min-w-[auto] flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail with Hover Overlay (Clicking takes to detail page) */}
        <Link
          href={productUrl}
          className="relative aspect-[3/2] box-border flex justify-center w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-transparent cursor-pointer block shadow-xs group-hover:shadow-md transition-all duration-300"
        >
          <Image
            alt={product.title}
            src={product.image}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />

          {/* Hover action overlay with Details button */}
          <div className="absolute inset-0 items-center backdrop-blur-xs bg-black/50 box-border flex h-full justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-full z-10 p-4">
            <div
              id={`product-details-btn-${product.id}`}
              className="text-white text-xs font-medium bg-transparent flex flex-col items-center leading-4 text-center p-0 cursor-pointer group/btn"
            >
              <div className="items-center backdrop-blur-sm bg-zinc-600/80 box-border flex h-10 justify-center w-10 mb-1.5 rounded-full transition-colors group-hover/btn:bg-[#009f7f] shadow-md">
                <img
                  src="https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-18.svg"
                  alt="View Details"
                  className="box-border h-4 w-4"
                />
              </div>
              <span className="font-semibold text-[11px]">Details</span>
            </div>
          </div>
        </Link>

        {/* Product metadata row matching Pixer official design */}
        <div className="box-border flex items-center justify-between gap-2.5 pt-3">
          {/* Author avatar and title/author info */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {/* Author Avatar circle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (product.author?.name) onAuthorClick?.(product.author.name);
              }}
              title={product.author?.name || "Author"}
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-xs ${authorBg} cursor-pointer hover:opacity-90 transition-opacity`}
            >
              {authorInitial}
            </button>

            {/* Title & Author */}
            <div className="flex flex-col min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white text-[13px] leading-tight truncate">
                <Link
                  href={productUrl}
                  className="hover:text-[#009f7f] dark:hover:text-emerald-400 transition-colors block truncate"
                >
                  {product.title}
                </Link>
              </h3>
              <p
                onClick={() => {
                  if (product.author?.name) onAuthorClick?.(product.author.name);
                }}
                className="text-[11px] text-gray-500 dark:text-zinc-400 truncate hover:text-[#009f7f] dark:hover:text-emerald-400 transition-colors cursor-pointer mt-0.5"
              >
                {product.author?.name || "Pixer Studio"}
              </p>
            </div>
          </div>

          {/* Price badge & Discount column */}
          <div className="flex flex-col items-end shrink-0 pl-1">
            <span className="text-[#009f7f] dark:text-[#00c49f] font-bold text-sm leading-tight">
              {displayPrice}
            </span>
            {product.originalPrice && !isFree && (
              <span className="text-[11px] text-gray-400 dark:text-zinc-500 line-through leading-tight mt-0.5">
                {product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Row: Watch Ad & Buy Now matching screenshot */}
      <div className="flex items-center gap-2 mt-3 w-full">
        <button
          id={`product-btn-watch-ad-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWatchAd?.(product);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md bg-white dark:bg-[#242424] hover:bg-gray-50 dark:hover:bg-[#2d2d2d] active:bg-gray-100 dark:active:bg-[#1f1f1f] border border-gray-200 dark:border-[#383838] text-gray-700 dark:text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
        >
          <Play className="w-3.5 h-3.5 fill-current text-gray-700 dark:text-white shrink-0" />
          <span className="truncate">Watch Ad ( 4 )</span>
        </button>

        <button
          id={`product-btn-buy-now-${product.id}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(product);
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-md bg-[#009f7f] hover:bg-[#008f72] active:bg-[#007a62] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Buy Now {displayPrice}</span>
        </button>
      </div>
    </div>
  );
};
