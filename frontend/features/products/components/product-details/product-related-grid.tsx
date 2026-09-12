"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "../../types/product.types";
import { getProductUrl } from "../../utils/product.utils";

interface ProductRelatedGridProps {
  products: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductRelatedGrid: React.FC<ProductRelatedGridProps> = ({
  products,
  onSelectProduct,
}) => {
  if (!products || products.length === 0) return null;

  return (
    <div id="related-products-section" className="pt-10 border-t border-gray-200 dark:border-[#333333]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Related Products</h3>
          <p className="text-xs text-gray-500 dark:text-[#a8a8a8]">Other digital assets you might find helpful</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((item) => (
          <div
            key={`related-${item.id}`}
            className="group flex flex-col rounded-xl bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] overflow-hidden hover:border-gray-300 dark:hover:border-[#3e3e3e] shadow-2xs hover:shadow-md transition-all duration-200"
          >
            {/* Thumbnail */}
            <Link
              href={getProductUrl(item.slug)}
              onClick={() => onSelectProduct?.(item)}
              className="relative aspect-[3/2] w-full bg-gray-100 dark:bg-[#181818] overflow-hidden block"
            >
              <Image
                alt={item.title}
                src={item.image}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </Link>

            {/* Content */}
            <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="relative h-6 w-6 shrink-0 rounded-full overflow-hidden border border-gray-200 dark:border-neutral-700">
                  <Image
                    alt={item.author.name}
                    src={item.author.avatar}
                    fill
                    sizes="24px"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={getProductUrl(item.slug)}
                    onClick={() => onSelectProduct?.(item)}
                    className="block text-xs font-semibold text-gray-900 dark:text-white hover:text-emerald-500 transition-colors truncate"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                  <span className="block text-[11px] text-gray-500 dark:text-zinc-500 truncate">
                    {item.author.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-neutral-800/60 text-xs">
                <span className="text-[#009f7f] dark:text-emerald-400 font-bold text-[12px]">
                  {item.price}
                </span>
                <Link
                  href={getProductUrl(item.slug)}
                  onClick={() => onSelectProduct?.(item)}
                  className="text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors text-[11px] font-medium"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
