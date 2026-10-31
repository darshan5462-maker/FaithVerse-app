"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, Film, User, HeartHandshake } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/explore", label: t.nav.explore, icon: Compass },
    { href: "/create", label: "Create", icon: Plus, isAction: true },
    { href: "/reels", label: t.nav.reels, icon: Film },
    { href: "/prayers", label: t.nav.prayers, icon: HeartHandshake },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#070b14]/95 border-t border-white/10 backdrop-blur-xl z-40 px-3 flex items-center justify-around">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        if (link.isAction) {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative -top-3 w-12 h-12 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] p-[2px] shadow-lg shadow-amber-500/25 active:scale-95 transition-transform"
            >
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                <Plus className="w-6 h-6 text-[#d4af37]" />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
              isActive ? "text-[#d4af37]" : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
