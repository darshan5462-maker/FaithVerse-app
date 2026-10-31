"use client";

import React from "react";
import { ShieldCheck, Heart, Users, CheckCircle2, AlertTriangle, Scale } from "lucide-react";
import Link from "next/link";

export default function GuidelinesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card bg-[#0d1527] p-6 rounded-3xl border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
          <Scale className="w-4 h-4 text-[#d4af37]" />
          <span>Platform Standards & Governance</span>
        </div>
        <h1 className="text-2xl font-black text-white">Community Guidelines & Content Approval</h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          At FaithVerse, every post has a purpose. Learn how our mandatory moderation process protects believers, seekers, and creators worldwide.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Open to All People",
            desc: "Anyone from any country, background, or religious tradition is welcome to participate and explore ancient wisdom.",
            icon: Users,
            color: "text-blue-400 border-blue-500/30",
          },
          {
            title: "Mandatory Human Moderation",
            desc: "Every public submission enters a pending review queue to ensure respect, authentic doctrine, and protection against malicious bots.",
            icon: ShieldCheck,
            color: "text-[#d4af37] border-[#d4af37]/30",
          },
          {
            title: "Grace & Truth in Tone",
            desc: "We encourage vigorous discussions conducted with kindness, humility, and biblical charity (Ephesians 4:15).",
            icon: Heart,
            color: "text-rose-400 border-rose-500/30",
          },
          {
            title: "Zero Tolerance for Scams",
            desc: "Unverified commercial appeals, crypto schemes, and deceptive fundraising are immediately rejected.",
            icon: AlertTriangle,
            color: "text-orange-400 border-orange-500/30",
          },
        ].map((p, idx) => {
          const Icon = p.icon;
          return (
            <div key={idx} className={`glass-card bg-[#0d1527]/80 p-5 rounded-2xl border ${p.color} space-y-2`}>
              <Icon className="w-5 h-5 text-amber-400 mb-1" />
              <h3 className="text-sm font-bold text-white">{p.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Moderation Workflow Explanation */}
      <div className="glass-card bg-[#0d1527]/90 p-6 rounded-3xl border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white">The Submission Lifecycle</h2>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs flex-shrink-0">
              1
            </span>
            <div>
              <strong className="text-white block mb-0.5">Submission & Queueing</strong>
              When you post a photo, video, or testimony, your content is securely saved with status <code>PENDING</code>.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs flex-shrink-0">
              2
            </span>
            <div>
              <strong className="text-white block mb-0.5">Human Review</strong>
              FaithVerse moderators inspect the text, media, categories, and references against our safety checklist.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="w-6 h-6 rounded-full bg-[#d4af37] text-black font-bold flex items-center justify-center text-xs flex-shrink-0">
              3
            </span>
            <div>
              <strong className="text-white block mb-0.5">Approval & Distribution</strong>
              Upon approval, your post immediately appears on the global Home Feed, hashtags, and your public profile.
            </div>
          </div>
        </div>

        <div className="pt-2 text-center">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d4af37] to-amber-500 text-black shadow-lg hover:scale-105 transition-transform"
          >
            Create a Post Now
          </Link>
        </div>
      </div>
    </div>
  );
}
