"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Sparkles, HeartHandshake, TrendingUp, Check, Share2, Copy } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageContext";
import { useAuth } from "@/components/providers/AuthContext";

export default function RightWidgets() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [dailyVerse, setDailyVerse] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [prayedSpotlight, setPrayedSpotlight] = useState(false);
  const [spotlightCount, setSpotlightCount] = useState(14);

  useEffect(() => {
    fetch("/api/bible")
      .then((res) => res.json())
      .then((data) => {
        if (data.dailyVerse) setDailyVerse(data.dailyVerse);
      })
      .catch(() => {});
  }, []);

  const getVerseText = () => {
    if (!dailyVerse) return "Loading today's Scripture...";
    if (language === "kn") return dailyVerse.textKannada;
    if (language === "hi") return dailyVerse.textHindi;
    return dailyVerse.textEnglish;
  };

  const copyVerse = () => {
    if (!dailyVerse) return;
    const shareText = `"${getVerseText()}" — ${dailyVerse.book} ${dailyVerse.chapter}:${dailyVerse.verse} (via FaithVerse)`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePraySpotlight = () => {
    setPrayedSpotlight(true);
    setSpotlightCount((c) => c + 1);
  };

  return (
    <aside className="hidden xl:flex flex-col w-80 2xl:w-88 h-screen sticky top-0 border-l border-white/10 bg-[#070b14]/70 backdrop-blur-xl px-5 py-5 overflow-y-auto space-y-6 select-none z-20">
      {/* 1. Daily Scripture Card */}
      <div className="glass-card bg-gradient-to-br from-[#0d1527] to-[#131e3a] p-4.5 rounded-2xl border border-[#d4af37]/35 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#d4af37]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#d4af37]/20 transition-all" />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
            <BookOpen className="w-4 h-4 text-[#d4af37]" />
            <span>{t.dailyVerse.title}</span>
          </div>
          {dailyVerse && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f3d478] border border-[#d4af37]/30">
              {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
            </span>
          )}
        </div>

        <p className="text-sm font-medium text-slate-100 italic leading-relaxed mb-3">
          &ldquo;{getVerseText()}&rdquo;
        </p>

        {dailyVerse?.explanation && (
          <p className="text-xs text-slate-400 line-clamp-2 mb-3">
            {dailyVerse.explanation}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <button
            onClick={copyVerse}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#d4af37] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>

          <Link
            href="/bible"
            className="text-xs font-medium text-[#d4af37] hover:underline"
          >
            Read Chapter &rarr;
          </Link>
        </div>
      </div>

      {/* 2. Prayer Spotlight Widget */}
      <div className="glass-card bg-[#0d1527]/80 p-4.5 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wide">
            <HeartHandshake className="w-4 h-4 text-purple-400" />
            <span>Intercession Spotlight</span>
          </div>
          <Link href="/prayers" className="text-[11px] text-[#d4af37] hover:underline">
            View Wall
          </Link>
        </div>

        <h4 className="text-xs font-semibold text-white mb-1">
          Career transition & peace of mind
        </h4>
        <p className="text-[11px] text-slate-300 line-clamp-2 mb-3">
          &ldquo;Facing an unexpected career change. Asking for God&apos;s clear direction and peace...&rdquo;
        </p>

        <button
          onClick={handlePraySpotlight}
          className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            prayedSpotlight
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
          }`}
        >
          <HeartHandshake className={`w-3.5 h-3.5 ${prayedSpotlight ? "text-emerald-400" : "text-amber-400"}`} />
          <span>
            {prayedSpotlight ? "You Prayed for This!" : `Pray for David (${spotlightCount} prayed)`}
          </span>
        </button>
      </div>

      {/* 3. Trending Faith Topics */}
      <div className="glass-card bg-[#0d1527]/70 p-4.5 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wide mb-3">
          <TrendingUp className="w-4 h-4 text-[#d4af37]" />
          <span>Trending Purpose Topics</span>
        </div>

        <div className="space-y-2.5">
          {[
            { tag: "GraceUnbounded", posts: "1.2k posts", cat: "Theology" },
            { tag: "BibleStudy", posts: "3.4k posts", cat: "Scripture" },
            { tag: "WorshipTogether", posts: "890 posts", cat: "Music" },
            { tag: "PrayerRequest", posts: "2.1k prayers", cat: "Community" },
          ].map((topic) => (
            <Link
              key={topic.tag}
              href={`/explore?q=${topic.tag}`}
              className="flex items-center justify-between group py-1"
            >
              <div>
                <p className="text-xs font-semibold text-white group-hover:text-[#d4af37] transition-colors">
                  #{topic.tag}
                </p>
                <p className="text-[10px] text-slate-400">{topic.cat}</p>
              </div>
              <span className="text-[11px] text-slate-500 group-hover:text-slate-300">
                {topic.posts}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Platform Vision Footer */}
      <div className="px-2 text-[11px] text-slate-500 space-y-1">
        <p className="leading-relaxed">
          FaithVerse &copy; 2026. Global community open to all.
        </p>
        <div className="flex flex-wrap gap-2 text-slate-400">
          <Link href="/about" className="hover:text-white">About</Link>
          <span>&bull;</span>
          <Link href="/guidelines" className="hover:text-white">Moderation Rules</Link>
          <span>&bull;</span>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
        </div>
      </div>
    </aside>
  );
}
