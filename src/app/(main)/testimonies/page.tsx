"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, HeartHandshake, Quote, Plus } from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import Link from "next/link";

export default function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts?category=TESTIMONY")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts) {
          setTestimonies(data.posts);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card bg-[#0d1527] p-6 rounded-3xl border border-white/10 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-[#d4af37]" />
          <span>Christian Testimonies & Journeys</span>
        </div>
        <h1 className="text-2xl font-black text-white">Stories of Grace & Transformation</h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          Read real-life experiences of answered prayers, miraculous healing, hope restored, and discovering purpose through Christ.
        </p>

        <div className="pt-2">
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] text-black shadow-md hover:bg-amber-400 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Testimony</span>
          </Link>
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading testimonies...</div>
        ) : testimonies.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/40 p-12 text-center rounded-2xl border border-white/5 space-y-2">
            <Quote className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-white">Be the First to Testify</h3>
            <p className="text-xs text-slate-400">
              Submit your testimony in the Creator Studio to inspire believers across the globe.
            </p>
          </div>
        ) : (
          testimonies.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
