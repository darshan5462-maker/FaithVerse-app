"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Compass,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Users,
  Grid,
  MapPin,
  Heart,
  Loader2,
  UserPlus,
  UserCheck,
} from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/components/providers/AuthContext";
import { formatNumberCompact } from "@/lib/utils";

export default function ExplorePage() {
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"posts" | "people">("posts");
  const [query, setQuery] = useState("");

  // Post search state
  const [postsResults, setPostsResults] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // People / Creator search state
  const [usersResults, setUsersResults] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [followerCountMap, setFollowerCountMap] = useState<Record<string, number>>({});

  // Search posts
  const performPostSearch = async (searchTerm: string) => {
    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/posts?tab=trending`);
      const data = await res.json();
      if (data.success) {
        if (!searchTerm.trim()) {
          setPostsResults(data.posts);
        } else {
          const lower = searchTerm.toLowerCase();
          const filtered = data.posts.filter(
            (p: any) =>
              p.content.toLowerCase().includes(lower) ||
              p.author.fullName.toLowerCase().includes(lower) ||
              p.author.username.toLowerCase().includes(lower) ||
              p.category.toLowerCase().includes(lower)
          );
          setPostsResults(filtered);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  // Search users / creators
  const performUserSearch = async (searchTerm: string) => {
    setLoadingUsers(true);
    try {
      const url = currentUser
        ? `/api/users/search?q=${encodeURIComponent(searchTerm)}&currentUserId=${currentUser.id}`
        : `/api/users/search?q=${encodeURIComponent(searchTerm)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.users) {
        setUsersResults(data.users);

        // Prepopulate following map
        const newMap: Record<string, boolean> = {};
        const countMap: Record<string, number> = {};
        data.users.forEach((u: any) => {
          newMap[u.id] = Boolean(u.isFollowing);
          countMap[u.id] = u.followersCount ?? 0;
        });
        setFollowingMap((prev) => ({ ...prev, ...newMap }));
        setFollowerCountMap((prev) => ({ ...prev, ...countMap }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    performPostSearch(query);
    performUserSearch(query);
  }, [query]);

  // Handle follow / unfollow for a user in the search list
  const handleToggleFollow = async (targetUserId: string, targetName: string) => {
    if (!currentUser) {
      alert("Please log in or select a demo persona to follow members.");
      return;
    }

    const currentStatus = followingMap[targetUserId] || false;
    const currentCount = followerCountMap[targetUserId] || 0;

    // Optimistic UI update
    setFollowingMap((prev) => ({ ...prev, [targetUserId]: !currentStatus }));
    setFollowerCountMap((prev) => ({
      ...prev,
      [targetUserId]: currentStatus ? Math.max(0, currentCount - 1) : currentCount + 1,
    }));

    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: targetUserId,
          action: "TOGGLE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFollowingMap((prev) => ({ ...prev, [targetUserId]: data.isFollowing }));
        setFollowerCountMap((prev) => ({ ...prev, [targetUserId]: data.followersCount }));
      } else {
        // revert on error
        setFollowingMap((prev) => ({ ...prev, [targetUserId]: currentStatus }));
        setFollowerCountMap((prev) => ({ ...prev, [targetUserId]: currentCount }));
      }
    } catch (err) {
      console.error("Follow error:", err);
      setFollowingMap((prev) => ({ ...prev, [targetUserId]: currentStatus }));
      setFollowerCountMap((prev) => ({ ...prev, [targetUserId]: currentCount }));
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header & Global Search Bar */}
      <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#e5b842] tracking-wider uppercase">
          <Compass className="w-4 h-4 text-[#e5b842]" />
          <span>Global Discovery & Fellowship</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Explore FaithVerse</h1>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pastors, believers, churches, teachings, scriptures, #hashtags..."
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 transition-colors"
          />
        </div>

        {/* Quick topic pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {["#GraceUnbounded", "#BibleStudy", "#WorshipTogether", "Pastor", "Bengaluru", "Testimony", "DailyVerse"].map(
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

      {/* Tabs: Content vs Members/Creators */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "posts"
              ? "bg-white text-black font-bold shadow-md"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Posts & Reflections ({postsResults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("people")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "people"
              ? "bg-white text-black font-bold shadow-md"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members & Creators ({usersResults.length})</span>
        </button>
      </div>

      {/* ================= POSTS TAB ================= */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {query ? `Search results for "${query}"` : "Trending Discoveries Across FaithVerse"}
            </span>
            <span>{postsResults.length} approved items</span>
          </div>

          {loadingPosts ? (
            <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#e5b842]" />
              <span>Searching platform reflections...</span>
            </div>
          ) : postsResults.length === 0 ? (
            <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-12 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#e5b842] mx-auto opacity-70" />
              <h3 className="text-sm font-semibold text-white">No Matching Content</h3>
              <p className="text-xs text-slate-400">Try searching for other keywords, verses, or tags.</p>
            </div>
          ) : (
            postsResults.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      )}

      {/* ================= MEMBERS & CREATORS TAB (Requested in item 3) ================= */}
      {activeTab === "people" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              {query ? `Members matching "${query}"` : "Creators & Believers to Follow"}
            </span>
            <span>{usersResults.length} members found</span>
          </div>

          {loadingUsers ? (
            <div className="p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#e5b842]" />
              <span>Finding fellowship members...</span>
            </div>
          ) : usersResults.length === 0 ? (
            <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-12 text-center space-y-2">
              <Users className="w-8 h-8 text-slate-500 mx-auto" />
              <h3 className="text-sm font-semibold text-white">No Members Found</h3>
              <p className="text-xs text-slate-400">Try searching with a different name, church, or username.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {usersResults.map((u) => {
                const isFollowing = followingMap[u.id] || false;
                const followers = followerCountMap[u.id] ?? u.followersCount ?? 0;
                const isSelf = currentUser?.id === u.id;

                return (
                  <div
                    key={u.id}
                    className="bg-[#11141d] border border-white/[0.08] hover:border-white/20 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <Link href={`/profile/${u.username}`} className="flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={u.avatarUrl}
                          alt={u.fullName}
                          className="w-12 h-12 rounded-full object-cover border border-white/10 hover:border-[#e5b842] transition-colors"
                        />
                      </Link>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/profile/${u.username}`}
                            className="font-bold text-white text-xs sm:text-sm hover:underline truncate"
                          >
                            {u.fullName}
                          </Link>
                          {u.isVerified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#e5b842] fill-[#e5b842]/20 flex-shrink-0" />
                          )}
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/[0.06] text-slate-300">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">@{u.username}</p>

                        {u.location && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span className="truncate">{u.location}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {u.bio || "Walking in faith and community on FaithVerse."}
                    </p>

                    {/* Footer with stats & Follow button */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
                      <span className="text-slate-400">
                        <strong className="text-white font-semibold">{formatNumberCompact(followers)}</strong>{" "}
                        followers
                      </span>

                      {!isSelf ? (
                        <button
                          type="button"
                          onClick={() => handleToggleFollow(u.id, u.fullName)}
                          className={`py-1.5 px-3.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-1.5 ${
                            isFollowing
                              ? "bg-white/[0.08] text-slate-200 border border-white/[0.12] hover:bg-rose-500/10 hover:text-rose-300 hover:border-rose-500/20"
                              : "bg-white text-black hover:bg-slate-200 active:scale-95 shadow-sm"
                          }`}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-3 h-3 text-[#e5b842]" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3 h-3" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Your Profile</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
