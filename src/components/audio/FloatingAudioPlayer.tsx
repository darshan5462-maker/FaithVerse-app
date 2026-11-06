"use client";

import React from "react";
import { useAudioPlayer } from "@/components/providers/AudioPlayerContext";
import { Play, Pause, X, Music } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default function FloatingAudioPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, seek, stop } = useAudioPlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 md:bottom-5 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 animate-fade-in">
      <div className="bg-[#11141d] border border-white/[0.12] shadow-2xl rounded-2xl p-3 flex flex-col gap-2.5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 flex items-center justify-center border border-white/[0.08]">
              {currentTrack.coverArtUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentTrack.coverArtUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-4 h-4 text-slate-400" />
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-xs font-semibold text-white truncate">{currentTrack.title}</h4>
              <p className="text-[11px] text-slate-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={togglePlay}
              className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-slate-200 active:scale-95 transition-all shadow-sm"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
            </button>
            <button
              onClick={stop}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <div
            className="flex-1 h-1 bg-white/[0.08] rounded-full cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              seek(ratio * duration);
            }}
          >
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{formatDuration(Math.floor(duration))}</span>
        </div>
      </div>
    </div>
  );
}
