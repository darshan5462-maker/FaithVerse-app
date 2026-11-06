"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Camera,
  Edit3,
  X,
  Upload,
  Check,
  Loader2,
  Heart,
  Share2,
  BookOpen,
} from "lucide-react";
import PostCard from "@/components/feed/PostCard";
import { useAuth } from "@/components/providers/AuthContext";
import { formatNumberCompact } from "@/lib/utils";

// Curated Faith & Nature Aesthetic Avatars
const PRESET_AVATARS = [
  {
    label: "Holy Dove",
    url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Golden Dawn",
    url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Open Scripture",
    url: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Mountain Sanctuary",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Acoustic Worship",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
  {
    label: "Sanctuary Candles",
    url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=400&q=80",
  },
];

// Curated Faith Cover Banners
const PRESET_BANNERS = [
  {
    label: "Cathedral Grace",
    url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Mountain Sunrise",
    url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Celestial Sanctuary",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Warm Fellowship",
    url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, updateUserProfile } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"approved" | "pending" | "saved">("approved");
  const [profilePosts, setProfilePosts] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Edit Profile Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editReligion, setEditReligion] = useState("Christian");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editBannerUrl, setEditBannerUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile =
    currentUser?.username?.toLowerCase() === username?.toLowerCase();

  const fetchProfileDetails = async () => {
    try {
      const res = await fetch(`/api/profile?username=${username}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setProfileData(data.profile);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProfileDetails();

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

  // Initialize edit fields when opening modal
  const handleOpenEdit = () => {
    setEditFullName(profileData?.fullName || currentUser?.fullName || "");
    setEditBio(profileData?.bio || currentUser?.bio || "");
    setEditLocation(profileData?.location || currentUser?.location || "Global Sanctuary");
    setEditReligion(profileData?.religion || currentUser?.religion || "Christian");
    setEditAvatarUrl(profileData?.avatarUrl || currentUser?.avatarUrl || "");
    setEditBannerUrl(profileData?.bannerUrl || currentUser?.bannerUrl || "");
    setErrorMsg("");
    setSaveSuccess(false);
    setIsEditOpen(true);
  };

  // Handle local avatar file picker
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Photo must be under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditAvatarUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle local banner file picker
  const handleBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg("Banner photo must be under 8MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditBannerUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes to Supabase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setErrorMsg("");
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          fullName: editFullName.trim(),
          bio: editBio.trim(),
          location: editLocation.trim(),
          religion: editReligion.trim(),
          avatarUrl: editAvatarUrl,
          bannerUrl: editBannerUrl,
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        // Update local state
        setProfileData((prev: any) => ({
          ...prev,
          ...data.user,
        }));

        // Sync with global auth state (sidebar, top header, etc.)
        updateUserProfile({
          fullName: data.user.fullName,
          avatarUrl: data.user.avatarUrl,
          bannerUrl: data.user.bannerUrl,
          bio: data.user.bio,
          location: data.user.location,
          religion: data.user.religion,
        });

        setSaveSuccess(true);
        setTimeout(() => {
          setIsEditOpen(false);
          setSaveSuccess(false);
        }, 1200);
      } else {
        setErrorMsg(data.error || "Failed to update profile.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  // Current display values with fallbacks
  const displayName =
    isOwnProfile && currentUser
      ? profileData?.fullName || currentUser.fullName
      : profileData?.fullName || username;

  const displayAvatar =
    isOwnProfile && currentUser
      ? profileData?.avatarUrl || currentUser.avatarUrl
      : profileData?.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80";

  const displayBanner =
    profileData?.bannerUrl ||
    (isOwnProfile && currentUser?.bannerUrl) ||
    "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80";

  const displayBio =
    profileData?.bio ||
    (isOwnProfile && currentUser?.bio) ||
    "Member of the FaithVerse global family. Walking in faith, grace, and purpose.";

  const displayLocation =
    profileData?.location || (isOwnProfile && currentUser?.location) || "Global Sanctuary";

  const displayReligion =
    profileData?.religion || (isOwnProfile && currentUser?.religion) || "Christian / All Welcome";

  const displayRole =
    profileData?.role || (isOwnProfile && currentUser?.role) || "USER";

  const postCount = profileData?._count?.posts ?? profilePosts.length;
  const followerCount = profileData?._count?.followers ?? 1420;
  const prayerCount = profileData?._count?.prayerActions ?? 382;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Header Card */}
      <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl">
        {/* Cover Banner */}
        <div className="h-36 sm:h-52 w-full relative overflow-hidden bg-gradient-to-r from-slate-900 via-[#141a29] to-slate-900 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayBanner}
            alt="Profile cover banner"
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#11141d] via-transparent to-black/30" />

          {/* Quick Change Banner Button for Owner */}
          {isOwnProfile && (
            <button
              onClick={handleOpenEdit}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl text-xs font-medium bg-black/60 hover:bg-black/80 backdrop-blur-md text-white border border-white/15 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Cover</span>
            </button>
          )}
        </div>

        <div className="px-5 sm:px-8 pb-7 pt-0 relative">
          {/* Avatar & Action Button Row */}
          <div className="flex flex-wrap items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-4">
            {/* Avatar with Camera Badge */}
            <div className="relative group">
              <div className="w-24 sm:w-32 h-24 sm:h-32 rounded-full overflow-hidden border-4 border-[#11141d] shadow-2xl bg-[#090a0f] ring-2 ring-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayAvatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>

              {isOwnProfile && (
                <button
                  onClick={handleOpenEdit}
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#e5b842] text-black flex items-center justify-center border-2 border-[#11141d] shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Actions: Edit Profile or Follow */}
            <div className="flex items-center gap-2.5">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`py-2 px-5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                      isFollowing
                        ? "bg-white/[0.08] text-slate-200 border border-white/[0.12] hover:bg-white/[0.12]"
                        : "bg-white text-black hover:bg-slate-200 active:scale-95"
                    }`}
                  >
                    {isFollowing ? "Following ✓" : "Follow"}
                  </button>
                  <button className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleOpenEdit}
                  className="py-2.5 px-5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* User Bio and Meta Information */}
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {displayName}
                </h1>
                <CheckCircle2 className="w-4 h-4 text-[#e5b842] fill-[#e5b842]/20" />
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#e5b842]/10 text-[#f5d47a] border border-[#e5b842]/30 font-mono uppercase tracking-wider">
                  {displayRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">@{username}</p>
            </div>

            {/* Biography */}
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed whitespace-pre-line bg-white/[0.02] p-3 rounded-2xl border border-white/[0.04]">
              {displayBio}
            </p>

            {/* Badges / Meta Attributes */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{displayLocation}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  Joined{" "}
                  {profileData?.createdAt
                    ? new Date(profileData.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        year: "numeric",
                      })
                    : "October 2026"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#e5b842]" />
                <span className="text-slate-300 font-medium">{displayReligion}</span>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 pt-3 border-t border-white/[0.06] text-xs">
              <div>
                <strong className="text-white font-bold text-sm">{postCount}</strong>{" "}
                <span className="text-slate-400">Published Posts</span>
              </div>
              <div>
                <strong className="text-white font-bold text-sm">
                  {formatNumberCompact(followerCount)}
                </strong>{" "}
                <span className="text-slate-400">Followers</span>
              </div>
              <div>
                <strong className="text-white font-bold text-sm">
                  {formatNumberCompact(prayerCount)}
                </strong>{" "}
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
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
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
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
              activeTab === "pending"
                ? "bg-amber-500/10 text-amber-300 border border-amber-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingPosts.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
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
            <div className="bg-[#11141d] border border-white/[0.08] p-12 text-center rounded-2xl space-y-2">
              <Shield className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
              <h3 className="text-sm font-semibold text-white">No Pending Submissions</h3>
              <p className="text-xs text-slate-400">
                All your submissions have passed review and are live on the community feed!
              </p>
            </div>
          ) : (
            pendingPosts.map((post) => <PostCard key={post.id} post={post} />)
          )
        ) : profilePosts.length === 0 ? (
          <div className="bg-[#11141d] border border-white/[0.08] p-12 text-center rounded-2xl space-y-2">
            <Sparkles className="w-8 h-8 text-[#e5b842] mx-auto opacity-70" />
            <h3 className="text-sm font-semibold text-white">No Published Posts Yet</h3>
            <p className="text-xs text-slate-400">
              When your posts pass through the moderation approval workflow, they appear here.
            </p>
          </div>
        ) : (
          profilePosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>

      {/* ============================================================== */}
      {/* EDIT PROFILE MODAL WITH DEVICE UPLOADER & FAITH PRESETS */}
      {/* ============================================================== */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#11141d] border border-white/10 max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-fade-in flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#e5b842]/10 text-[#e5b842] flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Edit Your Profile</h3>
                  <p className="text-[11px] text-slate-400">Personalize your identity and testimony</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveProfile} className="p-5 space-y-5 overflow-y-auto">
              {/* Status Alert */}
              {saveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Profile updated successfully! Refreshing...</span>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* 1. Profile Picture (Avatar) Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Profile Picture
                </label>

                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#e5b842] shadow-md flex-shrink-0 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editAvatarUrl || displayAvatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors shadow-sm flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload from Device</span>
                    </button>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFile}
                      className="hidden"
                    />
                    <p className="text-[11px] text-slate-400">JPG, PNG, or WEBP up to 5MB</p>
                  </div>
                </div>

                {/* Preset Avatars Row */}
                <div className="pt-1">
                  <p className="text-[11px] text-slate-400 mb-2">Or choose a spiritual emblem:</p>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                    {PRESET_AVATARS.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditAvatarUrl(av.url)}
                        className={`relative w-11 h-11 rounded-full overflow-hidden border-2 transition-all flex-shrink-0 ${
                          editAvatarUrl === av.url
                            ? "border-[#e5b842] ring-2 ring-[#e5b842]/40 scale-105"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                        title={av.label}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Cover Banner Section */}
              <div className="space-y-2.5 pt-2 border-t border-white/[0.08]">
                <label className="text-xs font-bold text-white uppercase tracking-wider block">
                  Cover Banner
                </label>

                <div className="h-24 w-full rounded-2xl overflow-hidden relative border border-white/15 bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={editBannerUrl || displayBanner}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center gap-2 text-white text-xs font-semibold transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Custom Banner</span>
                  </button>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerFile}
                    className="hidden"
                  />
                </div>

                {/* Preset Banners Row */}
                <div className="pt-1">
                  <p className="text-[11px] text-slate-400 mb-2">Or choose a sanctuary backdrop:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_BANNERS.map((bn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditBannerUrl(bn.url)}
                        className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                          editBannerUrl === bn.url
                            ? "border-[#e5b842] ring-2 ring-[#e5b842]/40"
                            : "border-white/10 opacity-70 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={bn.url} alt={bn.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-medium text-white px-1 text-center">
                          {bn.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Text Details */}
              <div className="space-y-3.5 pt-2 border-t border-white/[0.08]">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    placeholder="e.g. Darshan M"
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 transition-colors"
                  />
                </div>

                {/* Bio */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Bio / Testimony / Favorite Scripture
                    </label>
                    <span className="text-[10px] text-slate-500">{editBio.length}/280</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={280}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Share what God is doing in your life, your church, or your favorite verse..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 transition-colors"
                  />
                </div>

                {/* Location & Faith Tradition Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder="e.g. Bengaluru, India"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Faith / Journey
                    </label>
                    <select
                      value={editReligion}
                      onChange={(e) => setEditReligion(e.target.value)}
                      className="w-full bg-[#161a25] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e5b842]/50 transition-colors"
                    >
                      <option value="Christian">Christian</option>
                      <option value="Christian / Evangelical">Evangelical</option>
                      <option value="Christian / Catholic">Catholic</option>
                      <option value="Christian / Protestant">Protestant</option>
                      <option value="Christian / Pentecostal">Pentecostal</option>
                      <option value="Seeker / Explorer">Seeker / Explorer</option>
                      <option value="All Faiths Welcome">All Faiths Welcome</option>
                      <option value="Grace & Fellowship">Grace & Fellowship</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !editFullName.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 active:scale-95 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Cloud...</span>
                    </>
                  ) : (
                    <span>Save Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
