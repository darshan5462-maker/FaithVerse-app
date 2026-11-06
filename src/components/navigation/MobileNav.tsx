"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, Film, HeartHandshake } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageContext";

export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const links = [
    { href: "/", label: t.nav.home, icon: Home },
    { href: "/explore", label: t.nav.explore, icon: Compass },
    { href: "/create", label: "Create", icon: Plus, isAction: true },
    { href: "/reels", label: t.nav.reels, icon: Film },
    { href: "/prayers", label: t.nav.prayers, icon: HeartHandshake },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#090a0f]/95 border-t border-white/[0.08] backdrop-blur-xl z-40 px-3 flex items-center justify-around">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        if (link.isAction) {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative -top-2 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
              isActive ? "text-white font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Icon className={`w-4.5 h-4.5 ${isActive ? "text-[#e5b842]" : "text-slate-400"}`} />
            <span className="text-[10px]">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
