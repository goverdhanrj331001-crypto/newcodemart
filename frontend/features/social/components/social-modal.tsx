"use client";

import React, { useState } from "react";
import { X, MessageSquare, Globe, ExternalLink, Check, Copy } from "lucide-react";

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialLink {
  name: string;
  handle: string;
  members: string;
  description: string;
  url: string;
  color: string;
  badge: string;
}

const SOCIAL_CHANNELS: SocialLink[] = [
  {
    name: "Discord Community",
    handle: "discord.gg/pixermarketplace",
    members: "14,800+ Members",
    description: "Hang out with thousands of frontend developers and UI designers. Share feedback and get support.",
    url: "https://discord.com",
    color: "from-[#5865F2] to-[#404EED]",
    badge: "Most Active",
  },
  {
    name: "Twitter / X",
    handle: "@PixerMarketplace",
    members: "42.5K Followers",
    description: "Daily releases, template drops, designer spotlights, and feature changelogs.",
    url: "https://x.com",
    color: "from-[#000000] to-[#262626]",
    badge: "Official News",
  },
  {
    name: "GitHub Community",
    handle: "github.com/pixer-templates",
    members: "8.2K Stars",
    description: "Explore free open-source boilerplates, Tailwind components, and contribute to templates.",
    url: "https://github.com",
    color: "from-[#24292e] to-[#171515]",
    badge: "Open Source",
  },
  {
    name: "YouTube Channel",
    handle: "@PixerDevShowcase",
    members: "28.4K Subscribers",
    description: "In-depth video tutorials on how to customize themes, connect REST APIs, and deploy Next.js apps.",
    url: "https://youtube.com",
    color: "from-[#FF0000] to-[#CC0000]",
    badge: "Tutorials",
  },
  {
    name: "Dribbble Portfolio",
    handle: "dribbble.com/pixer_ui",
    members: "19.1K Followers",
    description: "Fresh UI shots, mobile app concept wireframes, and design exploration showcases.",
    url: "https://dribbble.com",
    color: "from-[#EA4C89] to-[#C32361]",
    badge: "Design Inspiration",
  },
];

export const SocialModal: React.FC<SocialModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (handle: string) => {
    navigator.clipboard?.writeText(handle);
    setCopiedLink(handle);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div
      id="social-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="social-modal-card"
        className="bg-[#1c1c1c] border border-[#333333] w-full max-w-2xl rounded-2xl p-5 sm:p-7 text-white shadow-2xl relative my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2e2e2e]">
          <div>
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              Join The Community
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mt-0.5">Social Channels &amp; Hub</h2>
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

        {/* Channels List */}
        <div className="overflow-y-auto grow py-4 space-y-3 no-scrollbar">
          {SOCIAL_CHANNELS.map((channel) => (
            <div
              key={channel.name}
              className="bg-[#242424] hover:bg-[#292929] border border-[#333] hover:border-[#444] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${channel.color} text-white shrink-0 shadow-md`}
                >
                  <Globe className="w-6 h-6 stroke-[1.8]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors">
                      {channel.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {channel.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                    {channel.description}
                  </p>
                  <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">
                    {channel.members}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#333]">
                <button
                  type="button"
                  onClick={() => handleCopy(channel.handle)}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition-colors cursor-pointer"
                  title="Copy link"
                >
                  {copiedLink === channel.handle ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grow sm:grow-0 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  Join / Follow
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#2e2e2e] flex items-center justify-between text-xs text-neutral-400">
          <span>Stay connected for free weekly code drops.</span>
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
