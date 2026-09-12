"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdmin } from "../context/admin-context";
import { Search, Plus, Filter, MoreVertical, Trash2, Edit3, ExternalLink, PackageSearch } from "lucide-react";

interface AdminProductsViewProps {
  onNavigateAddProduct?: () => void;
}

export const AdminProductsView: React.FC<AdminProductsViewProps> = ({
  onNavigateAddProduct,
}) => {
  const { products, deleteProduct } = useAdmin();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLayoutFilter, setSelectedLayoutFilter] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesName =
      !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategoryFilter ||
      p.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
    const matchesLayout =
      !selectedLayoutFilter ||
      (p.specifications?.layoutType &&
        p.specifications.layoutType.toLowerCase().includes(selectedLayoutFilter.toLowerCase()));
    return matchesName && matchesCategory && matchesLayout;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Top Filter Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 space-y-5">
        {/* Title & Main Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
              Products
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 grow sm:grow-0 justify-end">
            {/* Search Input */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Name"
                className="w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:focus:border-[#009f7f]"
              />
            </div>

            {/* + Add Product Button (Navigates in full page right area, NO POPUP!) */}
            <button
              type="button"
              onClick={onNavigateAddProduct}
              className="flex items-center gap-2 h-10 px-4 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-sm font-bold transition-all shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>+ Add Product</span>
            </button>

            {/* Filter Toggle Button */}
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-1.5 h-10 px-3.5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#262626] text-sm font-semibold text-gray-700 dark:text-neutral-300 hover:border-[#009f7f] transition-all cursor-pointer"
            >
              <span>Filter</span>
              <Filter className="h-4 w-4 text-gray-500" />
            </button>

            {/* 3 Dots Action */}
            <button
              type="button"
              className="flex items-center justify-center h-10 w-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#262626] text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-gray-100 dark:border-neutral-800">
            {/* Filter By Layout */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">
                Filter By Layout
              </label>
              <select
                value={selectedLayoutFilter}
                onChange={(e) => setSelectedLayoutFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#009f7f] dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-200 cursor-pointer"
              >
                <option value="">Filter by Layout</option>
                <option value="Digital Product">Digital Product</option>
                <option value="Course">Course</option>
                <option value="Physical">Physical</option>
                <option value="Script">Script</option>
                <option value="Theme">Theme</option>
              </select>
            </div>

            {/* Filter By Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">
                Filter By Category
              </label>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#009f7f] dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-200 cursor-pointer"
              >
                <option value="">Filter by Category</option>
                <option value="React">React</option>
                <option value="Next.js">Next.js</option>
                <option value="Flutter">Flutter</option>
                <option value="Laravel">Laravel</option>
                <option value="WordPress">WordPress</option>
                <option value="Mobile App">Mobile App</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Admin & Dashboards">Admin & Dashboards</option>
              </select>
            </div>

            {/* Filter by Product Type */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 dark:text-neutral-400 uppercase">
                Filter by Product Type
              </label>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none focus:border-[#009f7f] dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-200 cursor-pointer"
              >
                <option value="">Filter by product type</option>
                <option value="Digital">Digital Asset</option>
                <option value="Simple">Simple Product</option>
                <option value="External">External Link</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          /* Empty State matching Image 3 */
          <div className="py-16 px-4 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-gray-400 dark:text-neutral-500">
              <PackageSearch className="h-10 w-10" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-neutral-200">
              No data found
            </h3>
            <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm">
              Sorry we couldn&apos;t found any data matching your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 dark:bg-neutral-800/60 text-gray-500 dark:text-neutral-400 font-bold border-b border-gray-100 dark:border-neutral-800 uppercase tracking-wider text-xs">
                <tr>
                  <th className="py-3.5 px-5">ID</th>
                  <th className="py-3.5 px-5">Product</th>
                  <th className="py-3.5 px-5">Product Type</th>
                  <th className="py-3.5 px-5">Price/Unit</th>
                  <th className="py-3.5 px-5">Quantity</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300">
                {filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-semibold text-gray-500 dark:text-neutral-400">
                      #{p.id.replace("prod-", "").replace("p", "")}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-12 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200 dark:border-neutral-700">
                          <Image
                            src={p.image}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-[#181818] dark:text-white line-clamp-1 max-w-xs text-sm">
                            {p.title}
                          </div>
                          <div className="text-xs text-[#009f7f] font-semibold">
                            {p.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block px-2.5 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300 font-medium text-xs">
                        {p.specifications?.layoutType || "Digital"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#009f7f]">
                      {p.price} <span className="text-xs font-normal text-gray-400">(1 License)</span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold">
                      {p.salesCount ?? 12}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                        Published
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/products/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View on storefront"
                          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 hover:text-gray-900 dark:text-neutral-400 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          title="Delete Product"
                          className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
