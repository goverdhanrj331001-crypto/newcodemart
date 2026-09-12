"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Globe,
  ExternalLink,
  Check,
  Copy,
  Users,
  Sparkles,
  Share2,
  Code2,
  Tv,
  Palette,
  Send,
  Heart,
} from "lucide-react";

interface SocialChannelItem {
  id: string;
  name: string;
  handle: string;
  members: string;
  description: string;
  url: string;
  iconBg: string;
  badge: string;
  badgeColor: string;
}

const SOCIAL_CHANNELS: SocialChannelItem[] = [
  {
    id: "discord",
    name: "Discord Community",
    handle: "discord.gg/pixermarketplace",
    members: "14,800+ Members",
    description: "Hang out with thousands of frontend developers and UI designers. Share feedback, get instant tech support, and show off your builds.",
    url: "https://discord.com",
    iconBg: "bg-[#5865F2]",
    badge: "Most Active",
    badgeColor: "bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/40",
  },
  {
    id: "twitter",
    name: "Twitter / X",
    handle: "@PixerMarketplace",
    members: "42.5K Followers",
    description: "Daily releases, template drops, designer spotlights, and feature changelogs. Tag us to get your project reposted.",
    url: "https://x.com",
    iconBg: "bg-black",
    badge: "Official News",
    badgeColor: "bg-neutral-800 text-neutral-300 border-neutral-700",
  },
  {
    id: "github",
    name: "GitHub Community",
    handle: "github.com/pixer-templates",
    members: "8.2K Stars",
    description: "Explore free open-source boilerplates, Tailwind CSS components, Next.js starter kits, and report template issues.",
    url: "https://github.com",
    iconBg: "bg-[#24292e]",
    badge: "Open Source",
    badgeColor: "bg-emerald-950/40 text-emerald-300 border-emerald-700/50",
  },
  {
    id: "youtube",
    name: "YouTube Channel",
    handle: "@PixerDevShowcase",
    members: "28.4K Subscribers",
    description: "In-depth video tutorials on how to customize themes, integrate REST APIs, structure state, and deploy Next.js apps.",
    url: "https://youtube.com",
    iconBg: "bg-[#FF0000]",
    badge: "Video Tutorials",
    badgeColor: "bg-red-950/40 text-red-400 border-red-800/40",
  },
  {
    id: "dribbble",
    name: "Dribbble Portfolio",
    handle: "dribbble.com/pixer_ui",
    members: "19.1K Followers",
    description: "High-resolution UI screenshots, vector concepts, mobile UI kits, and design work-in-progress shots.",
    url: "https://dribbble.com",
    iconBg: "bg-[#EA4C89]",
    badge: "Design Kits",
    badgeColor: "bg-pink-950/40 text-pink-400 border-pink-800/40",
  },
  {
    id: "telegram",
    name: "Telegram VIP Channel",
    handle: "t.me/pixer_drops",
    members: "11.3K Subscribers",
    description: "Flash discounts, immediate notification of brand-new template drops, and exclusive community coupon codes.",
    url: "https://telegram.org",
    iconBg: "bg-[#229ED9]",
    badge: "Flash Drops",
    badgeColor: "bg-sky-950/40 text-sky-400 border-sky-800/40",
  },
];

