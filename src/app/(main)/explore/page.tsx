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
      <div className="pro-card p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#e5b842] tracking-wider uppercase">
          <Compass className="w-4 h-4 text-[#e5b842]" />
          <span>Global Discovery & Search</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Explore FaithVerse</h1>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teachings, scriptures, #hashtags, creators, churches..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
          />
        </div>

        {/* Quick topic pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {["#GraceUnbounded", "#BibleStudy", "#WorshipTogether", "Healing", "Peace", "Testimony"].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] whitespace-nowrap transition-colors"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            {query ? `Search results for "${query}"` : "Trending Discoveries Across FaithVerse"}
          </span>
          <span>{results.length} approved items</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Searching platform...</div>
        ) : results.length === 0 ? (
          <div className="pro-card p-12 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#e5b842] mx-auto opacity-70" />
            <h3 className="text-sm font-semibold text-white">No Matching Content</h3>
            <p className="text-xs text-slate-400">Try searching for other keywords, verses, or tags.</p>
          </div>
        ) : (
          results.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
