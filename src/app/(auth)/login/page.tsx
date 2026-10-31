"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";
import { useAuth, DEMO_USERS } from "@/components/providers/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login("faithverse_admin");
    router.push("/");
  };

  const handleDemoSignIn = (username: string) => {
    login(username);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      <div className="glass-card bg-[#0d1527] border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8b5cf6] p-[2px]">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <span className="text-base font-black text-[#d4af37]">FV</span>
              </div>
            </div>
            <span className="text-xl font-black text-white">FaithVerse</span>
          </Link>
          <p className="text-xs text-slate-400">
            Scroll with Purpose. Share with Love. Grow Together.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email Address:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password:</label>
              <Link href="/forgot-password" className="text-[11px] text-[#d4af37] hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d4af37] to-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Sign In to FaithVerse
          </button>
        </form>

        {/* One-Click Demo Role Switcher */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Instant One-Click Demo Access
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => handleDemoSignIn(u.username)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors flex items-center gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.avatarUrl} alt={u.fullName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate text-[11px]">{u.fullName.split(" ")[0]}</p>
                  <p className="text-[9px] text-[#d4af37] truncate">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#d4af37] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
