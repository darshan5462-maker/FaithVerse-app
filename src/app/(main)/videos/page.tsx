"use client";

import React, { useState } from "react";
import { Tv, Play, CheckCircle2, Clock, Eye, Share2, ThumbsUp, Bell } from "lucide-react";
import { formatNumberCompact } from "@/lib/utils";

interface VideoItem {
  id: string;
  title: string;
  channelName: string;
  channelAvatar: string;
  isVerified: boolean;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  views: number;
  uploadedAt: string;
  category: string;
  description: string;
}

const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: "v1",
    title: "Exposition of Romans 8: More Than Conquerors Through Him",
    channelName: "Grace Fellowship Media",
    channelAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    isVerified: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "42:15",
    views: 18400,
    uploadedAt: "3 days ago",
    category: "Sermon",
    description: "In-depth expository sermon on eternal security, the Spirit of adoption, and our triumph over tribulations through Jesus Christ.",
  },
  {
    id: "v2",
    title: "Live Worship from Bengaluru: Living Water & Holy Presence",
    channelName: "Rachel Vance Worship",
    channelAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    isVerified: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "28:30",
    views: 34200,
    uploadedAt: "1 week ago",
    category: "Worship",
    description: "A continuous night of spontaneous praise, acoustic scripture hymns, and heart surrender in Bengaluru.",
  },
  {
    id: "v3",
    title: "Christianity in the AI Age: Ethics, Truth, and Digital Ministry",
    channelName: "Faith & Tech Forum",
    channelAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    isVerified: false,
    thumbnailUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: "18:45",
    views: 12500,
    uploadedAt: "2 weeks ago",
    category: "Discussion",
    description: "Panel discussion featuring tech builders and theologians examining the future of church community in 2026.",
  },
];

export default function LongVideosPage() {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [subscribed, setSubscribed] = useState<Record<string, boolean>>({});

  const toggleSubscribe = (channel: string) => {
    setSubscribed((prev) => ({
      ...prev,
      [channel]: !prev[channel],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card bg-[#0d1527] p-6 rounded-3xl border border-white/10 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] tracking-wider uppercase">
          <Tv className="w-4 h-4 text-[#d4af37]" />
          <span>FaithVerse Video Channel & Discourses</span>
        </div>
        <h1 className="text-2xl font-black text-white">Sermons, Teachings & Worship</h1>
        <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
          YouTube-style curated video library with Bible expositions, concert broadcasts, and topical theological series.
        </p>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {SAMPLE_VIDEOS.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="glass-card bg-[#0d1527]/80 rounded-2xl overflow-hidden border border-white/10 shadow-lg group cursor-pointer hover:border-[#d4af37]/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/70 backdrop-blur-md flex items-center justify-center text-[#d4af37] group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white">
                  {video.duration}
                </span>
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 text-[#d4af37] border border-[#d4af37]/30">
                  {video.category}
                </span>
              </div>

              {/* Video Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-[#d4af37] transition-colors leading-snug">
                  {video.title}
                </h3>

                <div className="flex items-center gap-2 pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={video.channelAvatar}
                    alt={video.channelName}
                    className="w-7 h-7 rounded-full object-cover border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-300 font-semibold truncate">
                        {video.channelName}
                      </span>
                      {video.isVerified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]/20 flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {formatNumberCompact(video.views)} views &bull; {video.uploadedAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card bg-[#0d1527] border border-white/20 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Embedded Video */}
            <div className="relative aspect-video w-full bg-black">
              <video
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnailUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">{selectedVideo.title}</h2>

              {/* Channel and actions bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedVideo.channelAvatar}
                    alt={selectedVideo.channelName}
                    className="w-10 h-10 rounded-full object-cover border border-[#d4af37]/50"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {selectedVideo.channelName}
                      </span>
                      {selectedVideo.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
                      )}
                    </div>
                    <span className="text-xs text-slate-400">
                      {formatNumberCompact(selectedVideo.views)} views
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubscribe(selectedVideo.channelName)}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all shadow ${
                      subscribed[selectedVideo.channelName]
                        ? "bg-white/15 text-slate-300"
                        : "bg-[#d4af37] text-black hover:bg-amber-400"
                    }`}
                  >
                    {subscribed[selectedVideo.channelName] ? "Subscribed ✓" : "Subscribe"}
                  </button>

                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="py-2 px-4 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-slate-300"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 p-4 rounded-2xl text-xs text-slate-300 leading-relaxed">
                {selectedVideo.description}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
