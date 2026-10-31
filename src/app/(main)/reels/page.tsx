"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { formatNumberCompact } from "@/lib/utils";

export default function ReelsPage() {
  const { user } = useAuth();
  const [reels, setReels] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedReels, setLikedReels] = useState<Record<string, boolean>>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    fetch("/api/reels")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.reels) {
          setReels(data.reels);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLike = (reelId: string) => {
    setLikedReels((prev) => ({
      ...prev,
      [reelId]: !prev[reelId],
    }));
  };

  const togglePlay = (index: number) => {
    const video = videoRefs.current[index];
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] py-2">
      <div className="text-center mb-4">
        <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          FaithVerse Reels & Inspiration
        </h1>
        <p className="text-xs text-slate-400">
          Uplifting, purpose-filled short videos reviewed for community safety.
        </p>
      </div>

      {reels.length === 0 ? (
        <div className="glass-card bg-[#0d1527]/70 p-12 text-center rounded-2xl max-w-sm w-full space-y-3">
          <p className="text-sm text-slate-300">Loading Reels...</p>
        </div>
      ) : (
        <div className="relative w-full max-w-[380px] h-[680px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black">
          {reels.map((reel, idx) => {
            if (idx !== currentIndex) return null;
            const isLiked = !!likedReels[reel.id];
            const displayLikes = (reel.likesCount || 0) + (isLiked ? 1 : 0);

            return (
              <div key={reel.id} className="relative w-full h-full flex items-center justify-center">
                {/* Video Element */}
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                  }}
                  src={reel.videoUrl}
                  poster={reel.thumbnailUrl}
                  loop
                  muted={isMuted}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => togglePlay(idx)}
                />

                {/* Top Controls: Sound Toggle */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2.5 rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Play / Pause Center Indicator on click */}
                {!isPlaying && (
                  <div
                    onClick={() => togglePlay(idx)}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer z-10"
                  >
                    <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center text-white">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                  </div>
                )}

                {/* Right Action Icons Column */}
                <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-5 text-white">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-125 ${
                        isLiked ? "bg-rose-500 text-white" : "bg-black/50 hover:bg-black/70"
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? "fill-white" : ""}`} />
                    </div>
                    <span className="text-[11px] font-bold drop-shadow">
                      {formatNumberCompact(displayLikes)}
                    </span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => alert("Comments drawer: 48 community encouraging comments.")}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold drop-shadow">48</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Reel link copied to clipboard!");
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-black/70 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold drop-shadow">Share</span>
                  </button>

                  {/* Creator Avatar with Follow */}
                  <div className="relative mt-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reel.author.avatarUrl}
                      alt={reel.author.fullName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#d4af37]"
                    />
                  </div>
                </div>

                {/* Bottom Overlay: Creator Info & Title */}
                <div className="absolute bottom-0 left-0 right-16 p-4 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-white drop-shadow">
                      @{reel.author.username}
                    </span>
                    {reel.author.isVerified && (
                      <CheckCircle2 className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/30" />
                    )}
                    <button className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm">
                      Follow
                    </button>
                  </div>

                  <p className="text-xs text-slate-100 font-medium leading-relaxed drop-shadow-md line-clamp-2 mb-2">
                    {reel.title}
                  </p>

                  {/* Audio badge */}
                  <div className="flex items-center gap-2 text-[10px] text-amber-200/90 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-fit">
                    <Music className="w-3 h-3 text-[#d4af37]" />
                    <span className="truncate">Original Audio &bull; {reel.author.fullName}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Reel Nav Buttons (Next / Prev) */}
          <div className="absolute bottom-3 left-4 z-30 flex items-center gap-2 text-xs">
            <button
              onClick={() => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : reels.length - 1))}
              className="px-2.5 py-1 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
            >
              &uarr; Prev
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev < reels.length - 1 ? prev + 1 : 0))}
              className="px-2.5 py-1 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm"
            >
              &darr; Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
