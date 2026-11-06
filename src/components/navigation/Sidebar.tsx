"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Film,
  Tv,
  Plus,
  MessageCircle,
  BookOpen,
  HeartHandshake,
  Sparkles,
  Church,
  Calendar,
  Headphones,
  ShieldCheck,
  User,
  Globe,
  ChevronDown,
  Check,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";
import { SupportedLanguage } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAdminOrMod, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const navItems = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/explore", label: t.nav.explore, icon: Compass },
    { href: "/reels", label: t.nav.reels, icon: Film, badge: "Reels" },
    { href: "/videos", label: t.nav.videos, icon: Tv },
    { href: "/messages", label: t.nav.messages, icon: MessageCircle },
    { href: "/bible", label: t.nav.bible, icon: BookOpen },
    { href: "/prayers", label: t.nav.prayers, icon: HeartHandshake, badge: "Wall" },
    { href: "/testimonies", label: t.nav.testimonies, icon: Sparkles },
    { href: "/churches", label: t.nav.churches, icon: Church },
    { href: "/events", label: t.nav.events, icon: Calendar },
    { href: "/audio", label: t.nav.audio, icon: Headphones },
  ];

  if (user && isAdminOrMod) {
    navItems.push({
      href: "/admin",
      label: t.nav.admin,
      icon: ShieldCheck,
      badge: "Admin",
    });
  }

  const languages: { code: SupportedLanguage; label: string }[] = [
    { code: "en", label: "English" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)" },
    { code: "hi", label: "हिन्दी (Hindi)" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-white/[0.08] bg-[#090a0f] px-4 py-5 overflow-y-auto select-none z-30">
      {/* Sleek Minimalist Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-2 mb-6 group">
        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.png" alt="FaithVerse Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold tracking-tight text-white">
              FaithVerse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e5b842]" />
          </div>
          <p className="text-[11px] text-slate-400">
            Scroll with Purpose
          </p>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/[0.08] text-white font-semibold"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-[#e5b842]" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300 border border-white/[0.08]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Action: Clean, Professional Create Post Button */}
      <div className="mt-4 mb-4">
        <Link
          href="/create"
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-white text-black flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-[0.98] transition-all shadow-sm"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Post</span>
        </Link>
      </div>

      {/* Footer Area: Language & Persona Switcher */}
      <div className="pt-3 border-t border-white/[0.08] space-y-2">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-400 bg-white/[0.03] hover:bg-white/[0.06] hover:text-white rounded-lg border border-white/[0.06] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{languages.find((l) => l.code === language)?.label}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {showLangDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#121620] border border-white/[0.12] rounded-xl shadow-2xl p-1 z-50 animate-fade-in">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                    language === l.code
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{l.label}</span>
                  {language === l.code && <Check className="w-3.5 h-3.5 text-[#e5b842]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Account or Sign In */}
        {user ? (
          <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-2">
            <Link
              href={`/profile/${user.username}`}
              className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-8 h-8 rounded-full object-cover border border-white/[0.12]"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.fullName}</p>
                <p className="text-[10px] text-slate-400 truncate">@{user.username}</p>
              </div>
            </Link>
            <button
              onClick={logout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-white">Join the Community</p>
              <p className="text-[11px] text-slate-400">Share prayers, stories & connect.</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/login"
                className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-white text-black text-center hover:bg-slate-200 transition-colors shadow-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="w-full py-2 px-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] text-center border border-white/[0.08] transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
