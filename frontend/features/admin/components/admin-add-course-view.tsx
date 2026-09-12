"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useAdmin } from "../context/admin-context";
import {
  Upload,
  CheckCircle2,
  Video,
  Plus,
  Trash2,
  Code2,
  Cpu,
  Terminal,
  Layers,
  Palette,
  FolderGit2,
  Play,
  Check,
  Award,
  Clock,
  Globe,
  Signal,
  Users,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Infinity as InfinityIcon,
  Tv,
} from "lucide-react";

interface AdminAddCourseViewProps {
  onSuccess?: () => void;
}

interface WhatYouWillLearnItem {
  id: string;
  title: string;
  desc: string;
  iconTag: string;
}

interface LessonItem {
  id: string;
  title: string;
  duration: string;
  isFree: boolean;
}

interface SectionItem {
  id: string;
  title: string;
  lessons: LessonItem[];
}

export const AdminAddCourseView: React.FC<AdminAddCourseViewProps> = ({
  onSuccess,
}) => {
  const { addCourse } = useAdmin();

  // 1. Basic & Header Banner Info
  const [title, setTitle] = useState("React JS & Next.js – Full Stack Web Development");
  const [subtitle, setSubtitle] = useState("Master React 19 and Next.js 15 from scratch. Learn App Router, Server Components, Server Actions, and full-stack deployment.");
  const [category, setCategory] = useState("Web Development");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "All Levels" | "Advanced">("Beginner");
  const [language, setLanguage] = useState("English");
  const [badgeTag, setBadgeTag] = useState("Bestseller");
  const [studentsCount, setStudentsCount] = useState("12,400");
  const [durationFormatted, setDurationFormatted] = useState("12h 30m");
  
  // Pricing
  const [price, setPrice] = useState("49.00");
  const [originalPrice, setOriginalPrice] = useState("149.00");

  // Media
  const [coverImage, setCoverImage] = useState("https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/16.jpg");
  const [imageFileName, setImageFileName] = useState("");
  const [previewVideoUrl, setPreviewVideoUrl] = useState("https://www.youtube-nocookie.com/embed/SqcY0GlETPk");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 2. About & Key Highlights
  const [aboutDescription, setAboutDescription] = useState("This course will take you from basic JavaScript to advanced React and Next.js, helping you build modern, fast and scalable web applications. You'll learn real-world concepts, work on practical projects and gain the skills needed to become a professional full-stack developer.");
  const [highlights, setHighlights] = useState<string[]>([
    "Next.js 15 App Router deep dive & Server Components",
    "Full stack authentication with NextAuth & JWT",
    "Tailwind CSS v4 modern layout architectures",
    "Real-world production deployment on Cloud Run",
  ]);
  const [newHighlightText, setNewHighlightText] = useState("");

  // 3. Course Features Sidebar Settings
  const [downloadableResources, setDownloadableResources] = useState("15+ downloadable resources");
  const [lifetimeAccess, setLifetimeAccess] = useState(true);
  const [mobileTvAccess, setMobileTvAccess] = useState(true);
  const [certificateOfCompletion, setCertificateOfCompletion] = useState(true);

  // 4. What You'll Learn Cards Grid
  const [learnCards, setLearnCards] = useState<WhatYouWillLearnItem[]>([
    { id: "1", title: "JavaScript Fundamentals", desc: "ES6+, modern syntax, async/await", iconTag: "Code2" },
    { id: "2", title: "React.js", desc: "Components, hooks, state management", iconTag: "Cpu" },
    { id: "3", title: "Next.js", desc: "Routing, SSR, API routes, deployment", iconTag: "Terminal" },
    { id: "4", title: "TypeScript", desc: "Type safety and modern development", iconTag: "Layers" },
    { id: "5", title: "Tailwind CSS", desc: "Build beautiful responsive UI", iconTag: "Palette" },
    { id: "6", title: "Full Stack Project", desc: "Build a complete web application", iconTag: "FolderGit2" },
  ]);

  // 5. Course Curriculum & Lessons
  const [sections, setSections] = useState<SectionItem[]>([
    {
      id: "sec-1",
      title: "1. Getting Started",
      lessons: [
        { id: "l-1", title: "1.1 Introduction to the Course", duration: "12:34", isFree: true },
        { id: "l-2", title: "1.2 Setting Up Your Development Environment", duration: "18:20", isFree: false },
        { id: "l-3", title: "1.3 JavaScript Refresher & Modern Syntax", duration: "10:12", isFree: false },
      ],
    },
    {
      id: "sec-2",
      title: "2. React Core Concepts & Hooks Mastery",
      lessons: [
        { id: "l-4", title: "2.1 JSX, Virtual DOM & Component Architecture", duration: "22:15", isFree: false },
        { id: "l-5", title: "2.2 State Management with useState & useReducer", duration: "19:40", isFree: false },
      ],
    },
  ]);

  // 6. Instructor Info
  const [instructorName, setInstructorName] = useState("Alex Chen");
  const [instructorTitle, setInstructorTitle] = useState("Senior Lead Architect");
  const [instructorAvatar, setInstructorAvatar] = useState("https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/135.jpg");

  const [isSubmitted, setIsSubmitted] = useState(false);

  // File Upload Handler
  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      setCoverImage(URL.createObjectURL(file));
    }
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    if (!newHighlightText.trim()) return;
    setHighlights((prev) => [...prev, newHighlightText.trim()]);
    setNewHighlightText("");
  };

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  // What You'll Learn handlers
  const handleAddLearnCard = () => {
    const newCard: WhatYouWillLearnItem = {
      id: `learn-${Date.now()}`,
      title: "New Skill Topic",
      desc: "Short description of what is taught.",
      iconTag: "Code2",
    };
    setLearnCards((prev) => [...prev, newCard]);
  };

  const handleUpdateLearnCard = (id: string, field: keyof WhatYouWillLearnItem, value: string) => {
    setLearnCards((prev) =>
      prev.map((card) => (card.id === id ? { ...card, [field]: value } : card))
    );
  };

  const handleRemoveLearnCard = (id: string) => {
    setLearnCards((prev) => prev.filter((c) => c.id !== id));
  };

  // Curriculum Handlers
  const handleAddSection = () => {
    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      title: `${sections.length + 1}. New Module Section`,
      lessons: [
        { id: `l-${Date.now()}`, title: `${sections.length + 1}.1 Intro Lesson`, duration: "10:00", isFree: false },
      ],
    };
    setSections((prev) => [...prev, newSec]);
  };

  const handleRemoveSection = (secId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== secId));
  };

  const handleAddLesson = (secId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          const lessonNum = sec.lessons.length + 1;
          return {
            ...sec,
            lessons: [
              ...sec.lessons,
              {
                id: `l-${Date.now()}`,
                title: `Lesson ${lessonNum}`,
                duration: "15:00",
                isFree: false,
              },
            ],
          };
        }
        return sec;
      })
    );
  };

  const handleUpdateLesson = (secId: string, lessonId: string, field: keyof LessonItem, value: any) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            lessons: sec.lessons.map((l) => (l.id === lessonId ? { ...l, [field]: value } : l)),
          };
        }
        return sec;
      })
    );
  };

  const handleRemoveLesson = (secId: string, lessonId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === secId) {
          return {
            ...sec,
            lessons: sec.lessons.filter((l) => l.id !== lessonId),
          };
        }
        return sec;
      })
    );
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const numPrice = parseFloat(price) || 49;
    const numOrig = parseFloat(originalPrice) || 149;

    addCourse({
      title,
      category,
      level,
      badgeTag,
      price: `$${numPrice.toFixed(2)}`,
      originalPrice: originalPrice ? `$${numOrig.toFixed(2)}` : undefined,
      durationFormatted: durationFormatted || "12h 30m",
      image: coverImage,
      description: subtitle || aboutDescription,
      features: highlights,
      author: {
        name: instructorName,
        avatar: instructorAvatar,
        slug: instructorName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        bio: instructorTitle,
      },
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess?.();
    }, 1200);
  };

  const numPrice = parseFloat(price) || 0;
  const numOrig = parseFloat(originalPrice) || 0;
  const discountPct = numOrig > numPrice ? Math.round(((numOrig - numPrice) / numOrig) * 100) : 0;

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8 bg-[#f7f8fa] dark:bg-[#181818] min-h-full pb-20">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-[#009f7f] rounded-full" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            Create Course Details & Curriculum
          </h1>
        </div>

        {isSubmitted ? (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-md text-sm font-bold dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            Course Created Successfully! Redirecting...
          </div>
        ) : (
          <button
            type="submit"
            className="h-10 px-6 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Publish Course</span>
          </button>
        )}
      </div>

      {/* SECTION 1: Course Banner & Video Preview (Image 1 Header) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Banner & Video Preview
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Upload course cover image and specify video preview URL
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageFileSelect}
            accept="image/*"
            className="hidden"
            id="course-banner-file-input"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <label
              htmlFor="course-banner-file-input"
              className="sm:col-span-2 border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg p-6 text-center hover:border-[#009f7f] transition-colors cursor-pointer bg-gray-50/50 dark:bg-[#181818]/50 flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-7 w-7 text-gray-400 dark:text-neutral-500" />
              <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium">
                <span className="text-[#009f7f] font-bold">Click to upload course banner image</span>
              </p>
              <span className="text-[10px] text-gray-400">Recommended 16:9 HD ratio</span>
            </label>

            {coverImage && (
              <div className="relative h-32 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-neutral-700 bg-gray-900">
                <Image
                  src={coverImage}
                  alt="Course banner"
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Video Preview URL */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Video className="h-3.5 w-3.5 text-[#009f7f]" />
              <span>Preview Video Link (YouTube / Vimeo Embed URL)</span>
            </label>
            <input
              type="text"
              value={previewVideoUrl}
              onChange={(e) => setPreviewVideoUrl(e.target.value)}
              placeholder="e.g. https://www.youtube-nocookie.com/embed/SqcY0GlETPk"
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 2: Course Header Info & Pricing (Image 1 Header Details) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Basic Header Info & Pricing
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Specify course title, level, language, pricing, and discount stats
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          {/* Title & Subtitle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Course Main Title*
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. React JS & Next.js – Full Stack Web Development"
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs font-semibold text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Header Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Master React 19 and Next.js 15 from scratch..."
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Backend & APIs">Backend & APIs</option>
                <option value="Programming">Programming</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Level Badge
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="All Levels">All Levels</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Language
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="English"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Badge Tag
              </label>
              <input
                type="text"
                value={badgeTag}
                onChange={(e) => setBadgeTag(e.target.value)}
                placeholder="e.g. Bestseller"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Enrolled Students
              </label>
              <input
                type="text"
                value={studentsCount}
                onChange={(e) => setStudentsCount(e.target.value)}
                placeholder="12,400"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Total Duration
              </label>
              <input
                type="text"
                value={durationFormatted}
                onChange={(e) => setDurationFormatted(e.target.value)}
                placeholder="12h 30m"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2 border-t border-gray-100 dark:border-neutral-800">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Sale Price ($)*
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="49.00"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs font-bold text-[#009f7f] outline-none focus:border-[#009f7f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="149.00"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-neutral-400">
                Discount Calculated
              </label>
              <div className="h-10 px-3 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                {discountPct > 0 ? `${discountPct}% OFF` : "No Discount"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 3: About Course & Key Highlights (Image 2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            About & Key Highlights
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Provide detailed description and checkmark highlights list
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              About This Course Description
            </label>
            <textarea
              rows={4}
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              placeholder="This course will take you from basic JavaScript to advanced React..."
              className="w-full p-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          {/* Highlights List Builder */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 block">
              Key Highlights (Checkmark Bullet Points)
            </label>

            <div className="space-y-2">
              {highlights.map((hl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <input
                    type="text"
                    value={hl}
                    onChange={(e) => {
                      const updated = [...highlights];
                      updated[idx] = e.target.value;
                      setHighlights(updated);
                    }}
                    className="flex-1 h-9 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-800 dark:text-neutral-200 outline-none focus:border-[#009f7f]"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveHighlight(idx)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add highlight input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newHighlightText}
                onChange={(e) => setNewHighlightText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddHighlight();
                  }
                }}
                placeholder="Add new bullet highlight..."
                className="flex-1 h-9 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-800 dark:text-neutral-200 outline-none focus:border-[#009f7f]"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="h-9 px-3 rounded-md bg-gray-100 dark:bg-neutral-800 hover:bg-[#009f7f] hover:text-white text-xs font-bold cursor-pointer transition-colors"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 4: Course Features Sidebar Config (Image 2 Sidebar) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Course Features Sidebar
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Configure access features and certificates
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Downloadable Resources
            </label>
            <input
              type="text"
              value={downloadableResources}
              onChange={(e) => setDownloadableResources(e.target.value)}
              placeholder="15+ downloadable resources"
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-[#181818]">
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">Lifetime Access</span>
            <input
              type="checkbox"
              checked={lifetimeAccess}
              onChange={(e) => setLifetimeAccess(e.target.checked)}
              className="h-4 w-4 accent-[#009f7f] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-[#181818]">
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">Access on Mobile & TV</span>
            <input
              type="checkbox"
              checked={mobileTvAccess}
              onChange={(e) => setMobileTvAccess(e.target.checked)}
              className="h-4 w-4 accent-[#009f7f] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-[#181818]">
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">Certificate of Completion</span>
            <input
              type="checkbox"
              checked={certificateOfCompletion}
              onChange={(e) => setCertificateOfCompletion(e.target.checked)}
              className="h-4 w-4 accent-[#009f7f] cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 5: What You'll Learn Cards Grid Builder (Image 3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            What You&apos;ll Learn Grid
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Manage topic cards displayed in the 3x2 learning matrix
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Topic Cards ({learnCards.length})
            </span>
            <button
              type="button"
              onClick={handleAddLearnCard}
              className="text-xs font-bold text-[#009f7f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Topic Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {learnCards.map((card) => (
              <div
                key={card.id}
                className="p-3.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50/50 dark:bg-[#181818] space-y-2 relative group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveLearnCard(card.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                  title="Delete Card"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Skill Title</label>
                  <input
                    type="text"
                    value={card.title}
                    onChange={(e) => handleUpdateLearnCard(card.id, "title", e.target.value)}
                    className="w-full h-8 px-2 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#212121] text-xs font-bold text-gray-800 dark:text-neutral-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                  <input
                    type="text"
                    value={card.desc}
                    onChange={(e) => handleUpdateLearnCard(card.id, "desc", e.target.value)}
                    className="w-full h-8 px-2 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#212121] text-xs text-gray-600 dark:text-neutral-300 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 6: Course Curriculum Builder (Image 4) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Course Curriculum
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Build sections, chapters, lectures, durations and preview flags
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-800">
            <span className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Curriculum Sections ({sections.length})
            </span>
            <button
              type="button"
              onClick={handleAddSection}
              className="text-xs font-bold text-[#009f7f] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Add Section</span>
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((sec, secIdx) => (
              <div
                key={sec.id}
                className="border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-gray-50/50 dark:bg-[#181818]"
              >
                {/* Section Header */}
                <div className="p-3 bg-gray-100 dark:bg-neutral-800 flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[secIdx].title = e.target.value;
                      setSections(updated);
                    }}
                    className="flex-1 h-8 px-2.5 rounded border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#212121] text-xs font-bold text-gray-900 dark:text-neutral-100 outline-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddLesson(sec.id)}
                      className="px-2.5 py-1 rounded bg-[#009f7f] text-white text-[11px] font-bold cursor-pointer"
                    >
                      + Add Lecture
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(sec.id)}
                      className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Section Lessons */}
                <div className="p-3 space-y-2">
                  {sec.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex flex-wrap items-center gap-2 p-2 rounded bg-white dark:bg-[#212121] border border-gray-100 dark:border-neutral-800 text-xs"
                    >
                      <input
                        type="text"
                        value={lesson.title}
                        onChange={(e) => handleUpdateLesson(sec.id, lesson.id, "title", e.target.value)}
                        placeholder="Lecture title"
                        className="flex-1 min-w-[150px] h-8 px-2 rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-[#181818] text-xs outline-none"
                      />
                      <input
                        type="text"
                        value={lesson.duration}
                        onChange={(e) => handleUpdateLesson(sec.id, lesson.id, "duration", e.target.value)}
                        placeholder="12:34"
                        className="w-20 h-8 px-2 rounded border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-[#181818] text-xs outline-none text-center font-mono"
                      />
                      <label className="flex items-center gap-1.5 px-2 py-1 rounded bg-gray-50 dark:bg-neutral-800 text-[11px] font-semibold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={lesson.isFree}
                          onChange={(e) => handleUpdateLesson(sec.id, lesson.id, "isFree", e.target.checked)}
                          className="accent-[#009f7f]"
                        />
                        <span>Preview</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRemoveLesson(sec.id, lesson.id)}
                        className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUBMIT FOOTER BUTTON */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-neutral-800">
        <button
          type="submit"
          className="h-11 px-8 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>Save & Publish Course</span>
        </button>
      </div>
    </form>
  );
};
