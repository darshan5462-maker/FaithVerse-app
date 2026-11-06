"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useAuth, DEMO_USERS } from "@/components/providers/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithCredentials, login } = useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRealLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginWithCredentials(emailOrUsername, password);
      if (res.success) {
        router.push("/");
      } else {
        setError(res.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = (username: string) => {
    login(username);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#090a0f] flex items-center justify-center p-4">
      <div className="pro-card max-w-md w-full p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/[0.12] flex items-center justify-center">
              <span className="text-base font-bold text-[#e5b842]">FV</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FaithVerse</span>
          </Link>
          <p className="text-xs text-slate-400">
            Scroll with Purpose. Share with Love. Grow Together.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Real Authentication Form */}
        <form onSubmit={handleRealLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Email or Username:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="you@domain.com or username"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password:</label>
              <span className="text-[11px] text-[#e5b842]">Secured by Supabase</span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl font-semibold text-xs bg-white text-black hover:bg-slate-200 disabled:opacity-50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{loading ? "Signing in..." : "Sign In to FaithVerse"}</span>
          </button>
        </form>

        {/* One-Click Quick Role Switcher */}
        <div className="space-y-3 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Instant One-Click Test Accounts
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#e5b842]" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_USERS.map((u) => (
              <button
                key={u.username}
                type="button"
                onClick={() => handleDemoSignIn(u.username)}
                className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-left transition-colors flex items-center gap-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.avatarUrl} alt={u.fullName} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate text-[11px]">{u.fullName.split(" ")[0]}</p>
                  <p className="text-[9px] text-[#e5b842] truncate">{u.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-[#e5b842] font-semibold hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
