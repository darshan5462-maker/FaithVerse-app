"use client";

import React, { useState, useEffect } from "react";
import StoriesBar from "@/components/feed/StoriesBar";
import CreatePostWidget from "@/components/feed/CreatePostWidget";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";
import { Sparkles, TrendingUp, Users, Clock, HeartHandshake } from "lucide-react";

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
    { key: "ALL", label: "All" },
    { key: "BIBLE_TEACHING", label: "Bible Teachings" },
    { key: "WORSHIP_MUSIC", label: "Worship" },
    { key: "TESTIMONY", label: "Testimonies" },
    { key: "PRAYER", label: "Prayers" },
    { key: "INSPIRATION", label: "Inspirations" },
    { key: "COMMUNITY", label: "Discussions" },
  ];

  return (
    <div className="space-y-4">
      {/* 24-Hour Stories Bar */}
      <StoriesBar />

      {/* Modern, Clean Post Composer */}
      <CreatePostWidget onPostCreated={fetchPosts} />

      {/* Main Feed Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-1">
        <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
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
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                  isActive
                    ? "bg-white/[0.08] text-white font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#e5b842]" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-colors ${
              selectedCategory === cat.key
                ? "bg-white text-black font-semibold shadow-sm"
                : "bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Posts Stream */}
      <div className="pt-1">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="bg-[#11141d] border border-white/[0.08] p-5 rounded-2xl animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/[0.08]" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-32 h-3 bg-white/[0.08] rounded" />
                    <div className="w-20 h-2 bg-white/[0.04] rounded" />
                  </div>
                </div>
                <div className="w-full h-12 bg-white/[0.04] rounded-xl" />
                <div className="w-full h-48 bg-white/[0.06] rounded-xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-[#11141d] border border-white/[0.08] p-12 text-center rounded-2xl space-y-2">
            <HeartHandshake className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Public Posts Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Share an encouraging message, testimony, or prayer request to start a conversation.
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
