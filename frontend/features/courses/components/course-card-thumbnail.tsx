"use client";

import React from "react";
import { MoreVertical } from "lucide-react";

interface CourseCardThumbnailProps {
  type: string;
  title: string;
  badgeTag?: string;
  onMenuClick?: (e: React.MouseEvent) => void;
}

export const CourseCardThumbnail: React.FC<CourseCardThumbnailProps> = ({
  type,
  badgeTag,
  onMenuClick,
}) => {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden select-none">
      {/* Dynamic Graphic based on Course type matching user screenshot */}
      {type === "react-next" && (
        <div className="w-full h-full bg-gradient-to-br from-[#071329] via-[#0c1f44] to-[#122c60] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />
          
          {/* React Logo glowing */}
          <div className="relative z-10 flex flex-col items-center justify-center pl-2">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse" />
              <svg className="w-10 h-10 text-cyan-400" viewBox="0 0 115.3 100" fill="currentColor">
                <ellipse cx="57.65" cy="50" rx="14" ry="46" transform="matrix(0.866 -0.5 0.5 0.866 -17.27 36.3)" fill="none" stroke="currentColor" strokeWidth="4.5" />
                <ellipse cx="57.65" cy="50" rx="14" ry="46" transform="matrix(0.866 0.5 -0.5 0.866 32.73 -20.6)" fill="none" stroke="currentColor" strokeWidth="4.5" />
                <ellipse cx="57.65" cy="50" rx="46" ry="14" fill="none" stroke="currentColor" strokeWidth="4.5" />
                <circle cx="57.65" cy="50" r="7.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* IDE Mockup */}
          <div className="relative z-10 w-28 h-20 bg-slate-900/90 border border-cyan-500/30 rounded-md p-1.5 shadow-lg flex flex-col justify-between font-mono text-[8px] text-cyan-200">
            <div className="flex items-center gap-1 border-b border-slate-700/60 pb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[7px] text-slate-400 ml-1">App.tsx</span>
            </div>
            <div className="space-y-0.5 text-[7px] text-slate-300">
              <p className="text-purple-400">const <span className="text-cyan-300">App</span> = () =&gt; &#123;</p>
              <p className="pl-1 text-emerald-400">return &lt;<span className="text-cyan-300">NextApp</span> /&gt;;</p>
              <p className="text-purple-400">&#125;;</p>
            </div>
          </div>
        </div>
      )}

      {type === "flutter-app" && (
        <div className="w-full h-full bg-gradient-to-br from-[#0c2242] via-[#103264] to-[#15468d] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Flutter cyan wing logo */}
          <div className="relative z-10 pl-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.314 0L2.3 12 6 15.7 21.684 0h-7.37zM14.314 11.232L7.697 17.85l3.7 3.7 2.917-2.918 3.7-3.7-3.7-3.7z" />
              </svg>
            </div>
          </div>

          {/* Dual Phone Mockups */}
          <div className="relative z-10 flex items-center -space-x-4 pr-1">
            <div className="w-14 h-22 bg-slate-900 border border-cyan-400/40 rounded-lg p-1 shadow-xl transform -rotate-6 flex flex-col justify-between">
              <div className="w-4 h-0.5 bg-slate-700 rounded-full mx-auto" />
              <div className="space-y-1">
                <div className="w-full h-2.5 bg-cyan-500/30 rounded" />
                <div className="w-3/4 h-2 bg-slate-700 rounded" />
                <div className="w-full h-6 bg-cyan-600/20 rounded" />
              </div>
              <div className="w-full h-1.5 bg-cyan-500 rounded-xs" />
            </div>
            <div className="w-14 h-22 bg-slate-950 border border-cyan-300/60 rounded-lg p-1 shadow-2xl transform rotate-3 flex flex-col justify-between">
              <div className="w-4 h-0.5 bg-slate-700 rounded-full mx-auto" />
              <div className="space-y-1">
                <div className="w-full h-7 bg-gradient-to-br from-cyan-500 to-blue-600 rounded" />
                <div className="w-full h-2 bg-slate-700 rounded" />
              </div>
              <div className="w-full h-1.5 bg-blue-500 rounded-xs" />
            </div>
          </div>
        </div>
      )}

      {type === "laravel-api" && (
        <div className="w-full h-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Red Laravel Logo */}
          <div className="relative z-10 pl-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#f55247] drop-shadow-[0_2px_8px_rgba(245,82,71,0.3)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.7 2.1a1 1 0 00-.9.6L5 10.3l5.5 3.2 3.8-7.6-4.6-3.8zm8.7 5.2l-3.3 6.6 4.7 2.7 3.3-6.6-4.7-2.7zM4.3 12.3L.7 19.5a1 1 0 00.5 1.3l8.6 4.3 3.6-7.2-9.1-5.6zm10.7 2.3l-3.6 7.2 8.6 4.3a1 1 0 001.3-.5l3.6-7.2-9.9-3.8z" />
              </svg>
            </div>
          </div>

          {/* Laptop Mockup */}
          <div className="relative z-10 w-28 h-20 bg-slate-800 rounded-t-md p-1 shadow-lg border border-slate-600 flex flex-col justify-between font-mono text-[8px]">
            <div className="flex items-center gap-1 border-b border-slate-700 pb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[7px] text-slate-400 ml-1">api.php</span>
            </div>
            <div className="space-y-0.5 text-[7px]">
              <p className="text-[#f55247]">Route::get(<span className="text-emerald-400">&apos;/users&apos;</span>)</p>
              <p className="pl-1 text-slate-300">-&gt;middleware(<span className="text-amber-300">&apos;auth&apos;</span>);</p>
            </div>
            <div className="w-32 -mx-2 h-1 bg-slate-500 rounded-b-sm self-center shadow" />
          </div>
        </div>
      )}

      {type === "figma-design" && (
        <div className="w-full h-full bg-gradient-to-br from-[#2e1065] via-[#3b0764] to-[#581c87] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Figma 3D Icon */}
          <div className="relative z-10 pl-2">
            <div className="w-10 h-14 flex items-center justify-center">
              <svg className="w-9 h-13" viewBox="0 0 38 57" fill="none">
                <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
              </svg>
            </div>
          </div>

          {/* Wireframe Mockup Cards */}
          <div className="relative z-10 w-28 h-20 bg-purple-950/80 border border-purple-400/40 rounded-md p-1.5 shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-purple-800/80 pb-1">
              <span className="text-[7px] text-purple-300 font-semibold">HeroSection.fig</span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            </div>
            <div className="grid grid-cols-2 gap-1 my-1">
              <div className="h-6 bg-purple-500/20 border border-purple-500/30 rounded" />
              <div className="h-6 bg-purple-500/20 border border-purple-500/30 rounded" />
            </div>
            <div className="w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded" />
          </div>
        </div>
      )}

      {type === "python-data" && (
        <div className="w-full h-full bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Python Icon */}
          <div className="relative z-10 pl-2">
            <div className="w-11 h-11 flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 110 110" fill="none">
                <path d="M53.8 2C27.5 2 29.1 13.4 29.1 13.4L29.2 25.3H54.4V29H18.3C18.3 29 2 27.2 2 54.3C2 81.4 16.3 80.3 16.3 80.3H26.3V67.8C26.3 67.8 25.7 52.8 40.9 52.8H65.8C65.8 52.8 79.5 53.4 79.5 39.9V14.8C79.5 14.8 82.5 2 53.8 2ZM43.4 10.3C46.8 10.3 49.5 13 49.5 16.4C49.5 19.8 46.8 22.5 43.4 22.5C40 22.5 37.3 19.8 37.3 16.4C37.3 13 40 10.3 43.4 10.3Z" fill="#387EB8" />
                <path d="M56.2 108C82.5 108 80.9 96.6 80.9 96.6L80.8 84.7H55.6V81H91.7C91.7 81 108 82.8 108 55.7C108 28.6 93.7 29.7 93.7 29.7H83.7V42.2C83.7 42.2 84.3 57.2 69.1 57.2H44.2C44.2 57.2 30.5 56.6 30.5 70.1V95.2C30.5 95.2 27.5 108 56.2 108ZM66.6 99.7C63.2 99.7 60.5 97 60.5 93.6C60.5 90.2 63.2 87.5 66.6 87.5C70 87.5 72.7 90.2 72.7 93.6C72.7 97 70 99.7 66.6 99.7Z" fill="#FFE052" />
              </svg>
            </div>
          </div>

          {/* Bar / Chart Visual */}
          <div className="relative z-10 w-28 h-20 bg-white/90 border border-sky-300 rounded-md p-2 shadow-md flex items-end justify-between gap-1.5">
            <div className="w-3 bg-sky-400 rounded-t h-7" />
            <div className="w-3 bg-blue-500 rounded-t h-12" />
            <div className="w-3 bg-indigo-500 rounded-t h-9" />
            <div className="w-3 bg-emerald-400 rounded-t h-14" />
            <div className="w-3 bg-amber-400 rounded-t h-10" />
          </div>
        </div>
      )}

      {type === "wordpress" && (
        <div className="w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] p-3 flex items-center justify-between relative overflow-hidden">
          {/* WordPress Icon */}
          <div className="relative z-10 pl-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-10 h-10 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.2c5.964 0 10.8 4.836 10.8 10.8 0 1.848-.466 3.587-1.282 5.109l-5.617-15.39c-.066-.182-.19-.36-.37-.43-.18-.07-.402-.038-.56.09-.328.267-.655.534-.982.802-.328.267-.442.705-.285 1.096l4.135 11.33-2.73-8.19c-.06-.182-.185-.333-.35-.41-.168-.077-.363-.075-.53.007l-2.025.992c-.36.175-.494.618-.302.98.19.36.634.498.995.323l1.196-.585 3.518 10.552c-1.803 1.34-4.04 2.14-6.47 2.14-1.92 0-3.71-.5-5.27-1.39l4.57-13.25c.06-.174.04-.367-.05-.523-.09-.156-.25-.254-.43-.263l-2.25-.107c-.4-.02-.73.29-.75.69-.02.4.29.73.69.75l1.37.065-4.57 13.25C2.5 17.5 1.2 14.9 1.2 12c0-5.964 4.836-10.8 10.8-10.8z" />
              </svg>
            </div>
          </div>

          {/* Laptop mockup */}
          <div className="relative z-10 w-28 h-20 bg-slate-900 border border-slate-700 rounded-md p-1.5 shadow-lg flex flex-col justify-between">
            <div className="flex items-center gap-1 border-b border-slate-800 pb-1">
              <span className="w-1 h-1 rounded-full bg-sky-400" />
              <span className="text-[7px] text-slate-300">wp-admin</span>
            </div>
            <div className="w-full h-8 bg-sky-900/30 border border-sky-700/40 rounded flex items-center justify-center text-[7px] text-sky-200">
              Site Editor
            </div>
            <div className="w-full h-1.5 bg-blue-500 rounded-xs" />
          </div>
        </div>
      )}

      {type === "git-github" && (
        <div className="w-full h-full bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#3f3f46] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Git Icon */}
          <div className="relative z-10 pl-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#f05032] drop-shadow-[0_0_8px_rgba(240,80,50,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.546 10.93L13.067.452a1.5 1.5 0 00-2.124 0L8.83 2.564l3.296 3.296a1.782 1.782 0 011.66 2.37l3.175 3.175a1.782 1.782 0 11-1.071 1.071L12.7 9.289v5.421a1.782 1.782 0 11-1.503 0V9.112a1.78 1.78 0 01-.98-1.558 1.78 1.78 0 01.442-1.168L7.363 3.09 0.453 10a1.5 1.5 0 000 2.124l10.478 10.479a1.5 1.5 0 002.124 0l10.491-10.492a1.5 1.5 0 000-2.18z" />
              </svg>
            </div>
          </div>

          {/* Terminal window */}
          <div className="relative z-10 w-28 h-20 bg-black/90 border border-zinc-700 rounded-md p-1.5 shadow-xl flex flex-col justify-between font-mono text-[7px]">
            <div className="flex items-center gap-1 border-b border-zinc-800 pb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-500 text-[6px] ml-1">bash</span>
            </div>
            <div className="space-y-0.5 text-zinc-300">
              <p className="text-emerald-400">$ git commit -m</p>
              <p className="text-zinc-400">&quot;feat: release&quot;</p>
              <p className="text-sky-400">$ git push origin</p>
            </div>
          </div>
        </div>
      )}

      {type === "nodejs-express" && (
        <div className="w-full h-full bg-gradient-to-br from-[#062c1e] via-[#093f2b] to-[#0e5c3e] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Node.js Icon */}
          <div className="relative z-10 pl-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-11 h-11 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L1.6 6v12L12 24l10.4-6V6L12 0zm0 2.3l8.4 4.8v9.8L12 21.7l-8.4-4.8V7.1L12 2.3z" />
              </svg>
            </div>
          </div>

          {/* Code card */}
          <div className="relative z-10 w-28 h-20 bg-slate-950 border border-emerald-500/30 rounded-md p-1.5 shadow-xl flex flex-col justify-between font-mono text-[7px]">
            <div className="flex items-center gap-1 border-b border-slate-800 pb-1">
              <span className="text-emerald-400 font-bold">server.ts</span>
            </div>
            <div className="space-y-0.5 text-slate-300">
              <p className="text-purple-400">app.use(<span className="text-emerald-300">cors()</span>);</p>
              <p className="text-purple-400">app.listen(<span className="text-amber-300">3000</span>);</p>
            </div>
            <div className="text-[6px] text-emerald-400">⚡ Server running</div>
          </div>
        </div>
      )}

      {type === "ios-android" && (
        <div className="w-full h-full bg-gradient-to-br from-[#3b0764] via-[#581c87] to-[#7e22ce] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Apple & Android Logos */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 pl-2">
            <svg className="w-6 h-6 text-white drop-shadow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.93c.66-.8 1.11-1.92.99-3.04-1.02.04-2.22.68-2.92 1.5-.6.69-1.12 1.83-.98 2.92 1.13.09 2.25-.58 2.91-1.38z" />
            </svg>
            <svg className="w-6 h-6 text-emerald-300 drop-shadow" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993 0 .5511-.4483.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5802 8.358 13.844 8.01 12 8.01c-1.844 0-3.5802.348-5.1373.9397L4.8404 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
            </svg>
          </div>

          {/* Dual Phone displays */}
          <div className="relative z-10 flex items-center -space-x-3 pr-1">
            <div className="w-13 h-20 bg-slate-900 border border-purple-300/40 rounded-lg p-1 shadow-lg transform -rotate-3 flex flex-col justify-between">
              <div className="w-3 h-0.5 bg-slate-700 rounded-full mx-auto" />
              <div className="w-full h-8 bg-purple-600/30 rounded" />
              <div className="w-full h-1 bg-purple-400 rounded-xs" />
            </div>
            <div className="w-13 h-20 bg-slate-950 border border-emerald-400/40 rounded-lg p-1 shadow-xl transform rotate-3 flex flex-col justify-between">
              <div className="w-3 h-0.5 bg-slate-700 rounded-full mx-auto" />
              <div className="w-full h-8 bg-emerald-600/30 rounded" />
              <div className="w-full h-1 bg-emerald-400 rounded-xs" />
            </div>
          </div>
        </div>
      )}

      {type === "machine-learning" && (
        <div className="w-full h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f284e] p-3 flex items-center justify-between relative overflow-hidden">
          {/* Glowing Neural Brain Icon */}
          <div className="relative z-10 pl-2">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.7)] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04z" />
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04z" />
              </svg>
            </div>
          </div>

          {/* AI Processor Chip */}
          <div className="relative z-10 w-24 h-20 bg-slate-900 border border-cyan-400/40 rounded-lg p-2 shadow-2xl flex flex-col items-center justify-center">
            <div className="w-9 h-9 border border-cyan-400 bg-cyan-950/70 rounded flex items-center justify-center text-cyan-300 font-bold text-xs shadow-inner">
              AI
            </div>
            <span className="text-[7px] text-cyan-200 mt-1 font-mono tracking-wider">NEURAL CORE</span>
          </div>
        </div>
      )}

      {/* Top Left Badge (e.g. Bestseller on React course) */}
      {badgeTag && (
        <div className="absolute top-2.5 left-2.5 z-20">
          <span className="text-[10px] font-semibold text-white bg-[#6366f1] px-2.5 py-0.5 rounded-full shadow-sm">
            {badgeTag}
          </span>
        </div>
      )}

      {/* Top Right 3-Dots Menu Button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.(e);
          }}
          className="w-6 h-6 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-xs text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="More options"
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
