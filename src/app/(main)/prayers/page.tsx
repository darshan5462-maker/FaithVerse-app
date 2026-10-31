"use client";

import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  Plus,
  CheckCircle2,
  Sparkles,
  Users,
  Lock,
  EyeOff,
  Filter,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";
import { formatTimeAgo, formatNumberCompact } from "@/lib/utils";

export default function PrayerWallPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [prayers, setPrayers] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Submit Modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/prayers?filter=${filter}&userId=${user?.id || ""}`);
      const data = await res.json();
      if (data.success) {
        setPrayers(data.prayers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [filter, user?.id]);

  const handlePrayAction = async (prayerId: string) => {
    if (!user) {
      alert("Please sign in or switch to an active persona to pray for community members.");
      return;
    }

    // Optimistic update
    setPrayers((prev) =>
      prev.map((p) => {
        if (p.id === prayerId) {
          const nextPrayed = !p.hasPrayed;
          return {
            ...p,
            hasPrayed: nextPrayed,
            prayerCount: nextPrayed ? p.prayerCount + 1 : Math.max(0, p.prayerCount - 1),
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/prayers/${prayerId}/pray`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch {
      fetchPrayers();
    }
  };

  const handleSubmitPrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/prayers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: user.id,
          title: title.trim(),
          description: description.trim(),
          isAnonymous,
          isPrivate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setTitle("");
        setDescription("");
        setIsAnonymous(false);
        setIsPrivate(false);
        fetchPrayers();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="glass-card bg-gradient-to-br from-[#0d1527] via-[#131e3a] to-[#1a153a] p-6 rounded-3xl border border-[#d4af37]/35 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
            <HeartHandshake className="w-4 h-4 text-[#d4af37]" />
            <span>Sacred Intercession Wall</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {t.prayerWall.title}
          </h1>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            {t.prayerWall.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={() => setShowModal(true)}
              className="py-2.5 px-5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] text-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.prayerWall.submitRequest}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold">
        {[
          { key: "all", label: "All Petitions" },
          { key: "active", label: "Active Requests" },
          { key: "answered", label: "Answered Praise Reports ✨" },
          { key: "mine", label: "My Prayers" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === item.key
                ? "bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Prayer Cards Grid */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Gathering community prayer requests...
          </div>
        ) : prayers.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/40 p-12 text-center rounded-2xl border border-white/5 space-y-2">
            <Sparkles className="w-8 h-8 text-[#d4af37] mx-auto opacity-70" />
            <h3 className="text-sm font-bold text-white">No Requests Found</h3>
            <p className="text-xs text-slate-400">
              Submit your request or share an answered prayer praise report.
            </p>
          </div>
        ) : (
          prayers.map((prayer) => (
            <div
              key={prayer.id}
              className={`glass-card bg-[#0d1527]/80 rounded-2xl p-5 border transition-all ${
                prayer.isAnswered
                  ? "border-emerald-500/40 bg-emerald-950/15"
                  : "border-white/10 hover:border-amber-400/30"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prayer.author.avatarUrl}
                    alt={prayer.author.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">
                        {prayer.author.fullName}
                      </span>
                      {prayer.isAnonymous && (
                        <span className="text-[10px] text-slate-400 italic">
                          (Anonymous)
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {formatTimeAgo(prayer.createdAt)}
                    </span>
                  </div>
                </div>

                {prayer.isAnswered ? (
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Answered Prayer</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Needs Prayer
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white mb-2">{prayer.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {prayer.description}
              </p>

              {prayer.answeredNotes && (
                <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl mb-3">
                  <strong>Praise Note:</strong> {prayer.answeredNotes}
                </div>
              )}

              {/* Intercession Action Button */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>
                    <strong>{formatNumberCompact(prayer.prayerCount)}</strong> people standing in prayer
                  </span>
                </div>

                <button
                  onClick={() => handlePrayAction(prayer.id)}
                  className={`py-1.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 shadow-md ${
                    prayer.hasPrayed
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <HeartHandshake className={`w-4 h-4 ${prayer.hasPrayed ? "text-emerald-400" : "text-[#d4af37]"}`} />
                  <span>{prayer.hasPrayed ? "You Prayed" : t.prayerWall.iPrayed}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Prayer Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card bg-[#0d1527] border border-[#d4af37]/40 max-w-md w-full p-6 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-[#d4af37] font-bold text-base">
              <HeartHandshake className="w-5 h-5" />
              <span>Submit a Prayer Petition</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Share what is on your heart. The global FaithVerse family will lift you up in prayer.
            </p>

            <form onSubmit={handleSubmitPrayer} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Title / Intention:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Healing for my father, peace during exams..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Prayer Details:</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your situation and what specific prayer support you need..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37] resize-none"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded accent-[#d4af37]"
                  />
                  <span>Post Anonymously</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded accent-[#d4af37]"
                  />
                  <span>Private (My eyes only)</span>
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !title.trim() || !description.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-amber-500 text-black shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 transition-all"
                >
                  {submitting ? "Submitting..." : "Submit Petition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