export const SocialView: React.FC = () => {
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(text);
      setCopiedChannel(id);
      setTimeout(() => setCopiedChannel(null), 2000);
    }
  };

  return (
    <div
      id="social-view-container"
      className="w-full bg-gray-50 dark:bg-[#181818] min-h-screen text-gray-900 dark:text-white px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-200"
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <span className="text-xs uppercase tracking-widest text-[#009f7f] dark:text-emerald-400 font-bold mb-1 block">
          Connect &amp; Collaborate
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Community &amp; Social Hub
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-neutral-400 mt-1 max-w-2xl">
          Join 100,000+ creators, frontend engineers, and UI designers building next-generation digital experiences.
        </p>
      </div>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] rounded-xl p-4 text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white block">
              14,800+
            </span>
            <span className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 block">
              Discord Developers
            </span>
          </div>

          <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] rounded-xl p-4 text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-bold text-[#009f7f] dark:text-emerald-400 block">
              42,500+
            </span>
            <span className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 block">
              Twitter / X Followers
            </span>
          </div>

          <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] rounded-xl p-4 text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white block">
              28,400+
            </span>
            <span className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 block">
              YouTube Subscribers
            </span>
          </div>

          <div className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] rounded-xl p-4 text-center shadow-2xs">
            <span className="text-xl sm:text-2xl font-bold text-[#009f7f] dark:text-emerald-400 block">
              8,200+
            </span>
            <span className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 block">
              GitHub Repo Stars
            </span>
          </div>
        </div>

        {/* Social Cards Grid: Responsive tablet 2, laptop 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SOCIAL_CHANNELS.map((ch) => {
            const isCopied = copiedChannel === ch.id;
            return (
              <div
                key={ch.id}
                id={`social-channel-${ch.id}`}
                className="bg-white dark:bg-[#212121] border border-gray-200 dark:border-[#333333] hover:border-gray-300 dark:hover:border-[#444444] rounded-2xl p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group hover:-translate-y-0.5"
              >
                <div>
                  {/* Top Row: Icon, Title, Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${ch.iconBg} text-white flex items-center justify-center shadow-md shrink-0`}
                      >
                        {ch.id === "discord" && <MessageSquare className="w-5 h-5" />}
                        {ch.id === "twitter" && <Share2 className="w-5 h-5" />}
                        {ch.id === "github" && <Code2 className="w-5 h-5" />}
                        {ch.id === "youtube" && <Tv className="w-5 h-5" />}
                        {ch.id === "dribbble" && <Palette className="w-5 h-5" />}
                        {ch.id === "telegram" && <Send className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-[#009f7f] dark:group-hover:text-emerald-400 transition-colors">
                          {ch.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-neutral-400 font-mono">
                          {ch.handle}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${ch.badgeColor}`}
                    >
                      {ch.badge}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-neutral-300 leading-relaxed mb-4">
                    {ch.description}
                  </p>
                </div>

                <div>
                  {/* Members count tag */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-neutral-400 mb-4 pt-2 border-t border-gray-100 dark:border-[#2e2e2e]">
                    <Users className="w-3.5 h-3.5 text-[#009f7f] dark:text-emerald-400" />
                    <span>{ch.members}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <a
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#009f7f] hover:bg-[#008f72] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      <span>Join / Visit</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(ch.id, ch.handle)}
                      className="px-3 py-2 bg-gray-100 dark:bg-[#2a2a2a] hover:bg-gray-200 dark:hover:bg-[#333333] text-gray-700 dark:text-neutral-300 hover:text-gray-900 dark:hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-gray-200 dark:border-[#383838]"
                      title="Copy handle"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#009f7f] dark:text-emerald-400" />
                          <span className="text-[#009f7f] dark:text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Creator Spotlight Banner */}
        <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-950/60 via-white dark:via-[#212121] to-gray-50 dark:to-[#1c1c1c] border border-emerald-200 dark:border-emerald-800/40 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#009f7f] dark:text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Creator Spotlight
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1.5">
              Built something with Pixer templates?
            </h3>
            <p className="text-xs text-gray-600 dark:text-neutral-300 leading-relaxed">
              Tag your project with <strong className="text-gray-900 dark:text-white">#MadeWithPixer</strong> on Twitter or post it in our Discord #showcase channel. Featured creators receive $250 marketplace credits and a homepage spotlight badge!
            </p>
          </div>

          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#009f7f] hover:bg-[#008f72] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-2xs hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Submit Your Project</span>
          </a>
        </div>
      </div>
    </div>
  );
};
