"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Compass, CheckCircle2, TrendingUp, Sparkles, BookOpen, Church } from "lucide-react";
import PostCard from "@/components/feed/PostCard";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async (searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?tab=trending`);
      const data = await res.json();
      if (data.success) {
        if (!searchTerm.trim()) {
          setResults(data.posts);
        } else {
          const lower = searchTerm.toLowerCase();
          const filtered = data.posts.filter(
            (p: any) =>
              p.content.toLowerCase().includes(lower) ||
              p.author.fullName.toLowerCase().includes(lower) ||
              p.author.username.toLowerCase().includes(lower) ||
              p.category.toLowerCase().includes(lower)
          );
          setResults(filtered);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch(query);
  }, [query]);

  return (
    <div className="space-y-6">
      {/* Header & Search Bar */}
      <div className="glass-card bg-[#0d1527] p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
          <Compass className="w-4 h-4 text-[#d4af37]" />
          <span>Global Discovery & Search</span>
        </div>
        <h1 className="text-2xl font-black text-white">Explore FaithVerse</h1>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachings, scriptures, #hashtags, creators, churches..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Quick topic pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {["#GraceUnbounded", "#BibleStudy", "#WorshipTogether", "Healing", "Peace", "Testimony"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>
            {query ? `Search results for "${query}"` : "Trending Discoveries Across FaithVerse"}
          </span>
          <span>{results.length} approved items</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Searching platform...</div>
        ) : results.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/40 p-12 text-center rounded-2xl border border-white/5 space-y-2">
            <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-white">No Matching Content</h3>
            <p className="text-xs text-slate-400">Try searching for other keywords, verses, or tags.</p>
          </div>
        ) : (
          results.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
