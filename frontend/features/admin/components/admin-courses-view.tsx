"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAdmin } from "../context/admin-context";
import { Search, Plus, Trash2, GraduationCap, Video } from "lucide-react";

interface AdminCoursesViewProps {
  onNavigateAddCourse?: () => void;
}

export const AdminCoursesView: React.FC<AdminCoursesViewProps> = ({
  onNavigateAddCourse,
}) => {
  const { courses, deleteCourse } = useAdmin();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Header Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-neutral-100">
            Academy Courses
          </h1>
        </div>

        <div className="flex items-center gap-3 grow sm:grow-0 justify-end">
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Course Title"
              className="w-full h-10 rounded-md border border-gray-200 bg-gray-50/50 pl-9 pr-3 text-xs text-gray-900 outline-none transition-all focus:border-[#009f7f] focus:bg-white dark:border-neutral-700 dark:bg-[#181818] dark:text-neutral-100 dark:focus:border-[#009f7f]"
            />
          </div>

          <button
            type="button"
            onClick={onNavigateAddCourse}
            className="flex items-center gap-2 h-10 px-4 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Course</span>
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white dark:bg-[#212121] rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 dark:bg-neutral-800/60 text-gray-500 dark:text-neutral-400 font-semibold border-b border-gray-100 dark:border-neutral-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-5">Course Title</th>
                <th className="py-3.5 px-5">Instructor</th>
                <th className="py-3.5 px-5">Lessons & Duration</th>
                <th className="py-3.5 px-5">Price</th>
                <th className="py-3.5 px-5">Rating</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800 text-gray-700 dark:text-neutral-300">
              {filteredCourses.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200 dark:border-neutral-700">
                        <Image
                          src={c.image}
                          alt={c.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 dark:text-white line-clamp-1 max-w-xs">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-[#009f7f] font-medium">
                          {c.category} • {c.level}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-gray-900 dark:text-neutral-100">
                      {c.author?.name || "Jhon Doe"}
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {c.author?.bio || "Senior Lead Engineer"}
                    </div>
                  </td>
                  <td className="py-3.5 px-5 font-medium">
                    {c.durationFormatted || "12.5 Hours"}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-[#009f7f]">
                    {c.price}
                  </td>
                  <td className="py-3.5 px-5 font-bold text-amber-500">
                    ★ {(c.ratingScore || 5.0).toFixed(1)} ({c.reviewsCountFormatted || "1"})
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => deleteCourse(c.id)}
                      title="Delete Course"
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
