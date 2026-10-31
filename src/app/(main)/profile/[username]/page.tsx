"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  User,
  CheckCircle2,
  MapPin,
  Calendar,
  Globe,
  Clock,
  Sparkles,
  Grid,
  Bookmark,
  Shield,
} from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/components/providers/AuthContext";
import { formatNumberCompact } from "@/lib/utils";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"approved" | "pending" | "saved">("approved");
  const [profilePosts, setProfilePosts] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    setLoading(true);
    // Fetch approved posts
    fetch(`/api/posts?author=${username}&status=APPROVED`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProfilePosts(data.posts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // If own profile, fetch pending posts
    if (isOwnProfile) {
      fetch(`/api/posts?author=${username}&status=PENDING`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setPendingPosts(data.posts);
        })
        .catch((err) => console.error(err));
    }
  }, [username, isOwnProfile]);

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="glass-card bg-[#0d1527] rounded-3xl overflow-hidden border border-white/10 shadow-xl">
        {/* Banner */}
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-[#131e3a] via-[#1a153a] to-[#251f47] relative">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar & Follow Action */}
          <div className="flex flex-wrap items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  isOwnProfile && currentUser?.avatarUrl
                    ? currentUser.avatarUrl
                    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                }
                alt={username}
                className="w-24 sm:w-32 h-24 sm:h-32 rounded-full object-cover border-4 border-[#0d1527] shadow-xl bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              {!isOwnProfile ? (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`py-2 px-5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                    isFollowing
                      ? "bg-white/10 text-slate-200 border border-white/15"
                      : "bg-[#d4af37] text-black hover:bg-amber-400"
                  }`}
                >
                  {isFollowing ? "Following ✓" : "Follow Creator"}
                </button>
              ) : (
                <button className="py-2 px-4 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors">
                  Edit Profile Settings
                </button>
              )}
            </div>
          </div>

          {/* User Bio and Meta */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-white">
                  {isOwnProfile && currentUser ? currentUser.fullName : username}
                </h1>
                <CheckCircle2 className="w-5 h-5 text-[#d4af37] fill-[#d4af37]/20" />
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 text-[#f3d478] border border-[#d4af37]/30 font-semibold">
                  {isOwnProfile && currentUser ? currentUser.role : "Member"}
                </span>
              </div>
              <p className="text-xs text-slate-400">@{username}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              {isOwnProfile && currentUser?.bio
                ? currentUser.bio
                : "Dedicated to sharing grace, building authentic faith community, and encouraging believers worldwide."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Global Sanctuary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Joined October 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#d4af37]" />
                <span className="text-amber-300">All Faiths Welcome</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-3 border-t border-white/10 text-xs">
              <div>
                <strong className="text-white font-bold">{profilePosts.length}</strong>{" "}
                <span className="text-slate-400">Posts</span>
              </div>
              <div>
                <strong className="text-white font-bold">1.4k</strong>{" "}
                <span className="text-slate-400">Followers</span>
              </div>
              <div>
                <strong className="text-white font-bold">382</strong>{" "}
                <span className="text-slate-400">Prayers Lifted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "approved"
              ? "bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/40 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Published ({profilePosts.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "pending"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingPosts.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
            activeTab === "saved"
              ? "bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/40 shadow-sm"
              : "text-slate-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === "pending" ? (
          pendingPosts.length === 0 ? (
            <div className="glass-card bg-[#0d1527]/40 p-12 text-center rounded-2xl border border-white/5 space-y-2">
              <Shield className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Pending Submissions</h3>
              <p className="text-xs text-slate-400">
                All your submissions have been reviewed and approved!
              </p>
            </div>
          ) : (
            pendingPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        ) : profilePosts.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/40 p-12 text-center rounded-2xl border border-white/5 space-y-2">
            <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-white">No Published Posts</h3>
            <p className="text-xs text-slate-400">
              When posts pass through the moderation approval workflow, they appear here.
            </p>
          </div>
        ) : (
          profilePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </div>
  );
}
