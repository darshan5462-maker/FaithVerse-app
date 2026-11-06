"use client";

import React, { useState, useEffect } from "react";
import {
  HeartHandshake,
  Plus,
  CheckCircle2,
  Sparkles,
  Users,
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
      alert("Please sign in or select a demo persona to pray for community members.");
      return;
    }

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
    <div className="space-y-5">
      {/* Hero Header */}
      <div className="bg-[#11141d] p-6 rounded-2xl border border-white/[0.08] space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <HeartHandshake className="w-3.5 h-3.5 text-[#e5b842]" />
          <span>Intercession Wall</span>
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          {t.prayerWall.title}
        </h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          {t.prayerWall.subtitle}
        </p>

        <div className="pt-2">
          <button
            onClick={() => setShowModal(true)}
            className="py-2 px-4 rounded-xl font-semibold text-xs bg-white text-black hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{t.prayerWall.submitRequest}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.08] pb-1 text-xs">
        {[
          { key: "all", label: "All Petitions" },
          { key: "active", label: "Active" },
          { key: "answered", label: "Answered Prayers" },
          { key: "mine", label: "My Prayers" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === item.key
                ? "bg-white/[0.08] text-white font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.03]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Prayer Cards Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">
            Gathering community prayer requests...
          </div>
        ) : prayers.length === 0 ? (
          <div className="bg-[#11141d] border border-white/[0.08] p-12 text-center rounded-2xl space-y-2">
            <Sparkles className="w-8 h-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No Requests Found</h3>
            <p className="text-xs text-slate-400">
              Submit your request or share an answered prayer praise report.
            </p>
          </div>
        ) : (
          prayers.map((prayer) => (
            <div
              key={prayer.id}
              className={`bg-[#11141d] rounded-2xl p-5 border transition-colors ${
                prayer.isAnswered
                  ? "border-emerald-500/30 bg-emerald-950/[0.08]"
                  : "border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prayer.author.avatarUrl}
                    alt={prayer.author.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-white/[0.08]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-white">
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
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Answered Prayer</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                    Active
                  </span>
                )}
              </div>

              <h3 className="text-sm font-semibold text-white mb-1.5">{prayer.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {prayer.description}
              </p>

              {prayer.answeredNotes && (
                <div className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl mb-3">
                  <strong>Praise Note:</strong> {prayer.answeredNotes}
                </div>
              )}

              {/* Intercession Action Button */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Users className="w-3.5 h-3.5 text-[#e5b842]" />
                  <span>
                    <strong>{formatNumberCompact(prayer.prayerCount)}</strong> praying
                  </span>
                </div>

                <button
                  onClick={() => handlePrayAction(prayer.id)}
                  className={`py-1.5 px-3.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors ${
                    prayer.hasPrayed
                      ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/25"
                      : "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08]"
                  }`}
                >
                  <HeartHandshake className={`w-3.5 h-3.5 ${prayer.hasPrayed ? "text-emerald-400" : "text-[#e5b842]"}`} />
                  <span>{prayer.hasPrayed ? "You Prayed" : t.prayerWall.iPrayed}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Submit Prayer Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border border-white/[0.12] max-w-md w-full p-6 rounded-2xl space-y-4 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <HeartHandshake className="w-4 h-4 text-[#e5b842]" />
              <span>Submit Prayer Request</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Share what is on your heart. The community will lift you up in prayer.
            </p>

            <form onSubmit={handleSubmitPrayer} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Title:</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Healing for my father, peace during exams..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Details:</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your situation and prayer needs..."
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-white/20 resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded accent-white"
                  />
                  <span>Post Anonymously</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded accent-white"
                  />
                  <span>Private</span>
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2">
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors disabled:opacity-40"
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
