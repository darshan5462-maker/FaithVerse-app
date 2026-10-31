"use client";

import React, { useState } from "react";
import { Plus, X, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";

interface StoryItem {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  storyMedia: string;
  caption: string;
  isVerified?: boolean;
}

const SAMPLE_STORIES: StoryItem[] = [
  {
    id: "s1",
    username: "pastor_john",
    fullName: "Pastor John",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    storyMedia: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
    caption: "Morning sunrise prayer walk. Praying for peace across our world today. 🌅",
    isVerified: true,
  },
  {
    id: "s2",
    username: "rachel_worship",
    fullName: "Rachel Vance",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    storyMedia: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    caption: "Soundcheck in Bengaluru! So excited for tonight's worship night. 🎵✨",
    isVerified: true,
  },
  {
    id: "s3",
    username: "priya_grace",
    fullName: "Priya Grace",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    storyMedia: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80",
    caption: "Quiet morning devotion with coffee & Psalms. ☕📖",
    isVerified: true,
  },
];

export default function StoriesBar() {
  const { user } = useAuth();
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [showCreatePrompt, setShowCreatePrompt] = useState(false);

  return (
    <div className="relative mb-6">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {/* Add Story Button */}
        <div
          onClick={() => setShowCreatePrompt(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
        >
          <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-white/20 to-white/5 group-hover:from-[#d4af37] group-hover:to-amber-500 transition-all">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
              {user ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.avatarUrl} alt="You" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-700" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#d4af37] text-black flex items-center justify-center border-2 border-[#070b14]">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-300 truncate w-16 text-center">
            Your Story
          </span>
        </div>

        {/* Active Stories List */}
        {SAMPLE_STORIES.map((story) => (
          <div
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#d4af37] via-[#f59e0b] to-[#8b5cf6] shadow-md group-hover:scale-105 active:scale-95 transition-transform">
              <div className="w-full h-full rounded-full overflow-hidden p-[2px] bg-[#070b14]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.avatarUrl}
                  alt={story.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            <span className="text-[11px] font-medium text-slate-300 truncate w-16 text-center">
              {story.fullName.split(" ")[0]}
            </span>
          </div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative w-full max-w-sm h-[80vh] max-h-[640px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black flex flex-col justify-between">
            {/* Top Bar with Progress Line and Creator */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
              {/* Progress Line */}
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden mb-3">
                <div className="w-3/4 h-full bg-[#d4af37] rounded-full animate-pulse" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeStory.avatarUrl}
                    alt={activeStory.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-[#d4af37]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white">{activeStory.fullName}</p>
                    <p className="text-[10px] text-amber-300/80">Approved 24h Story</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveStory(null)}
                  className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Story Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeStory.storyMedia}
              alt="Story"
              className="w-full h-full object-cover"
            />

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
              <p className="text-sm text-white font-medium drop-shadow-md">
                {activeStory.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Story Creation Info Modal */}
      {showCreatePrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-[#0d1527] border border-[#d4af37]/40 max-w-md w-full p-6 rounded-2xl space-y-4 animate-fade-in">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Story Submission & Moderation</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Stories on FaithVerse stay active for 24 hours. In alignment with our safety standard, all stories pass through rapid moderation review before becoming publicly visible.
            </p>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setShowCreatePrompt(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreatePrompt(false);
                  window.location.href = "/create?type=STORY";
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#d4af37] to-amber-500 text-black shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                Proceed to Story Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
