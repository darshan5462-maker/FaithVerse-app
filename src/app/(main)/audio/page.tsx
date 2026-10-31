"use client";

import React, { useState, useEffect } from "react";
import { Headphones, Play, Pause, Music, Radio, Sparkles, Volume2 } from "lucide-react";
import { useAudioPlayer } from "@/components/providers/AudioPlayerContext";
import { formatDuration } from "@/lib/utils";

export default function AudioPodcastsPage() {
  const { currentTrack, isPlaying, playTrack, togglePlay } = useAudioPlayer();
  const [tracks, setTracks] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/audio")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.tracks) {
          setTracks(data.tracks);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { key: "ALL", label: "All Audio" },
    { key: "WORSHIP", label: "Worship Anthems" },
    { key: "SERMON_PODCAST", label: "Sermons & Podcasts" },
    { key: "INSTRUMENTAL", label: "Prayer Instrumentals" },
  ];

  const filteredTracks = tracks.filter((t) =>
    selectedCategory === "ALL" ? true : t.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="glass-card bg-gradient-to-br from-[#0d1527] via-[#1a153a] to-[#0d1527] p-6 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
          <Headphones className="w-4 h-4 text-purple-400" />
          <span>Sanctuary Audio & Podcasts</span>
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">
          Worship & Spiritual Discourses
        </h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          Stream uplifting praise, gospel acoustics, and encouraging podcasts. Continuous background playback while you explore FaithVerse.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs font-semibold">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setSelectedCategory(c.key)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCategory === c.key
                ? "bg-[#d4af37]/20 text-[#f3d478] border border-[#d4af37]/40 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Track List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading audio library...</div>
        ) : filteredTracks.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/50 p-12 text-center rounded-2xl border border-white/5">
            <Radio className="w-8 h-8 text-purple-400 mx-auto mb-2 opacity-70" />
            <p className="text-xs text-slate-400">No tracks in this category yet.</p>
          </div>
        ) : (
          filteredTracks.map((track) => {
            const isThisPlaying = currentTrack?.id === track.id && isPlaying;
            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`glass-card p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 group ${
                  currentTrack?.id === track.id
                    ? "bg-[#131e3a] border-[#d4af37]/50 shadow-lg"
                    : "bg-[#0d1527]/80 border-white/10 hover:border-white/20 hover:bg-[#0d1527]"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={track.coverArtUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-[#d4af37] transition-colors">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-400 truncate">
                      {track.artist} &bull; <span className="text-amber-400/80">{track.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 text-xs">
                  <span className="font-mono text-slate-400">
                    {formatDuration(track.durationSeconds)}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTrack(track);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                      isThisPlaying
                        ? "bg-[#d4af37] text-black"
                        : "bg-white/10 group-hover:bg-[#d4af37] group-hover:text-black text-white"
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
