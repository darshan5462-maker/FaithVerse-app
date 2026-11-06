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
    <header className="lg:hidden sticky top-0 left-0 right-0 h-14 bg-[#090a0f]/95 border-b border-white/[0.08] backdrop-blur-xl z-30 px-4 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#e5b842] flex items-center justify-center">
          <span className="text-xs font-black text-black">FV</span>
        </div>
        <span className="font-bold text-white text-base">FaithVerse</span>
      </Link>

      <div className="flex items-center gap-2.5">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-300"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="uppercase font-semibold">{language}</span>
        </button>

        <Link
          href="/bible"
          className="p-1.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08]"
          title="Daily Bible Verse"
        >
          <BookOpen className="w-4 h-4" />
        </Link>

        {user && isAdminOrMod && (
          <Link
            href="/admin"
            className="p-1.5 rounded-lg bg-white/[0.08] text-[#e5b842] border border-white/[0.12]"
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
              className="w-7 h-7 rounded-full object-cover border border-white/[0.15]"
            />
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-xs px-3 py-1 rounded-lg bg-white text-black font-semibold"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
