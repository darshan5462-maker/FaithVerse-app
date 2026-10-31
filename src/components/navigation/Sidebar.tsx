"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Film,
  Tv,
  PlusSquare,
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
  Sun,
  Moon,
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
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const [showLangDropdown, setShowLangDropdown] = React.useState(false);

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

  const languages: { code: SupportedLanguage; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "EN" },
    { code: "kn", label: "ಕನ್ನಡ (Kannada)", flag: "KN" },
    { code: "hi", label: "हिन्दी (Hindi)", flag: "HI" },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 xl:w-72 h-screen sticky top-0 border-r border-white/10 bg-[#070b14]/90 backdrop-blur-xl px-4 py-5 overflow-y-auto select-none z-30">
      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 px-2 mb-6 group">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] p-[2px] shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
          <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
            <span className="text-lg font-black tracking-tighter text-[#d4af37]">FV</span>
          </div>
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-amber-200 bg-clip-text text-transparent">
            FaithVerse
          </span>
          <p className="text-[10px] font-medium text-[#d4af37]/80 tracking-wide">
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/15 to-purple-600/10 text-white border border-[#d4af37]/30 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? "text-[#d4af37]" : "text-slate-400 group-hover:text-amber-400"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Action: Create Post Button */}
      <div className="mt-4 mb-4">
        <Link
          href="/create"
          className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <PlusSquare className="w-5 h-5" />
          <span>{t.nav.create}</span>
        </Link>
      </div>

      {/* Language & Demo Switcher Section */}
      <div className="pt-3 border-t border-white/10 space-y-2">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowLangDropdown(!showLangDropdown);
              setShowUserDropdown(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-300 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4af37]" />
              <span>{languages.find((l) => l.code === language)?.label}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showLangDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 glass-card bg-[#0d1527] border border-white/15 rounded-xl shadow-2xl p-1 z-50 animate-fade-in">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                    language === l.code
                      ? "bg-[#d4af37]/20 text-[#f3d478] font-semibold"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  <span>{l.label}</span>
                  {language === l.code && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Demo Role Switcher (Super Admin, Mod, Pastor, User) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowLangDropdown(false);
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {user ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-[#d4af37]/50"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-300" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user ? user.fullName : "Guest Visitor"}
                </p>
                <p className="text-[10px] text-[#d4af37] font-medium tracking-tight">
                  Role: {role}
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          </button>

          {showUserDropdown && (
            <div className="absolute bottom-full left-0 right-0 mb-1 glass-card bg-[#0d1527] border border-white/15 rounded-xl shadow-2xl p-1.5 z-50 animate-fade-in space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Switch Role / Persona
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
                      ? "bg-[#d4af37]/20 text-[#f3d478] font-medium"
                      : "text-slate-300 hover:bg-white/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u.avatarUrl} alt={u.fullName} className="w-6 h-6 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{u.fullName}</p>
                    <p className="text-[10px] text-slate-400">{u.role}</p>
                  </div>
                  {user?.username === u.username && <Check className="w-3.5 h-3.5 text-[#d4af37]" />}
                </button>
              ))}
              <button
                onClick={() => {
                  switchUser("guest");
                  setShowUserDropdown(false);
                }}
                className={`w-full flex items-center gap-2 p-1.5 rounded-lg text-left text-xs transition-colors ${
                  role === "GUEST" ? "bg-white/15 text-white" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-slate-300" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Guest Mode</p>
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
