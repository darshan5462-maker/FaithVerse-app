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
} from "lucide-react";
import { useAuth, DEMO_USERS } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";
import { SupportedLanguage } from "@/lib/i18n";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, role, isAdminOrMod, switchUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
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

  if (isAdminOrMod) {
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
        <div className="w-9 h-9 rounded-xl bg-[#e5b842] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
          <span className="text-sm font-black text-black tracking-tight">FV</span>
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
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowUserDropdown(false);
            }}
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

        {/* Demo Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowLangDropdown(false);
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {user ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-white/[0.12]"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user ? user.fullName : "Guest Mode"}
                </p>
                <p className="text-[10px] text-slate-400">
                  Role: <span className="text-[#e5b842]">{role}</span>
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          </button>

          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#121620] border border-white/[0.12] rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Select Test Persona
              </div>
              {DEMO_USERS.map((u) => (
                <button
                  key={u.username}
                  onClick={() => {
                    switchUser(u.username);
                    setShowUserDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition-colors ${
                    user?.username === u.username
                      ? "bg-white/[0.08] text-white font-medium"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.avatarUrl} alt={u.fullName} className="w-6 h-6 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{u.fullName}</p>
                    <p className="text-[10px] text-slate-500">{u.role}</p>
                  </div>
                  {user?.username === u.username && <Check className="w-3.5 h-3.5 text-[#e5b842]" />}
                </button>
              ))}
              <button
                onClick={() => {
                  switchUser("guest");
                  setShowUserDropdown(false);
                }}
                className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition-colors ${
                  role === "GUEST" ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.04]"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">Guest Mode</p>
                  <p className="text-[10px] text-slate-500">Unauthenticated view</p>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
