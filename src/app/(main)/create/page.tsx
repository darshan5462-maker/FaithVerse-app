"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PlusSquare, Image, Film, Clock, ShieldAlert, CheckCircle, Send, Sparkles } from "lucide-react";
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
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="glass-card bg-[#0d1527] p-6 rounded-3xl border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
          <PlusSquare className="w-4 h-4 text-[#d4af37]" />
          <span>Creator Studio & Submission</span>
        </div>
        <h1 className="text-2xl font-black text-white">Create with Purpose</h1>
        <p className="text-xs text-slate-300 leading-relaxed">
          Share your testimony, reflections, gospel music, or worship videos. All public posts undergo moderation review before being published.
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
              className={`p-3.5 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                isActive
                  ? "bg-[#d4af37]/20 border-[#d4af37] text-[#f3d478] shadow-lg shadow-amber-500/10"
                  : "bg-[#0d1527]/60 border-white/5 text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Submission Form */}
      <div className="glass-card bg-[#0d1527]/90 p-6 rounded-3xl border border-white/10 space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Your Message or Reflection:
            </label>
            <textarea
              rows={5}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your encouraging thoughts, Bible verse commentary, or story..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Content Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#d4af37]"
              >
                <option value="FAITH_GROWTH" className="bg-[#0d1527]">Faith Growth & Discipleship</option>
                <option value="BIBLE_TEACHING" className="bg-[#0d1527]">Bible Teaching & Scripture</option>
                <option value="WORSHIP_MUSIC" className="bg-[#0d1527]">Worship & Gospel Music</option>
                <option value="TESTIMONY" className="bg-[#0d1527]">Personal Faith Testimony</option>
                <option value="PRAYER" className="bg-[#0d1527]">Prayer Request</option>
                <option value="INSPIRATION" className="bg-[#0d1527]">Daily Inspiration</option>
                <option value="COMMUNITY" className="bg-[#0d1527]">Community Question</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Media URL (Image / Video):
              </label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://... (Cloudinary, Unsplash)"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Add Hashtags (space separated):
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#BibleStudy #WorshipTogether #FaithJourney"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          {/* Guidelines checklist */}
          <div className="bg-[#070b14]/70 p-4 rounded-2xl border border-white/5 space-y-2 text-[11px] text-slate-400">
            <span className="font-bold text-[#d4af37] block">Community Submission Standard:</span>
            <ul className="space-y-1 list-disc list-inside">
              <li>Open to all creators and backgrounds.</li>
              <li>Respectful, truthful, and inspiring communication.</li>
              <li>No spam, scam links, hate speech, or commercial solicitations.</li>
              <li>All public content is reviewed by human moderators before publishing.</li>
            </ul>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] text-black shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Submitting to Moderation..." : "Submit Content for Approval"}</span>
            </button>
          </div>

          {success && (
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>
                Submission received! Your post is now in the Administrator Review queue. Redirecting to feed...
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
