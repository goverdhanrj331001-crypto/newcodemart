"use client";

import React, { useState, useRef } from "react";
import { useAdmin } from "../context/admin-context";
import {
  Upload,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Quote,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Code,
  CheckCircle2,
  Eye,
  Edit3,
  X,
} from "lucide-react";

interface AdminAddProductViewProps {
  onSuccess?: () => void;
}

export const AdminAddProductView: React.FC<AdminAddProductViewProps> = ({
  onSuccess,
}) => {
  const { addProduct, categories } = useAdmin();

  // Form states
  const [featuredImage, setFeaturedImage] = useState<string>("https://picsum.photos/seed/pixernew/800/600");
  const [galleryImages, setGalleryImages] = useState<string[]>(["https://picsum.photos/seed/pixernew2/800/600"]);
  const [videoTitle, setVideoTitle] = useState("");
  const [layoutType, setLayoutType] = useState("Digital Product");

  // Category group & selection state
  const [categoryGroup, setCategoryGroup] = useState<"tech" | "project_type">("tech");
  const [category, setCategory] = useState("React");

  const [tags, setTags] = useState<string[]>(["Next.js", "TypeScript"]);
  const [tagInput, setTagInput] = useState("");

  // Name & Description states (slug and unit REMOVED per requirements)
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editorMode, setEditorMode] = useState<"write" | "preview">("write");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Price & Digital file states (Quantity & SKU REMOVED per requirements)
  const [price, setPrice] = useState("29.00");
  const [salePrice, setSalePrice] = useState("");
  const [previewUrl, setPreviewUrl] = useState("https://ai.studio");
  const [isExternal, setIsExternal] = useState(false);

  // Digital File fields
  const [digitalFileUrl, setDigitalFileUrl] = useState("https://drive.google.com/file/d/example-zip-archive/view");
  const [digitalFileName, setDigitalFileName] = useState("package-source.zip");
  const digitalFileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter categories by selected structure group
  const filteredCategories = categories.filter((c) => c.type === categoryGroup);

  const handleGroupChange = (newGroup: "tech" | "project_type") => {
    setCategoryGroup(newGroup);
    const available = categories.filter((c) => c.type === newGroup);
    if (available.length > 0) {
      setCategory(available[0].name);
    } else {
      setCategory(newGroup === "tech" ? "React" : "E-Commerce");
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags((prev) => prev.filter((item) => item !== t));
  };

  // Rich Text Insertion Helper for Description Field
  const applyFormat = (syntaxStart: string, syntaxEnd: string = "", defaultText: string = "text") => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setDescription((prev) => `${prev}${syntaxStart}${defaultText}${syntaxEnd}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = description.substring(start, end) || defaultText;
    const replacement = `${syntaxStart}${selectedText}${syntaxEnd}`;

    const newText = description.substring(0, start) + replacement + description.substring(end);
    setDescription(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntaxStart.length, start + syntaxStart.length + selectedText.length);
    }, 50);
  };

  const handleDigitalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDigitalFileName(file.name);
      setDigitalFileUrl(`blob:${file.name}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    addProduct({
      title: name,
      slug: generatedSlug,
      price: price ? `$${parseFloat(price).toFixed(2)}` : "$29.00",
      originalPrice: salePrice ? `$${parseFloat(salePrice).toFixed(2)}` : undefined,
      image: featuredImage,
      gallery: galleryImages,
      category,
      description: description || "High performance digital asset template built with modern web standards.",
      liveDemoUrl: previewUrl,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess?.();
    }, 1200);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-8 bg-[#f7f8fa] dark:bg-[#181818] min-h-full">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
            Create New Product
          </h1>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1">
            Add full product details, category structure, rich description & downloadable digital files
          </p>
        </div>

        {isSubmitted && (
          <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-md text-xs font-bold dark:bg-emerald-950 dark:text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Product Created Successfully! Redirecting...
          </div>
        )}
      </div>

      {/* SECTION 1: Featured Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Featured Image
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Upload your product main cover image. Recommended size <strong className="text-gray-700 dark:text-neutral-300">800x600 px</strong>
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg p-8 text-center hover:border-[#009f7f] transition-colors cursor-pointer bg-gray-50/50 dark:bg-[#181818]/50 flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400 dark:text-neutral-500" />
            <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium">
              <span className="text-[#009f7f] font-bold">Upload an image</span> or drag and drop
            </p>
            <span className="text-[10px] text-gray-400">PNG, JPG, WEBP</span>
          </div>

          {featuredImage && (
            <div className="flex items-center gap-3 pt-2">
              <img
                src={featuredImage}
                alt="Featured preview"
                className="w-16 h-12 object-cover rounded border border-gray-200 dark:border-neutral-700"
              />
              <span className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                {featuredImage}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 2: Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Gallery
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Upload additional product screenshot images for preview slides
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-3">
          <div className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg p-8 text-center hover:border-[#009f7f] transition-colors cursor-pointer bg-gray-50/50 dark:bg-[#181818]/50 flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400 dark:text-neutral-500" />
            <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium">
              <span className="text-[#009f7f] font-bold">Upload gallery images</span> or drag and drop
            </p>
            <span className="text-[10px] text-gray-400">PNG, JPG</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 3: Video Title */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Video Preview URL
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Add YouTube or Vimeo video link for product demonstration
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs flex items-center gap-3">
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="grow h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
          />
          <button
            type="button"
            className="h-10 px-4 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Add Video
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 4: LAYOUT & CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Layout & Categories
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Select category structure (By Tag or By Project Type) and relevant category
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-5">
          {/* 1. TOP OPTION: SELECT BY TAG OR BY PROJECT TYPE */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-800 dark:text-neutral-200 block uppercase tracking-wider text-[11px]">
              Category Structure Type*
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGroupChange("tech")}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  categoryGroup === "tech"
                    ? "border-[#009f7f] bg-emerald-50/60 dark:bg-emerald-950/30 text-[#009f7f] ring-1 ring-[#009f7f]"
                    : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-gray-700 dark:text-neutral-300 hover:border-gray-300"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">By Tag Product</span>
                  <span className="text-[11px] text-gray-500 dark:text-neutral-400">Tech Stack & Frameworks</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  categoryGroup === "tech" ? "border-[#009f7f] bg-[#009f7f]" : "border-gray-300"
                }`}>
                  {categoryGroup === "tech" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGroupChange("project_type")}
                className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between ${
                  categoryGroup === "project_type"
                    ? "border-[#009f7f] bg-emerald-50/60 dark:bg-emerald-950/30 text-[#009f7f] ring-1 ring-[#009f7f]"
                    : "border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-gray-700 dark:text-neutral-300 hover:border-gray-300"
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">By Project Type</span>
                  <span className="text-[11px] text-gray-500 dark:text-neutral-400">E-Commerce, Dashboard, Mobile, etc.</span>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  categoryGroup === "project_type" ? "border-[#009f7f] bg-[#009f7f]" : "border-gray-300"
                }`}>
                  {categoryGroup === "project_type" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            </div>
          </div>

          {/* 2. CATEGORY DROPDOWN MATCHING SELECTED TYPE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Category ({categoryGroup === "tech" ? "By Tag Categories" : "By Project Type Categories"})*
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f] transition-all font-medium"
            >
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Layouts Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Layouts Type*
            </label>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value)}
              className="w-full h-10 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] px-3 text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            >
              <option value="Digital Product">Digital Product</option>
              <option value="Course">Course</option>
              <option value="Physical">Physical Asset</option>
              <option value="Script">Script / Source Code</option>
              <option value="Theme">Theme & Template</option>
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Type tag and press Enter"
                className="grow h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 bg-gray-100 dark:bg-neutral-800 text-xs font-semibold rounded hover:bg-gray-200 cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 5: DESCRIPTION (SLUG AND UNIT REMOVED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Description
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Write rich product description including bold text, lists, quotes, code, and images
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Product Title / Name*
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Next.js SaaS Full-stack Starter Template"
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          {/* Description Formatting Toolbar + Interactive Editor & Live Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Description Content (Supports Bold, Lists, Images & Formatting)*
              </label>
              
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 p-0.5 rounded-md text-xs">
                <button
                  type="button"
                  onClick={() => setEditorMode("write")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-all cursor-pointer ${
                    editorMode === "write"
                      ? "bg-white dark:bg-[#212121] text-[#009f7f] shadow-xs"
                      : "text-gray-500 dark:text-neutral-400"
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 font-semibold transition-all cursor-pointer ${
                    editorMode === "preview"
                      ? "bg-white dark:bg-[#212121] text-[#009f7f] shadow-xs"
                      : "text-gray-500 dark:text-neutral-400"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </button>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-neutral-700 rounded-md overflow-hidden bg-white dark:bg-[#181818]">
              {/* WYSIWYG Formatting Toolbar */}
              <div className="bg-gray-50 dark:bg-neutral-800/80 px-3 py-2 border-b border-gray-200 dark:border-neutral-700 flex flex-wrap items-center gap-1 text-gray-600 dark:text-neutral-300 text-xs">
                <button
                  type="button"
                  onClick={() => applyFormat("**", "**", "bold text")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("*", "*", "italic text")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("<u>", "</u>", "underlined text")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Underline"
                >
                  <Underline className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("~~", "~~", "strikethrough text")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Strikethrough"
                >
                  <Strikethrough className="h-4 w-4" />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 dark:bg-neutral-700 mx-1" />

                <button
                  type="button"
                  onClick={() => applyFormat("\n> ", "", "Quoted text block")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Quote"
                >
                  <Quote className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("\n- Feature Item 1\n- Feature Item 2\n- Feature Item 3", "", "")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("\n1. Step One\n2. Step Two\n3. Step Three", "", "")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 dark:bg-neutral-700 mx-1" />

                <button
                  type="button"
                  onClick={() => {
                    const url = prompt("Enter URL:", "https://example.com");
                    if (url) applyFormat("[", `](${url})`, "Link text");
                  }}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Insert Link"
                >
                  <Link2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const imgUrl = prompt("Enter Image URL:", "https://picsum.photos/seed/pixer/800/600");
                    if (imgUrl) applyFormat("![Image](", `)`, imgUrl);
                  }}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Insert Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat("`", "`", "code snippet")}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded cursor-pointer transition-colors"
                  title="Inline Code"
                >
                  <Code className="h-4 w-4" />
                </button>
              </div>

              {editorMode === "write" ? (
                <textarea
                  ref={textareaRef}
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Write comprehensive product details... Use toolbar above to format bold text (**bold**), lists (- item), images (![alt](url)), and links."
                  className="w-full p-3.5 text-xs text-gray-900 dark:text-neutral-100 outline-none bg-transparent font-mono leading-relaxed"
                />
              ) : (
                <div className="p-4 text-xs text-gray-800 dark:text-neutral-200 min-h-[160px] prose dark:prose-invert max-w-none space-y-2">
                  {description ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {description.split("\n").map((line, idx) => {
                        if (line.startsWith("- ")) {
                          return <li key={idx} className="ml-4 list-disc">{line.substring(2)}</li>;
                        }
                        if (line.startsWith("> ")) {
                          return <blockquote key={idx} className="border-l-2 border-[#009f7f] pl-3 italic text-gray-600 dark:text-neutral-400 my-1">{line.substring(2)}</blockquote>;
                        }
                        return <p key={idx}>{line}</p>;
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No description content to preview yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 block">
              Status
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-neutral-300 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="status"
                  value="Published"
                  checked={status === "Published"}
                  onChange={() => setStatus("Published")}
                  className="accent-[#009f7f]"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-neutral-300 cursor-pointer font-medium">
                <input
                  type="radio"
                  name="status"
                  value="Draft"
                  checked={status === "Draft"}
                  onChange={() => setStatus("Draft")}
                  className="accent-[#009f7f]"
                />
                Draft
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-neutral-800" />

      {/* SECTION 6: SIMPLE PRODUCT INFORMATION (QUANTITY AND SKU REMOVED, DIGITAL FILE & URL ADDED) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-gray-800 dark:text-neutral-200">
            Simple Product Information
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 leading-relaxed">
            Specify pricing, live preview links, and attach digital source file details
          </p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-[#212121] p-6 rounded-lg border border-gray-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Regular Price ($)*
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="29.00"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Sale / Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="Optional sale price e.g. 19.00"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
              Live Preview Demo URL
            </label>
            <input
              type="text"
              value={previewUrl}
              onChange={(e) => setPreviewUrl(e.target.value)}
              placeholder="https://live-demo.com"
              className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isExternal"
              checked={isExternal}
              onChange={(e) => setIsExternal(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-[#009f7f] focus:ring-[#009f7f]"
            />
            <label htmlFor="isExternal" className="text-xs font-medium text-gray-700 dark:text-neutral-300 cursor-pointer">
              Is External Product (Redirect to partner checkout)
            </label>
          </div>

          {/* DIGITAL FILE OPTIONS BELOW SIMPLE PRODUCT INFO */}
          <div className="pt-3 border-t border-gray-100 dark:border-neutral-800 space-y-4">
            <h4 className="text-xs font-bold text-gray-800 dark:text-neutral-200 uppercase tracking-wider text-[11px]">
              Digital File Delivery & Assets
            </h4>

            {/* DIGITAL FILE URL INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300">
                Digital File URL (Direct Download or Cloud Link)
              </label>
              <input
                type="text"
                value={digitalFileUrl}
                onChange={(e) => setDigitalFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/... or direct zip download link"
                className="w-full h-10 px-3 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-[#181818] text-xs text-gray-900 dark:text-neutral-100 outline-none focus:border-[#009f7f]"
              />
            </div>

            {/* UPLOAD DIGITAL FILE DIRECTLY */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 dark:text-neutral-300 block">
                Upload Digital File (Direct Asset Upload)
              </label>

              <input
                type="file"
                ref={digitalFileInputRef}
                onChange={handleDigitalFileSelect}
                className="hidden"
                id="digital-file-upload-input"
              />

              <label
                htmlFor="digital-file-upload-input"
                className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-lg p-6 text-center hover:border-[#009f7f] transition-all cursor-pointer bg-gray-50/50 dark:bg-[#181818]/50 flex flex-col items-center justify-center space-y-1.5 group"
              >
                <Upload className="h-6 w-6 text-gray-400 dark:text-neutral-500 group-hover:scale-110 transition-transform" />
                <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium">
                  <span className="text-[#009f7f] font-bold">Click to upload digital file</span> or drag and drop
                </p>
                <span className="text-[10px] text-gray-400">ZIP, RAR, TAR.GZ, PDF (Max 100MB)</span>
              </label>

              {digitalFileName && (
                <div className="flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 text-[#009f7f] font-bold mt-2">
                  <span className="truncate">Attached File: {digitalFileName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDigitalFileName("");
                      setDigitalFileUrl("");
                      if (digitalFileInputRef.current) digitalFileInputRef.current.value = "";
                    }}
                    className="text-rose-600 hover:text-rose-800 text-xs font-bold cursor-pointer shrink-0 ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTONS */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-neutral-800">
        <button
          type="button"
          onClick={() => {
            setStatus("Draft");
            handleSubmit({ preventDefault: () => {} } as React.FormEvent);
          }}
          className="h-10 px-5 rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-bold text-gray-700 dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-700 cursor-pointer"
        >
          Save as Draft
        </button>
        <button
          type="submit"
          className="h-10 px-6 rounded-md bg-[#009f7f] hover:bg-[#018066] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          Save Product
        </button>
      </div>
    </form>
  );
};

