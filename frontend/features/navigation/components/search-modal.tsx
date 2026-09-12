"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Eye, ArrowRight, Search as SearchIcon } from "lucide-react";
import { Product } from "@/features/products/types/product.types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.author.name.toLowerCase().includes(query.toLowerCase())
      )
    : products;

  return (
    <div
      id="search-page-overlay"
      className="fixed inset-0 z-50 bg-[#f3f4f6] dark:bg-[#181818] overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Search Input Header Bar */}
      <div className="sticky top-0 z-20 bg-[#f3f4f6] dark:bg-[#181818] border-b border-gray-200/80 dark:border-neutral-800/80 px-6 py-8 md:px-12 md:py-10 shadow-xs">
        <div className="max-w-6xl mx-auto relative flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              id="search-modal-page-input"
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type anything to search..."
              className="w-full bg-transparent text-gray-800 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 text-xl md:text-2xl font-light outline-none border-b-2 border-transparent focus:border-[#009f7f] transition-colors py-2"
            />
          </div>

          {/* Close X Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-gray-200/60 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main Results Grid Container */}
      <div className="max-w-6xl mx-auto px-6 py-8 md:px-12 md:py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <SearchIcon className="h-12 w-12 text-gray-300 dark:text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-200">
              No matching results found
            </h3>
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
              Try searching with different keywords or categories.
            </p>
          </div>
        ) : (
          <div
            id="search-results-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filtered.map((product) => {
              const isFree = product.price.toLowerCase().includes("free") || product.price === "$0.00";
              const authorLetter = product.author.name ? product.author.name.charAt(0).toUpperCase() : "A";
              
              return (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="group flex flex-col space-y-3 cursor-pointer"
                >
                  {/* Thumbnail Card */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-gray-900 border border-gray-200/80 dark:border-neutral-800 shadow-xs group-hover:shadow-md transition-all duration-300">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />

                    {/* Hover Overlay Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                      <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <Eye className="h-3.5 w-3.5 text-[#009f7f]" />
                        Preview
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full bg-[#009f7f] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Product Info Bar Below Thumbnail */}
                  <div className="flex items-center justify-between gap-3 px-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Author Avatar Badge */}
                      <div className="h-8 w-8 rounded-full bg-[#009f7f] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                        {product.author.avatar ? (
                          <img
                            src={product.author.avatar}
                            alt={product.author.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          authorLetter
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-neutral-100 truncate group-hover:text-[#009f7f] transition-colors">
                          {product.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                          {product.author.name}
                        </p>
                      </div>
                    </div>

                    {/* Price Pill */}
                    <div className="shrink-0 text-right">
                      {isFree ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider">
                          FREE
                        </span>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-[#009f7f] font-bold text-xs">
                            {product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-400 line-through mt-0.5">
                              {product.originalPrice}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

