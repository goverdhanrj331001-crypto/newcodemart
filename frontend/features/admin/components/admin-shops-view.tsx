"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdmin } from "../context/admin-context";
import { Search, Store, CheckCircle2, XCircle } from "lucide-react";

export const AdminShopsView: React.FC = () => {
  const { shops } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShops = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
            Marketplace Shops & Vendors
          </h1>
        </div>

        <div className="relative min-w-[200px] sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Shop or Vendor"
            className="w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-xs text-gray-900 outline-none transition-all focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:focus:border-[#009f7f]"
          />
        </div>
      </div>

      {/* Grid of Shops */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShops.map((shop) => (
          <div
            key={shop.id}
            className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-100 border border-gray-200 dark:border-neutral-700 shrink-0">
                <Image
                  src={shop.logo}
                  alt={shop.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">
                  {shop.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-neutral-400">
                  Owner: {shop.ownerName}
                </span>
                <div className="text-[11px] text-[#009f7f] font-semibold mt-0.5">
                  {shop.productsCount} Products Listed
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-600 dark:text-neutral-300 line-clamp-2">
              Owner: <strong className="text-gray-800 dark:text-neutral-200">{shop.ownerName}</strong> ({shop.ownerEmail})
            </p>

            <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  shop.status === "Active"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                }`}
              >
                {shop.status === "Active" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {shop.status}
              </span>

              <span className="text-gray-400 text-[11px]">
                ${shop.revenue.toLocaleString()} Revenue
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
