"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Music,
  CheckCircle2,
  Film,
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
      <div className="text-center mb-4 space-y-1">
        <h1 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <Film className="w-4 h-4 text-[#e5b842]" />
          Reels & Short Reflections
        </h1>
        <p className="text-xs text-slate-400">
          Uplifting, purpose-filled short videos reviewed for community safety.
        </p>
      </div>

      {reels.length === 0 ? (
        <div className="bg-[#11141d] border border-white/[0.08] p-12 text-center rounded-2xl max-w-sm w-full space-y-2">
          <p className="text-xs text-slate-400">Loading Reels...</p>
        </div>
      ) : (
        <div className="relative w-full max-w-[380px] h-[660px] rounded-2xl overflow-hidden shadow-2xl border border-white/[0.12] bg-black">
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
                    className="p-2 rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Play Indicator on pause */}
                {!isPlaying && (
                  <div
                    onClick={() => togglePlay(idx)}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer z-10"
                  >
                    <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center text-white">
                      <Play className="w-7 h-7 ml-1" />
                    </div>
                  </div>
                )}

                {/* Right Action Icons Column */}
                <div className="absolute right-3 bottom-20 z-20 flex flex-col items-center gap-4 text-white">
                  {/* Like Button */}
                  <button
                    onClick={() => handleLike(reel.id)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${
                        isLiked ? "bg-rose-500 text-white" : "bg-black/60 hover:bg-black/80"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
                    </div>
                    <span className="text-[11px] font-bold drop-shadow">
                      {formatNumberCompact(displayLikes)}
                    </span>
                  </button>

                  {/* Comment Button */}
                  <button
                    onClick={() => alert("Comments drawer")}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold drop-shadow">48</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert("Reel link copied!");
                    }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center hover:bg-black/80 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold drop-shadow">Share</span>
                  </button>

                  {/* Creator Avatar */}
                  <div className="relative mt-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={reel.author.avatarUrl}
                      alt={reel.author.fullName}
                      className="w-9 h-9 rounded-full object-cover border-2 border-white"
                    />
                  </div>
                </div>

                {/* Bottom Overlay: Creator Info & Title */}
                <div className="absolute bottom-0 left-0 right-16 p-4 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-white drop-shadow">
                      @{reel.author.username}
                    </span>
                    {reel.author.isVerified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#e5b842]" />
                    )}
                  </div>

                  <p className="text-xs text-slate-100 font-medium leading-relaxed drop-shadow line-clamp-2 mb-2">
                    {reel.title}
                  </p>

                  {/* Audio badge */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-300 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full w-fit">
                    <Music className="w-3 h-3 text-[#e5b842]" />
                    <span className="truncate">Audio &bull; {reel.author.fullName}</span>
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
