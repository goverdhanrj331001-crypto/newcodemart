"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Home,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Clock,
  Signal,
  Globe,
  Award,
  Play,
  Check,
  CheckCircle2,
  ShoppingCart,
  Heart,
  FileText,
  Infinity as InfinityIcon,
  Tv,
  ArrowRight,
  X,
  Sparkles,
  Code2,
  Layers,
  Cpu,
  Palette,
  Terminal,
  FolderGit2,
} from "lucide-react";
import { CourseDetailItem, POPULAR_COURSES } from "../data/courses.data";

interface CourseDetailsViewProps {
  course: CourseDetailItem;
  onBack?: () => void;
  onSelectRelatedCourse?: (course: CourseDetailItem) => void;
  onAddToCart?: (course: CourseDetailItem) => void;
}

export const CourseDetailsView: React.FC<CourseDetailsViewProps> = ({
  course,
  onBack,
  onSelectRelatedCourse,
  onAddToCart,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructors" | "reviews">("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const handleExpandAll = () => {
    if (expandedSections.length === 4) {
      setExpandedSections([]);
    } else {
      setExpandedSections([1, 2, 3, 4]);
    }
  };

  // Find related courses from POPULAR_COURSES
  const relatedCoursesList = POPULAR_COURSES.filter((c) => c.id !== course.id).slice(0, 2);

  const courseRating = course.rating ?? course.ratingScore ?? 4.8;
  const reviewsCount = course.reviewsCountFormatted || "12.4k";
  const studentsCount = (course.salesCount ? course.salesCount.toLocaleString() : "42,680") + " students";
  const duration = course.durationFormatted || "12h 30m";
  const level = course.level || "Beginner";

  // Calculate discount percentage if original price exists
  const numericPrice = parseFloat(course.price.replace(/[^0-9.]/g, "")) || 49;
  const numericOriginal = parseFloat((course.originalPrice || "$99.00").replace(/[^0-9.]/g, "")) || 99;
  const discountPercent = Math.round(((numericOriginal - numericPrice) / numericOriginal) * 100);

  const curriculumSections = [
    {
      id: 1,
      title: "1. Getting Started",
      lecturesCount: 4,
      duration: "45m",
      lessons: [
        { title: "1.1 Introduction to the Course", duration: "12:34", isFree: true },
        { title: "1.2 Setting Up Your Development Environment", duration: "18:20", isFree: false },
        { title: "1.3 JavaScript Refresher & Modern Syntax", duration: "10:12", isFree: false },
        { title: "1.4 Project Architecture & Overview", duration: "4:56", isFree: false },
      ],
    },
    {
      id: 2,
      title: "2. React Core Concepts & Hooks Mastery",
      lecturesCount: 8,
      duration: "2h 15m",
      lessons: [
        { title: "2.1 JSX, Virtual DOM & Component Architecture", duration: "22:15", isFree: false },
        { title: "2.2 State Management with useState & useReducer", duration: "19:40", isFree: false },
        { title: "2.3 Lifecycle & Side Effects with useEffect", duration: "24:10", isFree: false },
        { title: "2.4 Custom Hooks & Reusability Patterns", duration: "28:30", isFree: false },
      ],
    },
    {
      id: 3,
      title: "3. Next.js 15 App Router & Server Components",
      lecturesCount: 10,
      duration: "3h 10m",
      lessons: [
        { title: "3.1 Server Components vs Client Components", duration: "25:00", isFree: false },
        { title: "3.2 Dynamic Routes, Layouts & Route Groups", duration: "21:15", isFree: false },
        { title: "3.3 Server Actions & Form Mutations", duration: "27:45", isFree: false },
        { title: "3.4 SEO Optimization, Metadata & OpenGraph", duration: "18:30", isFree: false },
      ],
    },
    {
      id: 4,
      title: "4. Full-Stack Project: Production Build & Deploy",
      lecturesCount: 14,
      duration: "4h 30m",
      lessons: [
        { title: "4.1 PostgreSQL Database Design & Prisma ORM", duration: "32:10", isFree: false },
        { title: "4.2 User Authentication & Role Permissions", duration: "28:40", isFree: false },
        { title: "4.3 Stripe Payment Gateway & Webhook Verification", duration: "38:45", isFree: false },
        { title: "4.4 Containerization with Docker & Cloud Deployment", duration: "30:20", isFree: false },
      ],
    },
  ];

  const whatYouWillLearnCards = [
    {
      icon: <Code2 className="w-5 h-5 text-amber-500" />,
      bg: "bg-amber-500/10 border-amber-500/20",
      title: "JavaScript Fundamentals",
      desc: "ES6+, modern syntax, async/await",
    },
    {
      icon: <Cpu className="w-5 h-5 text-cyan-500" />,
      bg: "bg-cyan-500/10 border-cyan-500/20",
      title: "React.js",
      desc: "Components, hooks, state management",
    },
    {
      icon: <Terminal className="w-5 h-5 text-slate-800 dark:text-slate-200" />,
      bg: "bg-slate-500/10 border-slate-500/20",
      title: "Next.js",
      desc: "Routing, SSR, API routes, deployment",
    },
    {
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-500/10 border-blue-500/20",
      title: "TypeScript",
      desc: "Type safety and modern development",
    },
    {
      icon: <Palette className="w-5 h-5 text-teal-500" />,
      bg: "bg-teal-500/10 border-teal-500/20",
      title: "Tailwind CSS",
      desc: "Build beautiful responsive UI",
    },
    {
      icon: <FolderGit2 className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-500/10 border-emerald-500/20",
      title: "Full Stack Project",
      desc: "Build a complete web application",
    },
  ];

  const handleEnrollClick = () => {
    setIsEnrolled(true);
    if (onAddToCart) {
      onAddToCart(course);
    }
  };

  return (
    <div
      id="course-details-page-root"
      className="w-full bg-[#f8fafc] text-slate-900 min-h-screen px-4 sm:px-6 lg:px-8 py-6 transition-colors"
    >
      {/* Breadcrumb Navigation - Exactly matching user screenshot */}
      <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-6 flex-wrap">
        <button
          type="button"
          onClick={onBack}
          className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          title="Home"
        >
          <Home className="w-4 h-4" />
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          type="button"
          onClick={onBack}
          className="hover:text-slate-900 transition-colors cursor-pointer font-medium"
        >
          Courses
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-800 font-medium truncate max-w-sm sm:max-w-md md:max-w-lg">
          {course.title}
        </span>
      </div>

      {/* Main Grid: Left Content (Col 8) + Right Sticky Sidebar (Col 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Top Hero Section Card matching image */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Hero Video Preview Thumbnail on Left */}
              <div className="md:col-span-5 relative rounded-xl overflow-hidden shadow-md group aspect-[4/3] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-between p-4 border border-slate-800">
                {/* Bestseller Badge */}
                <div className="flex items-center justify-between z-10">
                  <span className="bg-indigo-600 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow">
                    {course.badgeTag || "Bestseller"}
                  </span>
                </div>

                {/* Central Visual Graphics (React / Next.js / Code) */}
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  {/* Laptop Code illustration background */}
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute inset-0 bg-cover bg-center opacity-40 rounded-lg filter brightness-75" style={{ backgroundImage: `url(${course.image})` }} />
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-cyan-400 font-bold text-xs">⚛️ React</span>
                        <span className="text-white font-bold text-xs">NEXT.JS</span>
                      </div>
                      <p className="text-[10px] text-slate-300 max-w-[170px] text-center font-medium leading-tight">
                        Build Modern Web Applications with React & Next.js
                      </p>
                    </div>
                  </div>

                  {/* Play Button Overlay in center */}
                  <button
                    type="button"
                    onClick={() => setIsVideoModalOpen(true)}
                    className="absolute z-20 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-2xl hover:scale-110 hover:bg-emerald-600 transition-all cursor-pointer group-hover:border-white"
                    title="Watch Course Preview"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5 text-white" />
                  </button>
                </div>

                {/* Bottom Tech Logos */}
                <div className="relative z-10 flex items-center gap-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono font-medium">⚛️ React</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white font-mono font-medium">NEXT</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/80 text-white font-mono font-medium">TS</span>
                </div>
              </div>

              {/* Course Title & Metadata on Right */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                    {course.title}
                  </h1>
                  <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                    {course.description ||
                      "Learn React and Next.js from scratch and build modern, real-world web applications with a complete full-stack project."}
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-600 mt-4 flex-wrap">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span>{studentsCount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{duration}</span>
                    </div>
                  </div>

                  {/* Badges Row */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap text-xs">
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      <Signal className="w-3.5 h-3.5 text-slate-500" />
                      <span>{level}</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>English</span>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span>Certificate of Completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (Overview, Curriculum) */}
          <div className="border-b border-slate-200 flex items-center gap-8 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("curriculum")}
              className={`pb-3 border-b-2 transition-colors cursor-pointer ${
                activeTab === "curriculum"
                  ? "border-emerald-600 text-emerald-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Curriculum
            </button>
          </div>

          {/* TAB 1: OVERVIEW CONTENT */}
          {(activeTab === "overview" || activeTab === "curriculum") && (
            <div className="space-y-8">
              {/* About This Course Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
                  About This Course
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                  {course.description ||
                    "This course will take you from basic JavaScript to advanced React and Next.js, helping you build modern, fast and scalable web applications. You'll learn real-world concepts, work on practical projects and gain the skills needed to become a professional full-stack developer."}
                </p>

                {/* Key Bullet Points */}
                <div className="space-y-3">
                  {(course.features && course.features.length > 0
                    ? course.features
                    : [
                        "Learn React, Next.js, TypeScript and modern tools",
                        "Build 3+ real world projects (portfolio, blog, e-commerce)",
                        "Get hands-on with API integration, database and deployment",
                        "Lifetime access to course materials and updates",
                      ]
                  ).map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-bold" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What You'll Learn Grid (3x2 on desktop) */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                  What You&apos;ll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {whatYouWillLearnCards.map((item, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 hover:border-slate-300 transition-colors"
                    >
                      <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mb-3`}>
                        {item.icon}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Curriculum Accordion */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Course Curriculum
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      12 sections • 45 lectures • {duration} total length
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExpandAll}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {expandedSections.length === 4 ? "Collapse All" : "Expand All"}
                  </button>
                </div>

                {/* Sections List */}
                <div className="space-y-3">
                  {curriculumSections.map((sec) => {
                    const isExpanded = expandedSections.includes(sec.id);
                    return (
                      <div
                        key={sec.id}
                        className="rounded-xl border border-slate-200 overflow-hidden transition-all bg-white"
                      >
                        {/* Section Header */}
                        <button
                          type="button"
                          onClick={() => toggleSection(sec.id)}
                          className="w-full bg-slate-50 hover:bg-slate-100/80 px-4 py-3.5 flex items-center justify-between text-left transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                            )}
                            <span className="text-sm font-semibold text-slate-900">
                              {sec.title}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-medium">
                            {sec.lecturesCount} lectures • {sec.duration}
                          </span>
                        </button>

                        {/* Section Lessons */}
                        {isExpanded && (
                          <div className="divide-y divide-slate-100 bg-white px-2">
                            {sec.lessons.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-lg text-xs sm:text-sm text-slate-700 transition-colors"
                              >
                                <div className="flex items-center gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => setIsVideoModalOpen(true)}
                                    className="w-6 h-6 rounded-full bg-slate-100 hover:bg-emerald-100 flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
                                  >
                                    <Play className="w-3 h-3 fill-current ml-0.5" />
                                  </button>
                                  <span className="font-normal text-slate-800">
                                    {lesson.title}
                                  </span>
                                  {lesson.isFree && (
                                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                      Preview
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-slate-400 font-mono">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Sidebar Column (Cards 1 to 3) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Card 1: Pricing & Action Buttons */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            {/* Price Line */}
            <div className="flex items-baseline gap-2.5 mb-5">
              <span className="text-3xl font-bold text-slate-900">
                {course.price}
              </span>
              <span className="text-base text-slate-400 line-through font-medium">
                {course.originalPrice || "$99.00"}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Enroll CTA Button */}
            <button
              type="button"
              id="course-enroll-now-btn"
              onClick={handleEnrollClick}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer mb-3"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isEnrolled ? "✓ Enrolled (Added to Cart)" : "Enroll Now"}</span>
            </button>

            {/* Add to Wishlist Button */}
            <button
              type="button"
              onClick={() => setIsWishlisted((prev) => !prev)}
              className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer mb-4"
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? "fill-rose-500 text-rose-500" : "text-slate-500"
                }`}
              />
              <span>{isWishlisted ? "Saved in Wishlist" : "Add to Wishlist"}</span>
            </button>

            {/* Guarantee note */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>30-Day Money Back Guarantee</span>
            </div>
          </div>

          {/* Card 2: Course Features */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Course Features
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{duration} On-demand video</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                <span>15+ downloadable resources</span>
              </div>
              <div className="flex items-center gap-3">
                <InfinityIcon className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Lifetime access</span>
              </div>
              <div className="flex items-center gap-3">
                <Tv className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Access on mobile and TV</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>

          {/* Card 3: Related Courses */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Related Courses
              </h3>
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-3.5">
              {relatedCoursesList.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelatedCourse?.(rel)}
                  className="flex items-start gap-3 group cursor-pointer p-1.5 -mx-1.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
                    <Image
                      src={rel.image}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                      {rel.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-0.5 font-medium text-slate-700">
                        ⭐ {rel.rating ?? rel.ratingScore ?? 4.8}
                      </span>
                      <span>•</span>
                      <span>⏱ {rel.durationFormatted || "8h 30m"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      <span className="font-bold text-slate-900">{rel.price}</span>
                      {rel.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {rel.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-3xl bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold truncate">{course.title} — Course Preview</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Box */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/SqcY0GlETPk?autoplay=1&mute=0"
                title={course.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
              <span>Includes 12h 30m HD video, exercises, full source code and community Discord.</span>
              <button
                type="button"
                onClick={() => {
                  setIsVideoModalOpen(false);
                  handleEnrollClick();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Enroll Now ({course.price})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
