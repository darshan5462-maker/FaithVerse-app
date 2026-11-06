"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, X, Upload, Heart, Send, CheckCircle2, Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
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
}

export default function StoriesBar() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stories, setStories] = useState<StoryItem[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showUploader, setShowUploader] = useState(false);

  // Uploader state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [storyLiked, setStoryLiked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);

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
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload story to Supabase
  const handleUploadStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !user) return;

    setUploading(true);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          mediaUrl: previewUrl,
          mediaType: selectedFile?.type.startsWith("video") ? "VIDEO" : "IMAGE",
          caption: caption.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.story) {
        setStories((prev) => [data.story, ...prev]);
        setShowUploader(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        setCaption("");
      }
    } catch (err) {
      console.error("Upload failed:", err);
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
          // Advance to next story or close
          if (activeStoryIndex < stories.length - 1) {
            setActiveStoryIndex(activeStoryIndex + 1);
            return 0;
          } else {
            setActiveStoryIndex(null);
            return 0;
          }
        }
        return prev + 2; // 5 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStoryIndex, stories.length]);

  const activeStory = activeStoryIndex !== null ? stories[activeStoryIndex] : null;

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-none">
        {/* Instagram-style Add Story from Device */}
        <div
          onClick={() => setShowUploader(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-15 h-15 rounded-full p-[2px] bg-white/[0.08] group-hover:bg-[#e5b842] transition-colors">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center p-[2px]">
              {user ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="You" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-4.5 h-4.5 rounded-full bg-white text-black flex items-center justify-center border-2 border-[#090a0f] shadow-sm group-hover:scale-110 transition-transform">
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400 group-hover:text-white transition-colors truncate w-16 text-center">
            Your Story
          </span>
        </div>

        {/* Active Stories List */}
        {stories.map((story, idx) => (
          <div
            key={story.id + idx}
            onClick={() => setActiveStoryIndex(idx)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="w-15 h-15 rounded-full p-[2px] bg-gradient-to-tr from-[#e5b842] via-amber-400 to-rose-500 group-hover:scale-105 active:scale-95 transition-transform">
              <div className="w-full h-full rounded-full overflow-hidden p-[2px] bg-[#090a0f]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.avatarUrl}
                  alt={story.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300 group-hover:text-white transition-colors truncate w-16 text-center">
              {story.fullName ? story.fullName.split(" ")[0] : story.username}
            </span>
          </div>
        ))}
      </div>

      {/* INSTAGRAM-STYLE DEVICE UPLOADER MODAL */}
      {showUploader && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/10 max-w-md w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-fade-in flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#e5b842]" />
                <h3 className="text-sm font-bold text-white">Create 24h Story</h3>
              </div>
              <button
                onClick={() => {
                  setShowUploader(false);
                  setPreviewUrl(null);
                  setSelectedFile(null);
                }}
                className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Area */}
            <form onSubmit={handleUploadStory} className="p-5 space-y-4 overflow-y-auto">
              {/* Device File Picker Dropzone */}
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/15 hover:border-[#e5b842]/50 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.04]"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.06] text-[#e5b842] flex items-center justify-center shadow-inner">
                    <Upload className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">Select photo or video from device</p>
                    <p className="text-xs text-slate-400 mt-0.5">Supports JPG, PNG, WEBP, or MP4</p>
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
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                /* Live Device Preview */
                <div className="space-y-3">
                  <div className="relative aspect-[9/16] max-h-[360px] mx-auto rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/90 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {caption && (
                      <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-black/60 backdrop-blur-md text-xs text-white font-medium">
                        {caption}
                      </div>
                    )}
                  </div>

                  {/* Caption Input */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Add a thought, scripture, or prayer note:
                    </label>
                    <input
                      type="text"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="e.g. Grateful for God's grace this morning! 🙏"
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40 transition-colors"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
                    >
                      Pick Another
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 disabled:opacity-50 transition-all shadow-sm flex items-center gap-2"
                    >
                      {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      <span>{uploading ? "Sharing to Story..." : "Share to Story"}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* INSTAGRAM-STYLE FULLSCREEN STORY VIEWER */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="relative w-full max-w-sm h-[88vh] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black flex flex-col justify-between">
            {/* Top Bar with Story Progress Line & Author Info */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
              {/* Multi-story Segment Progress Indicators */}
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
                    <p className="text-[10px] text-slate-300">Active 24h Story</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStoryIndex(null)}
                  className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Click Left / Right to Jump Stories */}
            <div
              onClick={() => {
                if (activeStoryIndex !== null && activeStoryIndex > 0) {
                  setActiveStoryIndex(activeStoryIndex - 1);
                }
              }}
              className="absolute left-0 top-16 bottom-20 w-1/3 z-10 cursor-pointer"
            />
            <div
              onClick={() => {
                if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
                  setActiveStoryIndex(activeStoryIndex + 1);
                } else {
                  setActiveStoryIndex(null);
                }
              }}
              className="absolute right-0 top-16 bottom-20 w-1/3 z-10 cursor-pointer"
            />

            {/* Main Story Image or Video */}
            <div className="w-full h-full flex items-center justify-center bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeStory.storyMedia}
                alt="Story content"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Caption & Instagram-style Interactive Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/70 to-transparent z-20 space-y-3">
              {activeStory.caption && (
                <p className="text-xs text-white font-medium drop-shadow-md bg-black/40 backdrop-blur-sm p-2 rounded-xl inline-block max-w-full">
                  {activeStory.caption}
                </p>
              )}

              {/* Instagram-style Direct Reply & Heart */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={replySent ? "Message sent! ✨" : `Send message to ${activeStory.fullName.split(" ")[0]}...`}
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
                  className={`p-2.5 rounded-full transition-transform active:scale-125 ${
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
