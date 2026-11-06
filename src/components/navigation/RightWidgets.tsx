"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, HeartHandshake, TrendingUp, Check, Copy } from "lucide-react";
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
    <aside className="hidden xl:flex flex-col w-80 2xl:w-88 h-screen sticky top-0 border-l border-white/[0.08] bg-[#090a0f] px-5 py-5 overflow-y-auto space-y-5 select-none z-20">
      {/* 1. Daily Scripture Card - Clean Editorial Quote */}
      <div className="bg-[#11141d] p-4.5 rounded-2xl border border-white/[0.08] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-[#e5b842]" />
            <span>Daily Scripture</span>
          </div>
          {dailyVerse && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
              {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-200 italic leading-relaxed">
          &ldquo;{getVerseText()}&rdquo;
        </p>

        {dailyVerse?.explanation && (
          <p className="text-[11px] text-slate-400 line-clamp-2">
            {dailyVerse.explanation}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
          <button
            onClick={copyVerse}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Share"}</span>
          </button>

          <Link
            href="/bible"
            className="font-medium text-[#e5b842] hover:underline"
          >
            Read Chapter &rarr;
          </Link>
        </div>
      </div>

      {/* 2. Prayer Spotlight Widget */}
      <div className="bg-[#11141d] p-4.5 rounded-2xl border border-white/[0.08] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-400" />
            <span>Prayer Spotlight</span>
          </div>
          <Link href="/prayers" className="text-[11px] text-[#e5b842] hover:underline">
            View Wall
          </Link>
        </div>

        <h4 className="text-xs font-bold text-white">
          Career transition & peace of mind
        </h4>
        <p className="text-[11px] text-slate-400 line-clamp-2">
          &ldquo;Facing an unexpected career change. Asking for God&apos;s clear direction and peace...&rdquo;
        </p>

        <button
          onClick={handlePraySpotlight}
          className={`w-full py-2 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
            prayedSpotlight
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08]"
          }`}
        >
          <HeartHandshake className={`w-3.5 h-3.5 ${prayedSpotlight ? "text-emerald-400" : "text-[#e5b842]"}`} />
          <span>
            {prayedSpotlight ? "You Prayed for This" : `Pray for David (${spotlightCount} prayed)`}
          </span>
        </button>
      </div>

      {/* 3. Trending Faith Topics */}
      <div className="bg-[#11141d] p-4.5 rounded-2xl border border-white/[0.08] space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-[#e5b842]" />
          <span>Trending Topics</span>
        </div>

        <div className="space-y-2">
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
                <p className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  #{topic.tag}
                </p>
                <p className="text-[10px] text-slate-500">{topic.cat}</p>
              </div>
              <span className="text-[11px] text-slate-500 group-hover:text-slate-400">
                {topic.posts}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Clean Minimal Footer */}
      <div className="px-1 text-[11px] text-slate-500 space-y-1">
        <p>FaithVerse &copy; 2026. Global community open to all.</p>
        <div className="flex flex-wrap gap-2 text-slate-500">
          <Link href="/guidelines" className="hover:text-slate-300">Moderation Rules</Link>
          <span>&bull;</span>
          <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
        </div>
      </div>
    </aside>
  );
}
