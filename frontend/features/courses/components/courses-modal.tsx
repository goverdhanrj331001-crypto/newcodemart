"use client";

import React, { useState } from "react";
import { X, Play, Clock, BookOpen, Star, CheckCircle, ExternalLink } from "lucide-react";

interface CoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  lessons: number;
  duration: string;
  rating: number;
  reviewsCount: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  badge?: string;
  thumbnail: string;
  description: string;
  category: string;
}

const COURSES: Course[] = [
  {
    id: "course-1",
    title: "Full-Stack Next.js 15 & Tailwind Architecture",
    instructor: "Alex Chen",
    instructorAvatar: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/135.jpg",
    lessons: 48,
    duration: "16 hours",
    rating: 4.9,
    reviewsCount: 1280,
    level: "Intermediate",
    badge: "Bestseller",
    thumbnail: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg",
    description: "Master modern server components, streaming SSR, dynamic routing, and scalable component architecture with real projects.",
    category: "React & Next.js",
  },
  {
    id: "course-2",
    title: "Flutter 3.x Multi-Platform Mobile Mastery",
    instructor: "Rachel Leonard",
    instructorAvatar: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/157.jpg",
    lessons: 54,
    duration: "19 hours",
    rating: 5.0,
    reviewsCount: 890,
    level: "Beginner",
    badge: "Hot",
    thumbnail: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/34.jpg",
    description: "Build clean, pixel-perfect iOS & Android mobile apps using BLoC state management and REST APIs.",
    category: "Mobile App",
  },
  {
    id: "course-3",
    title: "Laravel 11 Enterprise REST APIs & Microservices",
    instructor: "David Miller",
    instructorAvatar: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/109.jpg",
    lessons: 38,
    duration: "12 hours",
    rating: 4.8,
    reviewsCount: 640,
    level: "Advanced",
    badge: "Updated",
    thumbnail: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/146.jpg",
    description: "Learn enterprise database optimization, JWT authentication, queue workers, and automated test pipelines.",
    category: "Backend",
  },
  {
    id: "course-4",
    title: "Figma to Code: Building Tokenized Design Systems",
    instructor: "Sophia Vance",
    instructorAvatar: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/41.jpg",
    lessons: 32,
    duration: "10 hours",
    rating: 4.9,
    reviewsCount: 520,
    level: "Beginner",
    thumbnail: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/71.jpg",
    description: "Translate high-fidelity Figma components into Tailwind CSS tokens and accessible React component libraries.",
    category: "UI/UX Design",
  },
];

export const CoursesModal: React.FC<CoursesModalProps> = ({ isOpen, onClose }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEnroll = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      setToastMessage("Successfully enrolled in course! Check your library.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div
      id="courses-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="courses-modal-card"
        className="bg-[#1c1c1c] border border-[#333333] w-full max-w-4xl rounded-2xl p-5 sm:p-7 text-white shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2e2e2e]">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Pixer Academy
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">Developer Courses &amp; Guides</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-[#262626] hover:bg-[#333333] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {toastMessage && (
          <div className="mt-3 p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Courses Grid */}
        <div className="overflow-y-auto grow py-4 grid grid-cols-1 md:grid-cols-2 gap-4 no-scrollbar">
          {COURSES.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            return (
              <div
                key={course.id}
                className="bg-[#242424] hover:bg-[#2a2a2a] border border-[#333] hover:border-[#444] rounded-xl overflow-hidden flex flex-col transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-neutral-800">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {course.badge && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-white shadow-md">
                      {course.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/75 text-[10px] text-white flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {course.duration}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col grow">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
                    <span>{course.category}</span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {course.rating} ({course.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
                    {course.title}
                  </h3>

                  <p className="text-xs text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#333]">
                    <div className="flex items-center gap-2">
                      <img
                        src={course.instructorAvatar}
                        alt={course.instructor}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs text-neutral-300">{course.instructor}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleEnroll(course.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isEnrolled
                          ? "bg-emerald-600/30 text-emerald-400 border border-emerald-500/50"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                      }`}
                    >
                      {isEnrolled ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          Enrolled
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          Start Course
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#2e2e2e] flex items-center justify-between text-xs text-neutral-400">
          <span>All courses include project source code &amp; lifetime updates.</span>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
