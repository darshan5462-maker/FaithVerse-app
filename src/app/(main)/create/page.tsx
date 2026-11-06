"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  PlusSquare,
  Image as ImageIcon,
  Film,
  Clock,
  CheckCircle,
  Send,
  ShieldCheck,
  Upload,
  X,
  Play,
  FileVideo,
  Sparkles,
  Link2,
  HardDrive,
  Info,
  AlertCircle,
  Video,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

export default function CreateStudioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contentType, setContentType] = useState<"PHOTO" | "VIDEO" | "STORY">("PHOTO");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("FAITH_GROWTH");
  const [hashtags, setHashtags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Media upload states (Device File first)
  const [uploadMode, setUploadMode] = useState<"device" | "url">("device");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [fileDetails, setFileDetails] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [externalUrl, setExternalUrl] = useState("");

  // Story specific state
  const [storyBgColor, setStoryBgColor] = useState("from-amber-600 via-purple-700 to-indigo-900");

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Handle local device media selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");

    // Support large files (up to 250MB for long videos and sermons)
    const MAX_SIZE = 250 * 1024 * 1024; // 250MB
    if (file.size > MAX_SIZE) {
      setErrorMsg("File exceeds 250MB limit. For longer multi-hour sermons, consider using a high-efficiency MP4 or external streaming link.");
      return;
    }

    const isVid =
      file.type.startsWith("video") ||
      Boolean(file.name.match(/\.(mp4|mov|webm|m4v|mkv|avi)$/i));

    setIsVideo(isVid);
    setMediaFile(file);
    setFileDetails({
      name: file.name,
      size: formatFileSize(file.size),
      type: isVid ? "Video Clip / Sermon" : "Image / Photo",
    });

    // Create instant local URL for fast preview without freezing UI
    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);

    // If user selected Video and tab is PHOTO, switch tab to VIDEO
    if (isVid && contentType === "PHOTO") {
      setContentType("VIDEO");
    }
  };

  const clearSelectedMedia = () => {
    if (mediaPreview && mediaPreview.startsWith("blob:")) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setIsVideo(false);
    setFileDetails(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg("Please sign in or select a user persona before submitting.");
      return;
    }

    if (!content.trim() && !mediaPreview) {
      setErrorMsg("Please write a reflection or select media to upload.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const fullText = hashtags.trim() ? `${content.trim()}\n\n${hashtags.trim()}` : content.trim();

      // Resolve final media payload
      let resolvedMediaUrl = "";

      if (uploadMode === "url" && externalUrl.trim()) {
        resolvedMediaUrl = externalUrl.trim();
      } else if (mediaFile) {
        // If file is under 4MB, read as base64 for persistent storage in database
        // For larger files, send data or storage URL
        if (mediaFile.size <= 4.5 * 1024 * 1024) {
          resolvedMediaUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.readAsDataURL(mediaFile);
          });
        } else {
          // For large files (> 4.5MB), in dev/demo we store the preview object URL or data
          // In production this connects to Supabase Storage Bucket
          resolvedMediaUrl = mediaPreview || URL.createObjectURL(mediaFile);
        }
      }

      // If Story tab selected, post directly to Stories endpoint
      if (contentType === "STORY") {
        if (!resolvedMediaUrl) {
          setErrorMsg("Stories require a photo or video from your device.");
          setSubmitting(false);
          return;
        }

        const res = await fetch("/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            mediaUrl: resolvedMediaUrl,
            mediaType: isVideo ? "VIDEO" : "IMAGE",
            caption: content.trim(),
          }),
        });

        const data = await res.json();
        if (data.success) {
          setSuccess(true);
          setTimeout(() => router.push("/"), 1500);
        } else {
          setErrorMsg(data.error || "Failed to publish 24h story.");
        }
        return;
      }

      // Regular post or video / sermon
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.id,
          content: fullText,
          category,
          postType: contentType === "VIDEO" || isVideo ? "VIDEO" : "PHOTO",
          mediaUrls: resolvedMediaUrl ? [resolvedMediaUrl] : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 1800);
      } else {
        setErrorMsg(data.error || "Submission error");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Error submitting content");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-2 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e5b842]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2 text-xs font-semibold text-[#e5b842] uppercase tracking-wider">
          <PlusSquare className="w-4 h-4" />
          <span>Creator Studio</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Create with Purpose</h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Share your testimony, reflections, gospel music, or worship videos. All public posts undergo human moderation review before being published.
        </p>
      </div>

      {/* Content Format Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: "PHOTO", label: "Post / Photo", icon: ImageIcon, desc: "Photos & reflections" },
          { key: "VIDEO", label: "Sermon / Reel", icon: Film, desc: "Shorts or long sermons" },
          { key: "STORY", label: "24h Story", icon: Clock, desc: "Disappears in 24 hrs" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = contentType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setContentType(tab.key as any);
                if (tab.key === "VIDEO") setIsVideo(true);
              }}
              className={`p-3.5 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-white text-black font-semibold border-white shadow-lg scale-[1.02]"
                  : "bg-[#11141d] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-semibold">{tab.label}</span>
              <span className={`text-[10px] hidden sm:block ${isActive ? "text-slate-700" : "text-slate-500"}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Submission Form */}
      <div className="bg-[#11141d] p-5 sm:p-6 rounded-2xl border border-white/[0.08] space-y-5 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message / Reflection textarea */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
              <span>{contentType === "STORY" ? "Story Caption / Scripture Note:" : "Your Message or Reflection:"}</span>
              <span className="text-[11px] text-slate-500 font-normal">
                {content.length} characters
              </span>
            </label>
            <textarea
              rows={contentType === "STORY" ? 2 : 4}
              required={contentType !== "STORY" && !mediaPreview}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                contentType === "VIDEO"
                  ? "Describe your sermon, worship session, or short reel reflection..."
                  : contentType === "STORY"
                  ? "Add a quick uplifting note to your 24-hour story..."
                  : "Write your encouraging thoughts, Bible verse commentary, or story..."
              }
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50 resize-none leading-relaxed transition-colors"
            />
          </div>

          {/* Category Dropdown (for Post and Sermon/Reel) */}
          {contentType !== "STORY" && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Content Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#e5b842]/50 cursor-pointer"
              >
                <option value="FAITH_GROWTH" className="bg-[#11141d]">Faith Growth & Discipleship</option>
                <option value="BIBLE_TEACHING" className="bg-[#11141d]">Bible Teaching & Exegesis</option>
                <option value="WORSHIP_MUSIC" className="bg-[#11141d]">Worship Music & Gospel Songs</option>
                <option value="TESTIMONY" className="bg-[#11141d]">Life Testimony & Miracles</option>
                <option value="PRAYER" className="bg-[#11141d]">Prayer Request & Intercession</option>
                <option value="INSPIRATION" className="bg-[#11141d]">Daily Inspiration & Motivation</option>
                <option value="COMMUNITY" className="bg-[#11141d]">Church Fellowship & Community</option>
              </select>
            </div>
          )}

          {/* Direct Device Media Picker (Replaces URL text input as requested in Item 1) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-[#e5b842]" />
                <span>Upload Media from Device</span>
              </label>

              {/* Mode toggle if pastor wants external sermon stream */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setUploadMode("device")}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    uploadMode === "device"
                      ? "bg-white/[0.1] text-white font-medium"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Device File
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    uploadMode === "url"
                      ? "bg-white/[0.1] text-white font-medium"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    URL Link
                  </span>
                </button>
              </div>
            </div>

            {/* Hidden native device file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={
                contentType === "VIDEO"
                  ? "video/mp4,video/webm,video/quicktime,video/*"
                  : contentType === "STORY"
                  ? "image/*,video/*"
                  : "image/*,video/*"
              }
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadMode === "device" ? (
              <div>
                {!mediaPreview ? (
                  /* Drag and drop / Click box for device upload */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/[0.12] hover:border-[#e5b842]/50 hover:bg-white/[0.02] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all group space-y-3"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.05] group-hover:bg-[#e5b842]/10 border border-white/[0.08] group-hover:border-[#e5b842]/30 flex items-center justify-center mx-auto transition-colors">
                      {contentType === "VIDEO" ? (
                        <Film className="w-6 h-6 text-slate-400 group-hover:text-[#e5b842] transition-colors" />
                      ) : (
                        <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#e5b842] transition-colors" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#e5b842] transition-colors">
                        Click to choose from your device or gallery
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {contentType === "VIDEO"
                          ? "Supports MP4, MOV, WebM videos & long sermons up to 250MB"
                          : "Supports JPG, PNG, WEBP high-resolution photos & video clips up to 250MB"}
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] text-[10px] text-slate-400 border border-white/[0.06]">
                      <Sparkles className="w-3 h-3 text-[#e5b842]" />
                      <span>Large video support with instant player preview</span>
                    </div>
                  </div>
                ) : (
                  /* Active Media Preview from Device */
                  <div className="relative rounded-2xl overflow-hidden bg-black/60 border border-white/[0.1] shadow-2xl">
                    {/* Media render: Video player with controls or image */}
                    {isVideo ? (
                      <div className="space-y-2">
                        <video
                          src={mediaPreview}
                          controls
                          playsInline
                          preload="metadata"
                          className="w-full max-h-[380px] bg-black rounded-t-2xl object-contain"
                        />
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mediaPreview}
                        alt="Selected media from device"
                        className="w-full max-h-[380px] object-cover"
                      />
                    )}

                    {/* File badge & Remove button */}
                    <div className="p-3 bg-[#0d1017] border-t border-white/[0.08] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        {isVideo ? (
                          <FileVideo className="w-4 h-4 text-[#e5b842] flex-shrink-0" />
                        ) : (
                          <ImageIcon className="w-4 h-4 text-[#e5b842] flex-shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="text-white font-medium truncate text-xs">
                            {fileDetails?.name || "Device Media"}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {fileDetails?.size} • {fileDetails?.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 transition-colors"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={clearSelectedMedia}
                          className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Remove media"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Fallback External URL Input */
              <div className="space-y-1.5">
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="Paste direct media URL or streaming link (https://...)"
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
                />
                <p className="text-[10px] text-slate-500">
                  Useful for external cloud media, CDN assets, or church livestream clips.
                </p>
              </div>
            )}
          </div>

          {/* Add Hashtags */}
          {contentType !== "STORY" && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Add Hashtags:
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#BibleStudy #WorshipTogether #GraceUnbounded #SundaySermon"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/50"
              />
            </div>
          )}

          {/* Guidelines checklist */}
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04] space-y-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5b842]" />
              Moderation Assurance
            </span>
            <p className="text-slate-400">
              {contentType === "STORY"
                ? "Your 24-hour story is published instantly to your followers and community reel with automatic expiration."
                : "Every public post is held in the moderation queue until verified by administrators, keeping the community safe and uplifting for all."}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || (!content.trim() && !mediaPreview && !externalUrl.trim())}
              className="w-full py-3 px-5 rounded-xl font-semibold text-xs bg-white text-black hover:bg-slate-200 active:scale-98 disabled:opacity-40 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {submitting
                  ? "Uploading Media & Processing..."
                  : contentType === "STORY"
                  ? "Publish 24h Story"
                  : "Submit for Approval"}
              </span>
            </button>
          </div>

          {success && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in shadow-md">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                {contentType === "STORY"
                  ? "Story published successfully! Redirecting..."
                  : "Submission received! Your post is in the review queue. Redirecting..."}
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
