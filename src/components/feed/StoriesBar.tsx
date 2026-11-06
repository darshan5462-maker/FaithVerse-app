"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  X,
  Upload,
  Heart,
  Send,
  CheckCircle2,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Video,
  Volume2,
  VolumeX,
  LogIn,
  AlertCircle,
  Type,
  Music,
  Smile,
  Palette,
  Layers,
  Flame,
  Check,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

export interface StoryItem {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  storyMedia: string;
  mediaType: string;
  caption?: string;
  isVerified?: boolean;
  createdAt?: string;
  badge?: string;
  musicTrack?: string;
}

// Curated Faith Story Gradient Canvases
const STORY_CANVASES = [
  { id: "gold", name: "Golden Glory", gradient: "from-amber-600 via-amber-800 to-stone-950" },
  { id: "midnight", name: "Midnight Prayer", gradient: "from-indigo-950 via-slate-900 to-blue-950" },
  { id: "rose", name: "Rose of Sharon", gradient: "from-rose-800 via-purple-950 to-slate-950" },
  { id: "olive", name: "Mount of Olives", gradient: "from-emerald-900 via-teal-950 to-slate-950" },
  { id: "celestial", name: "Heavenly Dawn", gradient: "from-blue-700 via-indigo-900 to-purple-950" },
];

// Curated Faith Badges
const FAITH_BADGES = [
  "🙏 Morning Prayer",
  "📖 Daily Scripture",
  "🕊️ Grace & Peace",
  "✨ Testimony",
  "🔥 Worship Moment",
  "✝️ Amen & Hallelujah",
];

// Curated Worship Music Snippets
const WORSHIP_TRACKS = [
  "🎵 Hillsong Worship • What A Beautiful Name",
  "🎵 Elevation Worship • Graves Into Gardens",
  "🎵 Sinach • Way Maker",
  "🎵 Bethel Music • Goodness of God",
  "🎵 Chris Tomlin • How Great Is Our God",
];

