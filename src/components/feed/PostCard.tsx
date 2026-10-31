"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle2,
  Shield,
  Send,
  CornerDownRight,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { formatTimeAgo, formatNumberCompact } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthContext";
import { useLanguage } from "@/components/providers/LanguageContext";

interface PostCardProps {
  post: any;
  onPostUpdated?: () => void;
}

export default function PostCard({ post, onPostUpdated }: PostCardProps) {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [isLiked, setIsLiked] = useState<boolean>(post.isLikedByMe || false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount || 0);
  const [isSaved, setIsSaved] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>(post.recentComments || []);
  const [commentInput, setCommentInput] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportedMessage, setReportedMessage] = useState("");

  const handleLike = async () => {
    if (!user) {
      alert("Please sign in or switch to an active persona to interact.");
      return;
    }

    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch {
      // rollback if failed
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1));
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !user) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          content: commentInput.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments([data.comment, ...comments]);
        setCommentInput("");
        setShowComments(true);
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "BIBLE_TEACHING":
        return { label: "Bible Teaching", color: "bg-blue-500/10 text-blue-400 border-blue-500/30" };
      case "WORSHIP_MUSIC":
        return { label: "Worship Music", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" };
      case "TESTIMONY":
        return { label: "Faith Testimony", color: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
      case "PRAYER":
        return { label: "Prayer Request", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "INSPIRATION":
        return { label: "Inspiration", color: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
      default:
        return { label: "Community", color: "bg-slate-500/10 text-slate-400 border-slate-500/30" };
    }
  };

  const catBadge = getCategoryBadge(post.category);

  // Parse text content to highlight hashtags
  const renderFormattedContent = (text: string) => {
    const parts = text.split(/(#[a-zA-Z0-9_]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <span key={index} className="text-[#d4af37] font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <article className="glass-card bg-[#0d1527]/75 border border-white/10 rounded-2xl overflow-hidden shadow-lg mb-5 transition-all hover:border-white/15">
      {/* Moderation Status Banner (only shown if not approved, e.g. for author or in review queue) */}
      {post.moderationStatus !== "APPROVED" && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2 font-medium">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Status: {post.moderationStatus}</span>
          </div>
          {post.rejectionReason && (
            <span className="text-red-400 font-normal">Reason: {post.rejectionReason}</span>
          )}
          {post.needsChangesNote && (
            <span className="text-purple-300 font-normal">Feedback: {post.needsChangesNote}</span>
          )}
        </div>
      )}

      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.username}`} className="relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.author.avatarUrl}
              alt={post.author.fullName}
              className="w-10 h-10 rounded-full object-cover border border-white/15 group-hover:border-[#d4af37] transition-colors"
            />
          </Link>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                href={`/profile/${post.author.username}`}
                className="text-sm font-bold text-white hover:text-[#d4af37] transition-colors"
              >
                {post.author.fullName}
              </Link>
              {post.author.isVerified && (
                <span title="Verified Creator">
                  <CheckCircle2 className="w-4 h-4 text-[#d4af37] fill-[#d4af37]/20" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>@{post.author.username}</span>
              <span>&bull;</span>
              <span>{formatTimeAgo(post.publishedAt || post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Category Pill & Menu */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${catBadge.color}`}>
            {catBadge.label}
          </span>
          <button
            onClick={() => setShowReportModal(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Options / Report"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Text */}
      <div className="px-4 pb-3">
        <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">
          {renderFormattedContent(post.content)}
        </p>
      </div>

      {/* Media Attachments */}
      {post.media && post.media.length > 0 && (
        <div className="relative w-full max-h-[500px] bg-black/40 overflow-hidden flex items-center justify-center border-y border-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.media[0].url}
            alt={post.media[0].altText || "Post image"}
            className="w-full max-h-[500px] object-cover transition-transform duration-300 hover:scale-[1.01]"
            loading="lazy"
          />
        </div>
      )}

      {/* Action Controls */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-white/5 text-slate-400 text-xs">
        <div className="flex items-center gap-5">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 font-medium transition-transform active:scale-125 ${
              isLiked ? "text-rose-500" : "hover:text-rose-400"
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{formatNumberCompact(likesCount)}</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{formatNumberCompact(post.commentsCount || comments.length)}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span>{t.feed.share}</span>
          </button>
        </div>

        {/* Save Bookmark Button */}
        <button
          onClick={() => setIsSaved(!isSaved)}
          className={`p-1.5 rounded-lg transition-colors ${
            isSaved ? "text-[#d4af37]" : "hover:text-white"
          }`}
          title={isSaved ? "Saved" : "Save post"}
        >
          <Bookmark className={`w-5 h-5 ${isSaved ? "fill-[#d4af37] text-[#d4af37]" : ""}`} />
        </button>
      </div>

      {/* Expandable Comments Drawer */}
      {showComments && (
        <div className="px-4 py-3 bg-black/20 border-t border-white/5 space-y-3 animate-fade-in">
          {/* Input Form */}
          <form onSubmit={handleAddComment} className="flex items-center gap-2">
            {user && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt="Me"
                className="w-7 h-7 rounded-full object-cover border border-[#d4af37]/40 flex-shrink-0"
              />
            )}
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Write an encouraging comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]/50"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentInput.trim()}
              className="p-2 rounded-xl bg-[#d4af37] text-black font-semibold disabled:opacity-40 hover:scale-105 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Existing Comments List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <p className="text-xs text-slate-500 py-2 text-center">
                Be the first to leave an uplifting word.
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="text-xs space-y-1">
                  <div className="flex items-start gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={comment.user.avatarUrl}
                      alt={comment.user.fullName}
                      className="w-6 h-6 rounded-full object-cover mt-0.5"
                    />
                    <div className="flex-1 bg-white/5 rounded-xl px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          {comment.user.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {formatTimeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-200 mt-0.5">{comment.content}</p>
                    </div>
                  </div>

                  {/* Replies if any */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-8 space-y-1">
                      {comment.replies.map((reply: any) => (
                        <div key={reply.id} className="flex items-start gap-2 text-xs">
                          <CornerDownRight className="w-3.5 h-3.5 text-slate-500 mt-1 flex-shrink-0" />
                          <div className="bg-white/[0.03] rounded-lg px-2.5 py-1.5 flex-1">
                            <span className="font-semibold text-amber-300">
                              {reply.user.fullName}
                            </span>
                            <p className="text-slate-300">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-[#0d1527] border border-[#d4af37]/40 max-w-sm w-full p-5 rounded-2xl space-y-4 animate-fade-in">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#d4af37]" />
              Share this Inspiration
            </h3>
            <p className="text-xs text-slate-300">
              Copy post link or share directly with friends and prayer groups:
            </p>
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10 text-xs">
              <input
                readOnly
                value={`${typeof window !== "undefined" ? window.location.origin : ""}/post/${post.id}`}
                className="bg-transparent flex-1 text-slate-300 outline-none text-[11px] truncate"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                  alert("Link copied to clipboard!");
                  setShowShareModal(false);
                }}
                className="px-3 py-1 rounded-lg bg-[#d4af37] text-black font-semibold text-xs"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card bg-[#0d1527] border border-red-500/40 max-w-sm w-full p-5 rounded-2xl space-y-3 animate-fade-in">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" />
              Report Content
            </div>
            <p className="text-xs text-slate-300">
              FaithVerse maintains high community standards. Please select the reason for reporting this post:
            </p>
            <div className="space-y-1.5 text-xs">
              {[
                "Inappropriate language or hate speech",
                "Spam or unauthorized commercial solicitation",
                "False impersonation or unverified church identity",
                "Misleading theology or harassment",
              ].map((reason) => (
                <button
                  key={reason}
                  onClick={() => {
                    setReportedMessage(`Report submitted: ${reason}`);
                    setTimeout(() => {
                      setShowReportModal(false);
                      setReportedMessage("");
                    }, 1500);
                  }}
                  className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                >
                  {reason}
                </button>
              ))}
            </div>
            {reportedMessage && (
              <p className="text-xs text-emerald-400 font-medium">{reportedMessage}</p>
            )}
            <button
              onClick={() => setShowReportModal(false)}
              className="w-full py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
