"use client";

import React, { useState } from "react";
import { useAdmin } from "../context/admin-context";
import { Search, Star, Trash2, MessageSquare } from "lucide-react";

export const AdminReviewsView: React.FC = () => {
  const { reviews } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = reviews.filter(
    (r) =>
      r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
            Reviews & Ratings
          </h1>
        </div>

        <div className="relative min-w-[200px] sm:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Reviews..."
            className="w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-xs text-gray-900 outline-none transition-all focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:focus:border-[#009f7f]"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-neutral-800/60 text-gray-500 dark:text-neutral-400 font-semibold border-b border-gray-100 dark:border-neutral-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Product / Course</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5">Review Comment</th>
                <th className="py-3.5 px-5">Date</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300">
              {filteredReviews.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                        {r.userName.substring(0, 1)}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {r.userName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-[#009f7f] line-clamp-1 max-w-xs">
                    {r.productTitle}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-4 w-4 fill-amber-400" />
                      <span>{r.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-gray-600 dark:text-neutral-300 max-w-sm italic">
                    &quot;{r.comment}&quot;
                  </td>
                  <td className="py-3.5 px-5 text-gray-400">{r.date}</td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      title="Delete Review"
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
