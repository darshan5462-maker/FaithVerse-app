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
      <div className="pro-card rounded-2xl overflow-hidden shadow-xl">
        {/* Banner */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-slate-900 via-[#141a29] to-slate-900 relative">
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          {/* Avatar & Follow Action */}
          <div className="flex flex-wrap items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  isOwnProfile && currentUser?.avatarUrl
                    ? currentUser.avatarUrl
                    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
                }
                alt={username}
                className="w-20 sm:w-28 h-20 sm:h-28 rounded-full object-cover border-4 border-[#090a0f] shadow-xl bg-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              {!isOwnProfile ? (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                    isFollowing
                      ? "bg-white/[0.08] text-slate-200 border border-white/[0.12]"
                      : "bg-white text-black hover:bg-slate-200"
                  }`}
                >
                  {isFollowing ? "Following ✓" : "Follow"}
                </button>
              ) : (
                <button className="py-2 px-4 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white border border-white/[0.1] transition-colors">
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* User Bio and Meta */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {isOwnProfile && currentUser ? currentUser.fullName : username}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-[#e5b842] fill-[#e5b842]/20" />
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e5b842]/10 text-[#f5d47a] border border-[#e5b842]/30 font-medium">
                  {isOwnProfile && currentUser ? currentUser.role : "Member"}
                </span>
              </div>
              <p className="text-xs text-slate-400">@{username}</p>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {isOwnProfile && currentUser?.bio
                ? currentUser.bio
                : "Dedicated to sharing grace, building authentic faith community, and encouraging believers worldwide."}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Global Sanctuary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Joined October 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#e5b842]" />
                <span className="text-slate-300">All Faiths Welcome</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 pt-3 border-t border-white/[0.06] text-xs">
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
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "approved"
              ? "bg-white/[0.08] text-white"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Published ({profilePosts.length})</span>
        </button>

        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "pending"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingPosts.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === "saved"
              ? "bg-white/[0.08] text-white"
              : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
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
            <div className="pro-card p-12 text-center space-y-2">
              <Shield className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
              <h3 className="text-sm font-semibold text-white">No Pending Submissions</h3>
              <p className="text-xs text-slate-400">
                All your submissions have been reviewed and approved!
              </p>
            </div>
          ) : (
            pendingPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        ) : profilePosts.length === 0 ? (
          <div className="pro-card p-12 text-center space-y-2">
            <Sparkles className="w-8 h-8 text-[#e5b842] mx-auto opacity-70" />
            <h3 className="text-sm font-semibold text-white">No Published Posts</h3>
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
