"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ShieldCheck, Globe } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";

export default function MobileHeader() {
  const { user, isAdminOrMod } = useAuth();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    if (language === "en") setLanguage("kn");
    else if (language === "kn") setLanguage("hi");
    else setLanguage("en");
  };

  return (
    <header className="lg:hidden sticky top-0 left-0 right-0 h-14 bg-[#070b14]/90 border-b border-white/10 backdrop-blur-xl z-30 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#8b5cf6] p-[2px]">
          <div className="w-full h-full bg-[#070b14] rounded-[6px] flex items-center justify-center">
            <span className="text-xs font-black text-[#d4af37]">FV</span>
          </div>
        </div>
        <span className="font-bold text-white text-base">FaithVerse</span>
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="uppercase font-semibold">{language}</span>
        </button>

        <Link
          href="/bible"
          className="p-1.5 rounded-lg bg-white/5 text-amber-300 border border-amber-500/20"
          title="Daily Bible Verse"
        >
          <BookOpen className="w-4 h-4" />
        </Link>

        {isAdminOrMod && (
          <Link
            href="/admin"
            className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/40"
            title="Admin Moderation"
          >
            <ShieldCheck className="w-4 h-4" />
          </Link>
        )}

        {user ? (
          <Link href={`/profile/${user.username}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/50"
            />
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-xs px-2.5 py-1 rounded-lg bg-[#d4af37] text-black font-semibold"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
