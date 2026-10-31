"use client";

import React from "react";
import { useAudioPlayer } from "@/components/providers/AudioPlayerContext";
import { Play, Pause, X, Music, Volume2 } from "lucide-react";
import { formatDuration } from "@/lib/utils";

export default function FloatingAudioPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, togglePlay, seek, stop } = useAudioPlayer();

  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 animate-fade-in">
      <div className="glass-card bg-[#0d1527]/95 border border-[#d4af37]/40 shadow-2xl rounded-2xl p-3 flex flex-col gap-2 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-500/20 to-purple-600/30 flex items-center justify-center border border-white/10">
              {currentTrack.coverArtUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentTrack.coverArtUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Music className="w-5 h-5 text-[#d4af37]" />
              )}
              {isPlaying && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-[#d4af37] animate-pulse" />
                    <span className="w-0.5 h-2/3 bg-[#d4af37] animate-pulse delay-75" />
                    <span className="w-0.5 h-4/5 bg-[#d4af37] animate-pulse delay-150" />
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">{currentTrack.title}</h4>
              <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f59e0b] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
            </button>
            <button
              onClick={stop}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Close player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <span>{formatDuration(Math.floor(currentTime))}</span>
          <div
            className="flex-1 h-1.5 bg-white/10 rounded-full cursor-pointer relative overflow-hidden"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              seek(ratio * duration);
            }}
          >
            <div
              className="h-full bg-gradient-to-r from-[#d4af37] to-[#8b5cf6] rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span>{formatDuration(Math.floor(duration))}</span>
        </div>
      </div>
    </div>
  );
}
