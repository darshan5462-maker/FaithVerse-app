"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft, Database, UserCheck, Shield } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdminOrMod, switchUser } = useAuth();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      {/* Dedicated Admin Header */}
      <header className="border-b border-white/[0.08] bg-[#0c0f18]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e5b842] to-amber-600 flex items-center justify-center text-black font-black shadow-md">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">FaithVerse Admin Portal</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Supabase Connected
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Content Moderation, User Verification & Safety Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Admin Identity Badge */}
          {user && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatarUrl} alt={user.fullName} className="w-6 h-6 rounded-full object-cover" />
              <div className="text-left">
                <p className="text-xs font-semibold text-white truncate max-w-[120px]">{user.fullName}</p>
                <p className="text-[9px] text-[#e5b842] font-mono leading-none">{user.role}</p>
              </div>
            </div>
          )}

          {/* Return to Community */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Community</span>
          </Link>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-white/[0.06] py-4 text-center text-xs text-slate-500">
        FaithVerse Platform Moderation System &bull; Active Supabase PostgreSQL Cluster &bull; Strict Review Policy Enforced
      </footer>
    </div>
  );
}
