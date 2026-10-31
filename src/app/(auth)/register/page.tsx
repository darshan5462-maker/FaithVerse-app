"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Globe, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [religion, setReligion] = useState("Open to explore");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login("david_seeker");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex items-center justify-center p-4">
      <div className="glass-card bg-[#0d1527] border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8b5cf6] p-[2px]">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <span className="text-base font-black text-[#d4af37]">FV</span>
              </div>
            </div>
            <span className="text-xl font-black text-white">Join FaithVerse</span>
          </Link>
          <p className="text-xs text-slate-400">
            Open to everyone, regardless of religion, background, or nationality.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name:</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Rachel Thomas"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Username:</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rachel_grace"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Religious Background (Optional / Open to all):
            </label>
            <select
              value={religion}
              onChange={(e) => setReligion(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            >
              <option value="Christian" className="bg-[#0d1527]">Christian</option>
              <option value="Open to explore" className="bg-[#0d1527]">Open to explore / Inquirer</option>
              <option value="Other faith background" className="bg-[#0d1527]">Other faith background</option>
              <option value="Prefer not to say" className="bg-[#0d1527]">Prefer not to say</option>
            </select>
          </div>

          <div className="bg-[#d4af37]/10 p-3 rounded-xl border border-[#d4af37]/30 text-[10px] text-amber-200 leading-tight">
            <span className="font-bold">FaithVerse Charter:</span> We never require users to prove their religion. Everyone is welcome to participate and explore.
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d4af37] to-amber-500 text-black shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create My Account
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-[#d4af37] font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
