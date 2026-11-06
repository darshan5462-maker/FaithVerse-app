"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusSquare, Image, Film, Clock, CheckCircle, Send, ShieldCheck } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

export default function CreateStudioPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [contentType, setContentType] = useState<"PHOTO" | "VIDEO" | "STORY">("PHOTO");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("FAITH_GROWTH");
  const [mediaUrl, setMediaUrl] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setSubmitting(true);
    try {
      const fullText = hashtags.trim() ? `${content.trim()}\n\n${hashtags.trim()}` : content.trim();

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.id,
          content: fullText,
          category,
          postType: contentType,
          mediaUrls: mediaUrl.trim() ? [mediaUrl.trim()] : [],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        alert(data.error || "Submission error");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting content");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <PlusSquare className="w-3.5 h-3.5 text-[#e5b842]" />
          <span>Creator Studio</span>
        </div>
        <h1 className="text-xl font-bold text-white">Create with Purpose</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Share your testimony, reflections, gospel music, or worship videos. All public posts undergo human moderation review before being published.
        </p>
      </div>

      {/* Content Format Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: "PHOTO", label: "Post / Photo", icon: Image },
          { key: "VIDEO", label: "Sermon / Reel", icon: Film },
          { key: "STORY", label: "24h Story", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = contentType === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setContentType(tab.key as any)}
              className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors ${
                isActive
                  ? "bg-white text-black font-semibold border-white shadow-sm"
                  : "bg-[#11141d] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Submission Form */}
      <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-4 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Your Message or Reflection:
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your encouraging thoughts, Bible verse commentary, or story..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Content Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/20"
              >
                <option value="FAITH_GROWTH" className="bg-[#11141d]">Faith Growth</option>
                <option value="BIBLE_TEACHING" className="bg-[#11141d]">Bible Teaching</option>
                <option value="WORSHIP_MUSIC" className="bg-[#11141d]">Worship & Gospel</option>
                <option value="TESTIMONY" className="bg-[#11141d]">Testimony</option>
                <option value="PRAYER" className="bg-[#11141d]">Prayer Request</option>
                <option value="INSPIRATION" className="bg-[#11141d]">Inspiration</option>
                <option value="COMMUNITY" className="bg-[#11141d]">Community</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Media URL (Image / Video):
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... (Cloudinary, Unsplash)"
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Add Hashtags:
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#BibleStudy #WorshipTogether #GraceUnbounded"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Guidelines checklist */}
          <div className="bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.04] space-y-1.5 text-[11px] text-slate-400">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e5b842]" />
              Moderation Assurance
            </span>
            <p className="text-slate-400">
              Every public post is held in the moderation queue until verified by administrators, keeping the community safe and uplifting for all.
            </p>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="w-full py-2.5 px-5 rounded-xl font-semibold text-xs bg-white text-black hover:bg-slate-200 disabled:opacity-40 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Submitting..." : "Submit for Approval"}</span>
            </button>
          </div>

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                Submission received! Your post is in the review queue. Redirecting...
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
