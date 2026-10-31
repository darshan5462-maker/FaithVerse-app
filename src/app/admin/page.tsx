"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Activity,
  ArrowRight,
  MessageSquare,
  History,
  Filter,
  Check,
  X,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { formatTimeAgo } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, role, isAdminOrMod, switchUser } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  // Rejection / Changes Modal state
  const [actionPost, setActionPost] = useState<any>(null);
  const [actionType, setActionType] = useState<"REJECT" | "REQUEST_CHANGES" | null>(null);
  const [reasonInput, setReasonInput] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchModerationData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/moderation?filter=${filter}`);
      const data = await res.json();
      if (data.success) {
        setMetrics(data.metrics);
        setQueue(data.queue);
        setAuditLogs(data.auditLogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, [filter]);

  const handleApprove = async (postId: string) => {
    if (!user) return;
    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          action: "APPROVE",
          adminId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchModerationData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitActionWithReason = async () => {
    if (!actionPost || !actionType || !user) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: actionPost.id,
          action: actionType,
          reason: reasonInput.trim(),
          internalNotes: internalNotes.trim(),
          adminId: user.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionPost(null);
        setActionType(null);
        setReasonInput("");
        setInternalNotes("");
        fetchModerationData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isAdminOrMod) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070b14]">
        <div className="glass-card bg-[#0d1527] border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Content moderation privileges are restricted to FaithVerse Guardians, Moderators, and Administrators.
          </p>
          <div className="pt-2">
            <button
              onClick={() => switchUser("faithverse_admin")}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-[#d4af37] to-amber-500 text-black shadow-lg hover:scale-105 transition-transform"
            >
              Switch to Super Admin Persona
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#d4af37] to-[#8b5cf6] p-[2px]">
              <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-[#d4af37]" />
              </div>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              FaithVerse Moderation & Governance Hub
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Mandatory content approval workflow. Reviewing community submissions for truth, love, and safety.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
          >
            &larr; Back to Platform Feed
          </Link>
          <button
            onClick={fetchModerationData}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#d4af37] text-black hover:bg-amber-400 transition-colors shadow-md"
          >
            Refresh Queue
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pending Review", value: metrics.pendingCount, color: "text-amber-400", border: "border-amber-500/30", icon: Clock },
            { label: "Approved Posts", value: metrics.approvedCount, color: "text-emerald-400", border: "border-emerald-500/30", icon: CheckCircle },
            { label: "Rejected Posts", value: metrics.rejectedCount, color: "text-rose-400", border: "border-rose-500/30", icon: XCircle },
            { label: "Needs Changes", value: metrics.needsChangesCount, color: "text-purple-400", border: "border-purple-500/30", icon: AlertTriangle },
            { label: "Total Members", value: metrics.totalUsers, color: "text-blue-400", border: "border-blue-500/30", icon: Users },
            { label: "All Submissions", value: metrics.totalPosts, color: "text-slate-200", border: "border-white/10", icon: FileText },
            { label: "Open Reports", value: metrics.reportsCount, color: "text-orange-400", border: "border-orange-500/30", icon: Activity },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`glass-card bg-[#0d1527]/80 p-3.5 rounded-xl border ${item.border} flex flex-col justify-between`}
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-medium truncate">{item.label}</span>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <span className={`text-2xl font-black ${item.color}`}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Queue Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 text-xs">
        <Filter className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
        {[
          { key: "PENDING", label: `Pending Queue (${metrics?.pendingCount ?? 0})` },
          { key: "NEEDS_CHANGES", label: "Changes Requested" },
          { key: "REJECTED", label: "Rejected Archive" },
          { key: "APPROVED", label: "Approved (Public)" },
          { key: "ALL", label: "All Submissions" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === tab.key
                ? "bg-[#d4af37] text-black font-bold shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Moderation Submissions Queue */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading moderation queue...</div>
        ) : queue.length === 0 ? (
          <div className="glass-card bg-[#0d1527]/50 p-12 text-center rounded-2xl border border-white/5 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Queue is Clear!</h3>
            <p className="text-xs text-slate-400">
              No submissions currently waiting in filter &ldquo;{filter}&rdquo;.
            </p>
          </div>
        ) : (
          queue.map((post) => (
            <div
              key={post.id}
              className="glass-card bg-[#0d1527] border border-white/10 rounded-2xl p-5 shadow-xl transition-all hover:border-[#d4af37]/30 flex flex-col lg:flex-row gap-5"
            >
              {/* Left Column: Creator & Post Content */}
              <div className="flex-1 space-y-3">
                {/* Creator bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.author.avatarUrl}
                      alt={post.author.fullName}
                      className="w-10 h-10 rounded-full object-cover border border-white/15"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{post.author.fullName}</span>
                        <span className="text-xs text-slate-400">@{post.author.username}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                          {post.author.role}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        Submitted {formatTimeAgo(post.createdAt)} &bull; Category: {post.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      post.moderationStatus === "PENDING"
                        ? "badge-pending"
                        : post.moderationStatus === "APPROVED"
                        ? "badge-approved"
                        : post.moderationStatus === "REJECTED"
                        ? "badge-rejected"
                        : "badge-needs-changes"
                    }`}
                  >
                    {post.moderationStatus}
                  </span>
                </div>

                {/* Text Content */}
                <p className="text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/5">
                  {post.content}
                </p>

                {/* Rejection / Changes History if any */}
                {post.rejectionReason && (
                  <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl">
                    <strong>Rejection Reason:</strong> {post.rejectionReason}
                  </div>
                )}
                {post.needsChangesNote && (
                  <div className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/30 p-2.5 rounded-xl">
                    <strong>Requested Changes:</strong> {post.needsChangesNote}
                  </div>
                )}
              </div>

              {/* Middle Column: Media Preview */}
              {post.media && post.media.length > 0 && (
                <div className="w-full lg:w-48 h-40 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.media[0].url}
                    alt="Submission Media"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Right Column: Moderator Decision Panel */}
              <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-2 border-t lg:border-t-0 lg:border-l border-white/10 pt-3 lg:pt-0 lg:pl-5 flex-shrink-0">
                <button
                  onClick={() => handleApprove(post.id)}
                  className="flex-1 lg:flex-none py-2 px-4 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Approve</span>
                </button>

                <button
                  onClick={() => {
                    setActionPost(post);
                    setActionType("REQUEST_CHANGES");
                  }}
                  className="flex-1 lg:flex-none py-2 px-4 rounded-xl text-xs font-semibold bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Request Changes</span>
                </button>

                <button
                  onClick={() => {
                    setActionPost(post);
                    setActionType("REJECT");
                  }}
                  className="flex-1 lg:flex-none py-2 px-4 rounded-xl text-xs font-semibold bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Moderation Audit Trail */}
      <div className="glass-card bg-[#0d1527]/70 p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <History className="w-4 h-4 text-[#d4af37]" />
          <span>Real-Time Moderation Audit Log</span>
        </div>

        <div className="space-y-2">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-500">No moderation audit entries recorded yet.</p>
          ) : (
            auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={log.admin.avatarUrl}
                    alt={log.admin.fullName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-white">@{log.admin.username}</span>
                    <span className="text-slate-400"> executed </span>
                    <span className="font-mono text-amber-300 font-semibold">{log.action}</span>
                    <span className="text-slate-400"> &mdash; {log.details}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 flex-shrink-0">
                  {formatTimeAgo(log.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Dialog (Reject / Request Changes with Reason) */}
      {actionPost && actionType && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card bg-[#0d1527] border border-[#d4af37]/40 max-w-md w-full p-6 rounded-2xl space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-white">
              {actionType === "REJECT" ? "Reject Post Submission" : "Request Changes from Creator"}
            </h3>

            <p className="text-xs text-slate-300">
              Provide feedback for <strong>@{actionPost.author.username}</strong>. This explanation will be delivered in their notifications.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Reason / Required Edits:
                </label>
                <textarea
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder={
                    actionType === "REJECT"
                      ? "e.g., Commercial solicitation, off-topic advertising, or inappropriate speech..."
                      : "e.g., Please provide proper source citation for this Bible quote or fix external links..."
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Internal Staff Notes (Admin only):
                </label>
                <input
                  type="text"
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Optional internal reference notes..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <button
                onClick={() => {
                  setActionPost(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitActionWithReason}
                disabled={actionLoading || !reasonInput.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                  actionType === "REJECT"
                    ? "bg-red-500 hover:bg-red-400 text-white"
                    : "bg-purple-600 hover:bg-purple-500 text-white"
                } disabled:opacity-40`}
              >
                {actionLoading ? "Executing..." : "Confirm Action"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
