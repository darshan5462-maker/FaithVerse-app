"use client";

import React, { useState, useEffect } from "react";
import StoriesBar from "@/components/feed/StoriesBar";
import CreatePostWidget from "@/components/feed/CreatePostWidget";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";
import { Sparkles, TrendingUp, Users, Clock, Filter, ShieldCheck, HeartHandshake } from "lucide-react";

export default function HomeFeedPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState<"forYou" | "following" | "trending" | "latest">("forYou");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tab: activeTab,
        category: selectedCategory,
        userId: user?.id || "",
      });
      const res = await fetch(`/api/posts?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab, selectedCategory, user?.id]);

  const categories = [
    { key: "ALL", label: "All Insights" },
    { key: "BIBLE_TEACHING", label: "Bible Teachings" },
    { key: "WORSHIP_MUSIC", label: "Worship & Gospel" },
    { key: "TESTIMONY", label: "Testimonies" },
    { key: "PRAYER", label: "Prayer Requests" },
    { key: "INSPIRATION", label: "Inspirations" },
    { key: "COMMUNITY", label: "Discussions" },
  ];

  return (
    <div className="space-y-4">
      {/* 24-Hour Stories Bar */}
      <StoriesBar />

      {/* Quick Create Post Box */}
      <CreatePostWidget onPostCreated={fetchPosts} />

      {/* Feed Tabs: For You, Following, Trending, Latest */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1 sm:gap-3 text-xs sm:text-sm font-semibold">
          {[
            { key: "forYou", label: t.feed.forYou, icon: Sparkles },
            { key: "following", label: t.feed.following, icon: Users },
            { key: "trending", label: t.feed.trending, icon: TrendingUp },
            { key: "latest", label: t.feed.latest, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/40 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#d4af37]" : "text-slate-500"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === cat.key
                ? "bg-white text-black font-bold shadow"
                : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="pt-2">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="glass-card bg-[#0d1527]/50 p-6 rounded-2xl animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-32 h-3 bg-white/10 rounded" />
                    <div className="w-20 h-2.5 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-white/5 rounded-xl" />
                <div className="w-full h-48 bg-white/10 rounded-xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/40 p-12 text-center rounded-2xl border border-white/5 space-y-3">
            <HeartHandshake className="w-12 h-12 text-[#d4af37] mx-auto opacity-70" />
            <h3 className="text-base font-bold text-white">No Public Posts in this Stream</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Be the first to share an encouraging message or Bible teaching. Every post is verified before appearing publicly.
            </p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onPostUpdated={fetchPosts} />
          ))
        )}
      </div>
    </div>
  );
}
