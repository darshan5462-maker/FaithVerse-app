"use client";

import React, { useState, useRef } from "react";
import { Image as ImageIcon, ShieldCheck, Send, CheckCircle2, X, Loader2, Upload } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";

interface CreatePostWidgetProps {
  onPostCreated?: () => void;
}

export default function CreatePostWidget({ onPostCreated }: CreatePostWidgetProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("FAITH_GROWTH");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleDeviceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVid = file.type.startsWith("video") || Boolean(file.name.match(/\.(mp4|mov|webm)$/i));
      setIsVideo(isVid);
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.id,
          content: content.trim(),
          category,
          postType: isVideo ? "VIDEO" : "PHOTO",
          mediaUrls: mediaPreview ? [mediaPreview] : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setContent("");
        setMediaPreview(null);
        setSubmittedMessage(true);
        setTimeout(() => setSubmittedMessage(false), 5000);
        if (onPostCreated) onPostCreated();
      } else {
        alert(data.error || "Failed to submit post");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting post");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: "FAITH_GROWTH", label: "Faith Growth" },
    { value: "BIBLE_TEACHING", label: "Bible Teaching" },
    { value: "WORSHIP_MUSIC", label: "Worship & Gospel" },
    { value: "TESTIMONY", label: "Testimony" },
    { value: "PRAYER", label: "Prayer Request" },
    { value: "INSPIRATION", label: "Inspiration" },
    { value: "COMMUNITY", label: "Community" },
  ];

  return (
    <div className="bg-[#11141d] border border-white/[0.08] rounded-2xl p-4 mb-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start gap-3">
          {user ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-9 h-9 rounded-full object-cover border border-white/[0.1] flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-800 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <textarea
              rows={2}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share an encouraging thought, Bible verse, or testimony..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Selected Media Preview */}
        {mediaPreview && (
          <div className="relative rounded-xl overflow-hidden max-h-48 bg-black/60 border border-white/[0.08] inline-block animate-fade-in">
            {isVideo ? (
              <video
                src={mediaPreview}
                controls
                playsInline
                className="h-44 w-auto rounded-xl object-contain bg-black"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={mediaPreview} alt="Preview" className="h-44 w-auto object-cover rounded-xl" />
            )}
            <button
              type="button"
              onClick={() => {
                setMediaPreview(null);
                setIsVideo(false);
              }}
              className="absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Category selector & Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-white/20 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#11141d] text-white">
                  {c.label}
                </option>
              ))}
            </select>

            {/* Direct Device Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                mediaPreview
                  ? "bg-white/[0.1] text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{mediaPreview ? (isVideo ? "Video Clip Added" : "Photo Added") : "Add Photo / Video"}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleDeviceFile}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5b842]" />
              Requires Admin Approval
            </span>

            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="py-1.5 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 active:scale-[0.98] disabled:opacity-40 transition-all flex items-center gap-1.5 shadow-sm"
            >
              {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>{submitting ? "Submitting..." : "Submit for Approval"}</span>
            </button>
          </div>
        </div>

        {/* Success Confirmation Toast */}
        {submittedMessage && (
          <div className="flex items-center gap-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Submitted for Admin Approval!</strong> Your post is in the moderation queue and will appear publicly on the feed once an admin approves it.
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