export default function StoriesBar() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stories, setStories] = useState<StoryItem[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Uploader mode: "media" (device photo/video) vs "canvas" (scripture gradient card)
  const [studioMode, setStudioMode] = useState<"media" | "canvas">("media");

  // Media state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  // Styling state
  const [selectedCanvas, setSelectedCanvas] = useState(STORY_CANVASES[0]);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [fontStyle, setFontStyle] = useState<"modern" | "serif" | "script" | "bold">("modern");

  // Story Viewer state
  const [isMuted, setIsMuted] = useState(false);
  const [storyLiked, setStoryLiked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [floatingReaction, setFloatingReaction] = useState<string | null>(null);

  // Auto-progress timer for story viewer
  const [progress, setProgress] = useState(0);

  const fetchStories = async () => {
    try {
      const res = await fetch("/api/stories");
      const data = await res.json();
      if (data.success && data.stories) {
        setStories(data.stories);
      }
    } catch (err) {
      console.error("Error loading stories:", err);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Handle local device file picker
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("File is too large. Please select a video clip or photo under 50MB.");
        return;
      }
      setUploadError(null);
      setSelectedFile(file);
      const isVid =
        file.type.startsWith("video") ||
        Boolean(file.name.match(/\.(mp4|mov|webm|ogg|m4v)$/i));
      setIsVideo(isVid);

      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
        setStudioMode("media");
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert canvas to image or payload
  const handleUploadStory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowUploader(false);
      setShowAuthPrompt(true);
      return;
    }

    if (studioMode === "media" && !previewUrl) {
      setUploadError("Please select a photo or video from your device.");
      return;
    }

    if (studioMode === "canvas" && !caption.trim()) {
      setUploadError("Please write a scripture or testimony for your story card.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      let finalMediaUrl = previewUrl || "";

      // If in canvas mode, create rich svg / data representation or fallback graphic
      if (studioMode === "canvas") {
        // High quality SVG data URL for the canvas
        const svgCanvas = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2a0845" />
              <stop offset="50%" stop-color="#141a29" />
              <stop offset="100%" stop-color="#090a0f" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad)" />
          <circle cx="360" cy="400" r="180" fill="#e5b842" opacity="0.12" filter="blur(40px)" />
        </svg>`;
        finalMediaUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgCanvas)}`;
      }

      const formattedCaption = [
        selectedBadge ? `[${selectedBadge}]` : "",
        caption.trim(),
        selectedTrack ? `\n${selectedTrack}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const isVid =
        studioMode === "media" &&
        (isVideo || selectedFile?.type.startsWith("video") || previewUrl?.startsWith("data:video"));

      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          mediaUrl: finalMediaUrl,
          mediaType: isVid ? "VIDEO" : "IMAGE",
          caption: formattedCaption,
        }),
      });

      const data = await res.json();
      if (data.success && data.story) {
        setStories((prev) => [data.story, ...prev]);
        setShowUploader(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        setIsVideo(false);
        setCaption("");
        setSelectedBadge(null);
        setSelectedTrack(null);
      } else {
        setUploadError(data.error || "Failed to publish story.");
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      setUploadError(err.message || "Failed to publish story.");
    } finally {
      setUploading(false);
    }
  };

  // Timer loop for active story viewer
  useEffect(() => {
    if (activeStoryIndex === null) {
      setProgress(0);
      return;
    }

    setProgress(0);
    setStoryLiked(false);
    setReplySent(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2; // 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  // Trigger floating reaction
  const sendReaction = (emoji: string) => {
    setFloatingReaction(emoji);
    setStoryLiked(true);
    setTimeout(() => setFloatingReaction(null), 1400);
  };

  return (
    <div className="relative mb-6">
      {/* Stories Bar Carousel */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {/* Add Story Button */}
        <div
          onClick={() => {
            if (!user) {
              setShowAuthPrompt(true);
            } else {
              setShowUploader(true);
            }
          }}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#e5b842] via-amber-400 to-amber-200 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-[#11141d] flex items-center justify-center overflow-hidden">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#e5b842] text-black flex items-center justify-center border-2 border-[#11141d] shadow">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] text-slate-300 font-medium tracking-tight">Your Story</span>
        </div>

        {/* Existing Stories from Community */}
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => setActiveStoryIndex(index)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#e5b842] via-purple-500 to-amber-300 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#11141d] overflow-hidden border-2 border-[#11141d]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.avatarUrl}
                  alt={story.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] text-slate-300 max-w-[68px] truncate text-center font-medium">
              {story.fullName.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/10 max-w-sm w-full rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#e5b842]/10 text-[#e5b842] flex items-center justify-center mx-auto">
              <LogIn className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Sign In to Post Stories</h3>
              <p className="text-xs text-slate-400">
                Join the FaithVerse community to share reflections and gospel moments.
              </p>
            </div>
            <div className="space-y-2 pt-2">
              <Link
                href="/login"
                className="block w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors"
              >
                Sign In Now
              </Link>
              <button
                onClick={() => setShowAuthPrompt(false)}
                className="text-xs text-slate-500 hover:text-slate-300 pt-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ULTRA-PROFESSIONAL STORY STUDIO UPLOADER (Item 4) */}
      {/* ========================================================== */}
      {showUploader && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#11141d] border border-white/15 max-w-lg w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-fade-in flex flex-col my-auto">
            {/* Studio Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e5b842]" />
                <h3 className="text-sm font-bold text-white">Professional Story Studio</h3>
              </div>
              <button
                onClick={() => {
                  setShowUploader(false);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                  setIsVideo(false);
                  setUploadError(null);
                }}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Selector: Device Media vs Scripture Canvas */}
            <div className="px-5 pt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStudioMode("media")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  studioMode === "media"
                    ? "bg-white text-black shadow-md"
                    : "bg-white/[0.04] text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Device Media (Photo / Video)</span>
              </button>
              <button
                type="button"
                onClick={() => setStudioMode("canvas")}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  studioMode === "canvas"
                    ? "bg-white text-black shadow-md"
                    : "bg-white/[0.04] text-slate-400 hover:text-white"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Scripture Canvas</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUploadStory} className="p-5 pt-2 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* 1. MEDIA MODE (Device Upload) */}
              {studioMode === "media" && (
                <div>
                  {!previewUrl ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/15 hover:border-[#e5b842]/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-white/[0.06] text-[#e5b842] flex items-center justify-center shadow-inner">
                        <Upload className="w-6 h-6 stroke-[2]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-white">Select video or photo from your device</p>
                        <p className="text-xs text-slate-400 mt-0.5">Supports MP4, MOV, WEBM, JPG, PNG (up to 50MB)</p>
                      </div>
                      <button
                        type="button"
                        className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors shadow-sm"
                      >
                        Browse Files
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,video/*,.mp4,.mov,.webm,.m4v"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    /* Live 9:16 Preview Box */
                    <div className="relative aspect-[9/16] max-h-[350px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl flex items-center justify-center">
                      {isVideo || selectedFile?.type.startsWith("video") || previewUrl.startsWith("data:video") ? (
                        <video
                          src={previewUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={previewUrl} alt="Story preview" className="w-full h-full object-cover" />
                      )}

                      {/* Attached Badge in Preview */}
                      {selectedBadge && (
                        <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-[#e5b842] border border-[#e5b842]/30 flex items-center gap-1 shadow-lg">
                          <span>{selectedBadge}</span>
                        </div>
                      )}

                      {/* Attached Track in Preview */}
                      {selectedTrack && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white flex items-center gap-1 border border-white/20">
                          <Music className="w-3 h-3 text-[#e5b842]" />
                          <span className="truncate max-w-[120px]">{selectedTrack.replace("🎵 ", "")}</span>
                        </div>
                      )}

                      {/* Text in Preview */}
                      {caption && (
                        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/65 backdrop-blur-md text-xs text-white font-medium text-center shadow-lg leading-relaxed">
                          {caption}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                          setIsVideo(false);
                        }}
                        className="absolute bottom-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white"
                        title="Remove media"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* 2. CANVAS MODE (Scripture / Gradient Card) */}
              {studioMode === "canvas" && (
                <div className="space-y-3">
                  {/* Interactive Canvas Preview */}
                  <div
                    className={`relative aspect-[9/16] max-h-[350px] mx-auto rounded-2xl overflow-hidden bg-gradient-to-br ${selectedCanvas.gradient} border border-white/20 shadow-2xl p-6 flex flex-col justify-between text-center`}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between text-[11px]">
                      {selectedBadge ? (
                        <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[#e5b842] border border-[#e5b842]/30 font-semibold">
                          {selectedBadge}
                        </span>
                      ) : (
                        <span className="text-white/60">Faith Reflection</span>
                      )}

                      {selectedTrack && (
                        <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] flex items-center gap-1 border border-white/10">
                          <Music className="w-2.5 h-2.5 text-[#e5b842]" />
                          <span className="truncate max-w-[110px]">{selectedTrack.replace("🎵 ", "")}</span>
                        </span>
                      )}
                    </div>

                    {/* Middle: Custom scripture text */}
                    <div className="my-auto px-2">
                      <p
                        className={`text-sm sm:text-base text-white drop-shadow-md leading-relaxed ${
                          fontStyle === "serif"
                            ? "font-serif italic"
                            : fontStyle === "script"
                            ? "font-mono"
                            : fontStyle === "bold"
                            ? "font-extrabold uppercase tracking-wide"
                            : "font-sans font-medium"
                        }`}
                      >
                        {caption.trim() || "Type your Bible verse, testimony, or morning prayer below..."}
                      </p>
                    </div>

                    {/* Bottom Author Tag */}
                    <div className="flex items-center justify-center gap-2 text-[10px] text-white/70">
                      <span>@{user?.username || "faithverse"}</span>
                      <span>&bull;</span>
                      <span>FaithVerse 24h</span>
                    </div>
                  </div>

                  {/* Gradient Palettes */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[11px] font-semibold text-slate-300 block">Choose Canvas Aura:</label>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {STORY_CANVASES.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedCanvas(c)}
                          className={`h-8 px-3 rounded-xl text-[10px] font-medium bg-gradient-to-r ${c.gradient} text-white border whitespace-nowrap transition-transform ${
                            selectedCanvas.id === c.id
                              ? "border-[#e5b842] scale-105 ring-2 ring-[#e5b842]/40"
                              : "border-white/15 opacity-70 hover:opacity-100"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Faith Stickers / Badges Row */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5b842]" />
                  <span>Add Faith Badge:</span>
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {FAITH_BADGES.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBadge(selectedBadge === b ? null : b)}
                      className={`px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap border transition-colors ${
                        selectedBadge === b
                          ? "bg-[#e5b842] text-black font-bold border-[#e5b842]"
                          : "bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Worship Soundtrack Tag */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-blue-400" />
                  <span>Attach Worship Music Tag:</span>
                </label>
                <select
                  value={selectedTrack || ""}
                  onChange={(e) => setSelectedTrack(e.target.value || null)}
                  className="w-full bg-[#161a25] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e5b842]/50 cursor-pointer"
                >
                  <option value="">No Worship Soundtrack</option>
                  {WORSHIP_TRACKS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Input / Reflection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Story Scripture / Message:
                </label>
                <textarea
                  rows={2}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Share a Bible verse, what God spoke to you today, or a prayer request..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 resize-none leading-relaxed"
                />
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowUploader(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || (studioMode === "media" && !previewUrl)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 disabled:opacity-50 transition-all shadow-md flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>{uploading ? "Publishing Story..." : "Publish 24h Story"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ULTRA-PROFESSIONAL FULLSCREEN STORY VIEWER WITH REACTION TRAY */}
      {/* ========================================================== */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="relative w-full max-w-sm h-[88vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black flex flex-col justify-between">
            {/* Top Bar with Story Progress Line & Author Info */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
              {/* Segmented Progress Line */}
              <div className="flex items-center gap-1.5 mb-3">
                {stories.map((_, idx) => (
                  <div key={idx} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white transition-all duration-100 ease-linear"
                      style={{
                        width:
                          idx < (activeStoryIndex ?? 0)
                            ? "100%"
                            : idx === activeStoryIndex
                            ? `${progress}%`
                            : "0%",
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeStory.avatarUrl}
                    alt={activeStory.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-white/20"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-white">{activeStory.fullName}</p>
                      {activeStory.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#e5b842] fill-[#e5b842]/20" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-300">
                      {activeStory.mediaType === "VIDEO" ? "Video Reel" : "Faith Story"} &bull; 24h
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Audio Mute/Unmute for Video Stories */}
                  {(activeStory.mediaType === "VIDEO" ||
                    activeStory.storyMedia.startsWith("data:video") ||
                    Boolean(activeStory.storyMedia.match(/\.(mp4|webm|mov|ogg)($|\?)/i))) && (
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  )}

                  <button
                    onClick={() => setActiveStoryIndex(null)}
                    className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tap Left / Right to Jump Stories */}
            <div
              onClick={() => {
                if (activeStoryIndex !== null && activeStoryIndex > 0) {
                  setActiveStoryIndex(activeStoryIndex - 1);
                }
              }}
              className="absolute left-0 top-16 bottom-28 w-1/3 z-10 cursor-pointer"
            />
            <div
              onClick={() => {
                if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
                  setActiveStoryIndex(activeStoryIndex + 1);
                } else {
                  setActiveStoryIndex(null);
                }
              }}
              className="absolute right-0 top-16 bottom-28 w-1/3 z-10 cursor-pointer"
            />

            {/* Floating Reaction Animation */}
            {floatingReaction && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-bounce">
                <span className="text-6xl drop-shadow-2xl">{floatingReaction}</span>
              </div>
            )}

            {/* Main Media Content */}
            <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden">
              {activeStory.mediaType === "VIDEO" ||
              activeStory.storyMedia.startsWith("data:video") ||
              Boolean(activeStory.storyMedia.match(/\.(mp4|webm|mov|ogg)($|\?)/i)) ? (
                <video
                  src={activeStory.storyMedia}
                  autoPlay
                  playsInline
                  loop
                  muted={isMuted}
                  className="w-full h-full object-cover"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={activeStory.storyMedia}
                  alt="Story content"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Bottom Caption & Interactive Tray */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-20 space-y-2.5">
              {activeStory.caption && (
                <p className="text-xs text-white font-medium drop-shadow-md bg-black/50 backdrop-blur-md p-2.5 rounded-xl inline-block max-w-full leading-relaxed">
                  {activeStory.caption}
                </p>
              )}

              {/* Fast Reaction Tray (🙏, ❤️, 🔥, 🕊️, ✨, 🙌) */}
              <div className="flex items-center justify-between px-1 py-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10">
                {["🙏", "❤️", "🔥", "🕊️", "✨", "🙌"].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => sendReaction(emoji)}
                    className="p-1 text-lg hover:scale-125 active:scale-95 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Reply message input */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={replySent ? "Prayer / message sent! ✨" : `Reply to ${activeStory.fullName.split(" ")[0]}...`}
                    disabled={replySent}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && replyText.trim()) {
                        setReplySent(true);
                        setReplyText("");
                      }
                    }}
                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs text-white placeholder-slate-300 focus:outline-none focus:border-white transition-colors"
                  />
                  {replyText.trim() && (
                    <button
                      onClick={() => {
                        setReplySent(true);
                        setReplyText("");
                      }}
                      className="absolute right-2.5 top-2 text-white"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setStoryLiked(!storyLiked)}
                  className={`p-2 rounded-full transition-transform active:scale-125 ${
                    storyLiked
                      ? "bg-rose-500/20 text-rose-500"
                      : "bg-white/10 backdrop-blur-md text-white hover:text-rose-400"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${storyLiked ? "fill-current" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
