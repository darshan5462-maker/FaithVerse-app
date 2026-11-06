"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
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
  LogOut,
  Settings,
  Lock,
  Bell,
  ShieldCheck,
  Languages,
  Sliders,
  Mail,
  Link as LinkIcon,
  Eye,
  AlertTriangle,
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
  const router = useRouter();
  const params = useParams();
  const username = params.username as string;
  const { user: currentUser, updateUserProfile, logout } = useAuth();

  const [profileData, setProfileData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"approved" | "pending" | "saved">("approved");
  const [profilePosts, setProfilePosts] = useState<any[]>([]);
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // Edit Profile & Settings Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<
    "profile" | "media" | "privacy" | "notifications" | "security"
  >("profile");
  const [editFullName, setEditFullName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editReligion, setEditReligion] = useState("Christian");
  const [editWebsite, setEditWebsite] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [editBannerUrl, setEditBannerUrl] = useState("");

  // Account Settings state
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowDMs, setAllowDMs] = useState(true);
  const [prefLanguage, setPrefLanguage] = useState("en");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailyVerseAlert, setDailyVerseAlert] = useState(true);
  const [prayerAlerts, setPrayerAlerts] = useState(true);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Saving states
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Logout confirmation modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const isOwnProfile =
    currentUser?.username?.toLowerCase() === username?.toLowerCase();

  const fetchProfileDetails = async () => {
    try {
      const url = currentUser
        ? `/api/profile?username=${username}&currentUserId=${currentUser.id}`
        : `/api/profile?username=${username}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success && data.profile) {
        setProfileData(data.profile);
        setIsFollowing(Boolean(data.profile.isFollowing));
        setFollowersCount(data.profile._count?.followers ?? 0);

        if (data.profile.settings) {
          setIsPrivate(Boolean(data.profile.settings.isPrivate));
          setAllowDMs(Boolean(data.profile.settings.allowDirectMessages));
          setPrefLanguage(data.profile.settings.preferredLanguage || "en");
          setEmailAlerts(Boolean(data.profile.settings.emailNotifications));
          setDailyVerseAlert(Boolean(data.profile.settings.dailyVerseAlert));
          setPrayerAlerts(Boolean(data.profile.settings.prayerAlerts));
        }
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

  // Handle follow toggle
  const handleFollowToggle = async () => {
    if (!currentUser) {
      alert("Please log in to follow creators and community members.");
      return;
    }

    if (!profileData?.id) return;

    const prevFollowing = isFollowing;
    const prevCount = followersCount;

    setIsFollowing(!prevFollowing);
    setFollowersCount((cnt) => (prevFollowing ? Math.max(0, cnt - 1) : cnt + 1));

    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          followerId: currentUser.id,
          followingId: profileData.id,
          action: "TOGGLE",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsFollowing(data.isFollowing);
        setFollowersCount(data.followersCount);
      } else {
        // revert on error
        setIsFollowing(prevFollowing);
        setFollowersCount(prevCount);
      }
    } catch (err) {
      console.error("Follow error:", err);
      setIsFollowing(prevFollowing);
      setFollowersCount(prevCount);
    }
  };

  // Initialize edit fields when opening modal
  const handleOpenEdit = (tab: "profile" | "media" | "privacy" | "notifications" | "security" = "profile") => {
    setSettingsActiveTab(tab);
    setEditFullName(profileData?.fullName || currentUser?.fullName || "");
    setEditBio(profileData?.bio || currentUser?.bio || "");
    setEditLocation(profileData?.location || currentUser?.location || "Global Sanctuary");
    setEditReligion(profileData?.religion || currentUser?.religion || "Christian");
    setEditWebsite(profileData?.website || "");
    setEditEmail(profileData?.email || currentUser?.email || "");
    setEditAvatarUrl(profileData?.avatarUrl || currentUser?.avatarUrl || "");
    setEditBannerUrl(profileData?.bannerUrl || currentUser?.bannerUrl || "");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMsg("");
    setSaveSuccess(false);
    setIsEditOpen(true);
  };

  // Handle local avatar file picker
  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        setErrorMsg("Photo must be under 8MB.");
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
      if (file.size > 12 * 1024 * 1024) {
        setErrorMsg("Banner photo must be under 12MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditBannerUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile & account settings to Supabase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (newPassword && newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

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
          website: editWebsite.trim(),
          email: editEmail.trim(),
          avatarUrl: editAvatarUrl,
          bannerUrl: editBannerUrl,
          settings: {
            isPrivate,
            allowDirectMessages: allowDMs,
            preferredLanguage: prefLanguage,
            emailNotifications: emailAlerts,
            dailyVerseAlert,
            prayerAlerts,
          },
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
          email: data.user.email,
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

  // Confirm and perform logout
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    router.push("/login");
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

  const displayWebsite = profileData?.website || currentUser?.website;

  const postCount = profileData?._count?.posts ?? profilePosts.length;
  const prayerCount = profileData?._count?.prayerActions ?? 382;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
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
              onClick={() => handleOpenEdit("media")}
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
                  onClick={() => handleOpenEdit("media")}
                  className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-[#e5b842] text-black flex items-center justify-center border-2 border-[#11141d] shadow-lg hover:scale-110 active:scale-95 transition-transform"
                  title="Update Profile Picture"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>

            {/* Actions: Edit Profile, Full Settings, and Logout Button (Item 2) */}
            <div className="flex items-center gap-2 flex-wrap">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`py-2 px-5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                      isFollowing
                        ? "bg-white/[0.08] text-slate-200 border border-white/[0.12] hover:bg-white/[0.12]"
                        : "bg-white text-black hover:bg-slate-200 active:scale-95"
                    }`}
                  >
                    {isFollowing ? "Following ✓" : "Follow"}
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${displayName} on FaithVerse`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Profile link copied to clipboard!");
                      }
                    }}
                    className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  {/* Edit Profile Button */}
                  <button
                    onClick={() => handleOpenEdit("profile")}
                    className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 active:scale-95 transition-all shadow-md flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Edit Profile</span>
                  </button>

                  {/* Account Settings Button */}
                  <button
                    onClick={() => handleOpenEdit("privacy")}
                    className="py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 border border-white/[0.1] active:scale-95 transition-all flex items-center gap-1.5"
                    title="Account Settings"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#e5b842]" />
                    <span className="hidden sm:inline">Settings</span>
                  </button>

                  {/* Prominent Log Out Button (as requested in item 2) */}
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="py-2.5 px-3.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                    title="Log Out of FaithVerse"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400 stroke-[2.2]" />
                    <span>Log Out</span>
                  </button>
                </>
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
                {isPrivate && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    Private
                  </span>
                )}
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
                    : "November 2026"}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#e5b842]" />
                <span className="text-slate-300 font-medium">{displayReligion}</span>
              </div>
              {displayWebsite && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
                  <a
                    href={displayWebsite.startsWith("http") ? displayWebsite : `https://${displayWebsite}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    {displayWebsite.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-8 pt-3 border-t border-white/[0.06] text-xs">
              <div>
                <strong className="text-white font-bold text-sm">{postCount}</strong>{" "}
                <span className="text-slate-400">Published Posts</span>
              </div>
              <div>
                <strong className="text-white font-bold text-sm">
                  {formatNumberCompact(followersCount)}
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

      {/* Profile Post Feed Tabs */}
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

      {/* Feed Content */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#e5b842]" />
            <span>Loading faith reflections...</span>
          </div>
        ) : activeTab === "approved" ? (
          profilePosts.length > 0 ? (
            profilePosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-12 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-[#e5b842] mx-auto opacity-70 animate-pulse" />
              <h3 className="text-base font-semibold text-white">No Published Posts Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                When your posts pass through the moderation approval workflow, they appear here.
              </p>
            </div>
          )
        ) : activeTab === "pending" ? (
          pendingPosts.length > 0 ? (
            pendingPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-12 text-center space-y-3">
              <Clock className="w-10 h-10 text-amber-400 mx-auto opacity-70" />
              <h3 className="text-base font-semibold text-white">Queue is Clear</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                You have no posts waiting in the moderation review queue.
              </p>
            </div>
          )
        ) : (
          <div className="bg-[#11141d] border border-white/[0.08] rounded-3xl p-12 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-semibold text-white">Saved Posts</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Bookmarks you save across FaithVerse will be kept private here for your reflection.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================== */}
      {/* 1. CONFIRM LOGOUT MODAL (Requested in item 2) */}
      {/* ========================================================== */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#11141d] border border-rose-500/30 rounded-3xl p-6 max-w-sm w-full space-y-5 shadow-2xl relative text-center">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <LogOut className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-white">Log Out of FaithVerse?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You will be signed out on this device. You can log back in at any time with your credentials or persona.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white transition-colors shadow-lg shadow-rose-500/20"
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. COMPREHENSIVE EDIT PROFILE & SETTINGS MODAL (Item 2) */}
      {/* ========================================================== */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
          <div className="bg-[#11141d] border border-white/15 rounded-3xl max-w-xl w-full shadow-2xl my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#e5b842]" />
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Profile & Account Settings
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/[0.08] text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Settings Navigation Tabs */}
            <div className="flex items-center gap-1 px-4 pt-3 border-b border-white/[0.08] overflow-x-auto text-xs font-medium scrollbar-none bg-[#0e1017]">
              {[
                { key: "profile", label: "Profile Info", icon: User },
                { key: "media", label: "Avatar & Cover", icon: Camera },
                { key: "privacy", label: "Privacy & Fellowship", icon: Lock },
                { key: "notifications", label: "Alerts", icon: Bell },
                { key: "security", label: "Security", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = settingsActiveTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSettingsActiveTab(tab.key as any)}
                    className={`px-3 py-2 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-white text-black font-semibold shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className="p-5 sm:p-6 space-y-5 max-h-[72vh] overflow-y-auto">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>All profile and account settings updated and saved to Supabase!</span>
                </div>
              )}

              {/* ================= TAB 1: PROFILE INFO ================= */}
              {settingsActiveTab === "profile" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Full Display Name
                    </label>
                    <input
                      type="text"
                      required
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="e.g. Darshan M"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-300">
                        Biography / Ministry Reflection / Favorite Scripture
                      </label>
                      <span className="text-[10px] text-slate-500">{editBio.length}/320</span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={320}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Share what God is doing in your life, your home church, or favorite verse..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 resize-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Location / Sanctuary
                      </label>
                      <input
                        type="text"
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        placeholder="e.g. Bengaluru, India"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Faith Tradition
                      </label>
                      <select
                        value={editReligion}
                        onChange={(e) => setEditReligion(e.target.value)}
                        className="w-full bg-[#161a25] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e5b842]/50 cursor-pointer"
                      >
                        <option value="Christian">Christian</option>
                        <option value="Christian / Evangelical">Evangelical</option>
                        <option value="Christian / Catholic">Catholic</option>
                        <option value="Christian / Protestant">Protestant</option>
                        <option value="Christian / Pentecostal">Pentecostal</option>
                        <option value="Christian / Orthodox">Orthodox</option>
                        <option value="Seeker / Explorer">Seeker / Explorer</option>
                        <option value="All Faiths Welcome">All Faiths Welcome</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Website / Ministry Link
                    </label>
                    <input
                      type="text"
                      value={editWebsite}
                      onChange={(e) => setEditWebsite(e.target.value)}
                      placeholder="https://gracefellowship.org or portfolio link"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                    />
                  </div>
                </div>
              )}

              {/* ================= TAB 2: AVATAR & BANNER MEDIA ================= */}
              {settingsActiveTab === "media" && (
                <div className="space-y-5 animate-fade-in">
                  {/* Avatar section */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Profile Avatar (From Device or Presets)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#e5b842] shadow-xl flex-shrink-0 bg-black">
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
                          className="py-2 px-3.5 rounded-xl text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/10 transition-colors flex items-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose Photo from Device</span>
                        </button>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarFile}
                          className="hidden"
                        />
                        <p className="text-[11px] text-slate-400">
                          Supports JPG, PNG, WEBP from your phone camera roll or PC.
                        </p>
                      </div>
                    </div>

                    {/* Preset Avatars */}
                    <div className="pt-2">
                      <p className="text-[11px] text-slate-400 mb-1.5">Or choose a spiritual emblem:</p>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {PRESET_AVATARS.map((av, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditAvatarUrl(av.url)}
                            className={`p-1 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                              editAvatarUrl === av.url
                                ? "border-[#e5b842] bg-[#e5b842]/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[9px] text-slate-300 truncate w-full text-center">
                              {av.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Banner section */}
                  <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Cover Banner (From Device or Presets)
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
                        <span>Upload Custom Banner from Device</span>
                      </button>
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerFile}
                        className="hidden"
                      />
                    </div>

                    <div className="pt-1">
                      <p className="text-[11px] text-slate-400 mb-1.5">Or choose a sanctuary backdrop:</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {PRESET_BANNERS.map((bn, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditBannerUrl(bn.url)}
                            className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                              editBannerUrl === bn.url
                                ? "border-[#e5b842] ring-2 ring-[#e5b842]/40"
                                : "border-white/10 opacity-75 hover:opacity-100"
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
                </div>
              )}

              {/* ================= TAB 3: PRIVACY & FELLOWSHIP ================= */}
              {settingsActiveTab === "privacy" && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Private Account</span>
                        <span className="text-[11px] text-slate-400 block">
                          When enabled, only your followers can view your published reflections.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsPrivate(!isPrivate)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          isPrivate ? "bg-[#e5b842]" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            isPrivate ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Allow Direct Messages</span>
                        <span className="text-[11px] text-slate-400 block">
                          Receive fellowship messages and prayer requests from believers.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAllowDMs(!allowDMs)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          allowDMs ? "bg-[#e5b842]" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            allowDMs ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Preferred Scripture Language
                    </label>
                    <select
                      value={prefLanguage}
                      onChange={(e) => setPrefLanguage(e.target.value)}
                      className="w-full bg-[#161a25] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e5b842]/50 cursor-pointer"
                    >
                      <option value="en">English (NIV / ESV)</option>
                      <option value="kn">Kannada (ಸತ್ಯವೇದ Bible)</option>
                      <option value="hi">Hindi (पवित्र बाइबल)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* ================= TAB 4: NOTIFICATIONS & ALERTS ================= */}
              {settingsActiveTab === "notifications" && (
                <div className="space-y-3 animate-fade-in">
                  <div className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Daily Morning Verse</span>
                        <span className="text-[11px] text-slate-400 block">
                          Receive daily curated scripture alerts for morning inspiration.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDailyVerseAlert(!dailyVerseAlert)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          dailyVerseAlert ? "bg-[#e5b842]" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            dailyVerseAlert ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Prayer Wall Notifications</span>
                        <span className="text-[11px] text-slate-400 block">
                          Get notified when someone prays for your petitions.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPrayerAlerts(!prayerAlerts)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          prayerAlerts ? "bg-[#e5b842]" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            prayerAlerts ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-white block">Email Digest & Updates</span>
                        <span className="text-[11px] text-slate-400 block">
                          Receive weekly faith digests and important ministry notices.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailAlerts(!emailAlerts)}
                        className={`w-11 h-6 rounded-full transition-colors relative ${
                          emailAlerts ? "bg-[#e5b842]" : "bg-white/20"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            emailAlerts ? "right-1" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= TAB 5: ACCOUNT & SECURITY ================= */}
              {settingsActiveTab === "security" && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                    />
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-xs space-y-1">
                    <span className="font-semibold text-white">Account Type</span>
                    <p className="text-slate-400">
                      Role: <strong className="text-[#e5b842]">{displayRole}</strong> • Verified: {profileData?.isVerified ? "Yes ✓" : "Standard"}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                    <span className="text-xs font-semibold text-white block">Change Password</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password (optional)"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.08]">
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
                    <span>Save All Changes</span>
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
