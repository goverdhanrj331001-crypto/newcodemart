"use client";

import React, { useState } from "react";
import { useAdmin } from "../context/admin-context";
import { Search, Plus, Trash2, LayoutGrid, FolderTree } from "lucide-react";

interface AdminCategoriesViewProps {
  onNavigateAddCategory?: () => void;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  onNavigateAddCategory,
}) => {
  const { categories, deleteCategory } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            Categories
          </h1>
        </div>

        <div className="flex items-center gap-3 grow sm:grow-0 justify-end">
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Category"
              className="w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-sm text-gray-900 outline-none transition-all focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:focus:border-[#009f7f]"
            />
          </div>

          <button
            type="button"
            onClick={onNavigateAddCategory}
            className="flex items-center gap-2 h-10 px-4 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-sm font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Category</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 dark:bg-neutral-800/60 text-gray-500 dark:text-neutral-400 font-bold border-b border-gray-100 dark:border-neutral-800 uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Category Name</th>
                <th className="py-3.5 px-5">Slug</th>
                <th className="py-3.5 px-5">Products Count</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300">
              {filteredCategories.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-3.5 px-5 font-semibold text-gray-500 dark:text-neutral-400">
                    #{c.id.replace("tech-", "").replace("project-", "")}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#009f7f]/10 text-[#009f7f] flex items-center justify-center font-bold text-sm shrink-0">
                        {c.monogram || <FolderTree className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white text-sm">
                          {c.name}
                        </div>
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-md">
                          {c.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-gray-500 dark:text-neutral-400 text-xs">
                    {c.slug}
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#009f7f]">
                    {c.count || `${c.productCount || 10} Products`}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => deleteCategory(c.id)}
                      title="Delete Category"
                      className="p-1.5 rounded-md hover:bg-rose-50 text-gray-400 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
