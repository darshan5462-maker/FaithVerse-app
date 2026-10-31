"use client";

import React, { useState } from "react";
import { Image, ShieldAlert, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";

interface CreatePostWidgetProps {
  onPostCreated?: () => void;
}

export default function CreatePostWidget({ onPostCreated }: CreatePostWidgetProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("FAITH_GROWTH");
  const [mediaUrl, setMediaUrl] = useState("");
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState(false);

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
          mediaUrls: mediaUrl.trim() ? [mediaUrl.trim()] : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setContent("");
        setMediaUrl("");
        setShowMediaInput(false);
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
    { value: "FAITH_GROWTH", label: "Faith Growth & Life" },
    { value: "BIBLE_TEACHING", label: "Bible Teaching" },
    { value: "WORSHIP_MUSIC", label: "Worship & Gospel" },
    { value: "TESTIMONY", label: "Christian Testimony" },
    { value: "PRAYER", label: "Prayer Request" },
    { value: "INSPIRATION", label: "Daily Inspiration" },
    { value: "COMMUNITY", label: "Community Discussion" },
  ];

  return (
    <div className="glass-card bg-[#0d1527]/80 border border-white/10 rounded-2xl p-4 mb-6 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-start gap-3">
          {user ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/40 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-700 flex-shrink-0" />
          )}

          <div className="flex-1 min-w-0">
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t.feed.createPrompt}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#d4af37]/50 resize-none"
            />
          </div>
        </div>

        {/* Media URL Input toggle */}
        {showMediaInput && (
          <div className="pl-13 animate-fade-in">
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="Paste photo URL (e.g. Unsplash, Cloudinary)..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/50"
            />
          </div>
        )}

        {/* Category selector & Action bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white/5 border border-white/10 text-xs text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#d4af37]/50 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value} className="bg-[#0d1527] text-white">
                  {c.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setShowMediaInput(!showMediaInput)}
              className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                showMediaInput ? "bg-[#d4af37]/20 text-[#f3d478]" : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Add Photo</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="py-2 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] text-black shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submitting ? "Submitting..." : "Submit for Approval"}</span>
          </button>
        </div>

        {/* Moderation Workflow Assurance Notice */}
        <div className="flex items-start gap-2 bg-[#d4af37]/10 border border-[#d4af37]/25 rounded-xl p-2.5 text-[11px] text-[#f3d478] leading-tight">
          <ShieldAlert className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Mandatory Moderation:</strong> All public submissions are held in the moderation queue until verified by administrators, ensuring a safe, uplifting community for everyone.
          </span>
        </div>

        {/* Success Confirmation Toast */}
        {submittedMessage && (
          <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              Your post has entered the Admin Review Queue! Admins can approve it in the Admin Hub.
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
