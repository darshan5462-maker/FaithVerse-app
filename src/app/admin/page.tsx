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
  History,
  Filter,
  Check,
  X,
  Lock,
  Search,
  UserCheck,
  Ban,
  ShieldAlert,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { formatTimeAgo } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { user, isAdminOrMod, switchUser } = useAuth();
  const [activeSection, setActiveSection] = useState<"QUEUE" | "USERS" | "AUDIT">("QUEUE");

  // Moderation Queue State
  const [metrics, setMetrics] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("PENDING");
  const [loading, setLoading] = useState(true);

  // User Management State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");

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

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && data.users) {
        setUsersList(data.users);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationData();
  }, [filter]);

  useEffect(() => {
    if (activeSection === "USERS") {
      fetchUsers();
    }
  }, [activeSection]);

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

  const handleToggleUserVerify = async (targetUser: any) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUser.id,
          action: "TOGGLE_VERIFY",
          value: !targetUser.isVerified,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserSuspend = async (targetUser: any) => {
    if (!confirm(`Are you sure you want to ${targetUser.isSuspended ? "reactivate" : "suspend"} @${targetUser.username}?`)) {
      return;
    }
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: targetUser.id,
          action: "TOGGLE_SUSPEND",
          value: !targetUser.isSuspended,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Security gate for non-admins
  if (!isAdminOrMod) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="bg-[#11141d] border border-white/[0.08] p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-[#e5b842] mx-auto flex items-center justify-center border border-[#e5b842]/20">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              This area is strictly restricted to platform moderators and administrators.
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => switchUser("faithverse_admin")}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white text-black hover:bg-slate-200 transition-colors shadow-sm"
            >
              Sign In as Super Admin Persona
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          {[
            { key: "QUEUE", label: "Moderation Queue", count: metrics?.pendingCount, icon: Clock },
            { key: "USERS", label: "User Directory & Safety", count: usersList.length, icon: Users },
            { key: "AUDIT", label: "Audit Trail", icon: History },
          ].map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.key;
            return (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
                {sec.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-black/10 text-black font-bold" : "bg-white/[0.08] text-slate-300"
                    }`}
                  >
                    {sec.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            fetchModerationData();
            if (activeSection === "USERS") fetchUsers();
          }}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* METRICS ROW */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pending", value: metrics.pendingCount, color: "text-amber-400", icon: Clock },
            { label: "Approved", value: metrics.approvedCount, color: "text-emerald-400", icon: CheckCircle },
            { label: "Rejected", value: metrics.rejectedCount, color: "text-rose-400", icon: XCircle },
            { label: "Changes", value: metrics.needsChangesCount, color: "text-purple-400", icon: AlertTriangle },
            { label: "Members", value: metrics.totalUsers, color: "text-blue-400", icon: Users },
            { label: "All Posts", value: metrics.totalPosts, color: "text-slate-200", icon: FileText },
            { label: "Reports", value: metrics.reportsCount, color: "text-orange-400", icon: Activity },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#11141d] p-3.5 rounded-xl border border-white/[0.08] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-[11px] font-medium">{item.label}</span>
                  <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <span className={`text-xl font-bold ${item.color}`}>{item.value}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 1: CONTENT MODERATION QUEUE */}
      {activeSection === "QUEUE" && (
        <div className="space-y-4">
          {/* Sub-Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 ml-1" />
            {[
              { key: "PENDING", label: `Pending Queue (${metrics?.pendingCount ?? 0})` },
              { key: "APPROVED", label: "Approved (Public)" },
              { key: "REJECTED", label: "Rejected" },
              { key: "NEEDS_CHANGES", label: "Needs Changes" },
              { key: "ALL", label: "All Submissions" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  filter === tab.key
                    ? "bg-white/[0.1] text-white font-semibold border border-white/20"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Submissions List */}
          <div className="space-y-3">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading moderation queue...</div>
            ) : queue.length === 0 ? (
              <div className="bg-[#11141d] border border-white/[0.08] p-12 text-center rounded-2xl space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-semibold text-white">Queue is Clear</h3>
                <p className="text-xs text-slate-400">
                  No submissions currently waiting in &ldquo;{filter}&rdquo;.
                </p>
              </div>
            ) : (
              queue.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#11141d] border border-white/[0.08] rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row gap-5 transition-colors hover:border-white/[0.14]"
                >
                  {/* Left Column: Creator & Post Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.author.avatarUrl}
                          alt={post.author.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-white/[0.1]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{post.author.fullName}</span>
                            <span className="text-xs text-slate-400">@{post.author.username}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300">
                              {post.author.role}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Submitted {formatTimeAgo(post.createdAt)} &bull; {post.category}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          post.moderationStatus === "PENDING"
                            ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                            : post.moderationStatus === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                            : post.moderationStatus === "REJECTED"
                            ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                            : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                        }`}
                      >
                        {post.moderationStatus}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                      {post.content}
                    </p>

                    {post.rejectionReason && (
                      <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                        <strong>Rejection Reason:</strong> {post.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Middle Column: Media Preview */}
                  {post.media && post.media.length > 0 && (
                    <div className="w-full lg:w-44 h-36 rounded-xl overflow-hidden bg-black/40 border border-white/[0.08] flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.media[0].url}
                        alt="Submission Media"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Right Column: Moderator Decision Panel */}
                  <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-2 border-t lg:border-t-0 lg:border-l border-white/[0.08] pt-3 lg:pt-0 lg:pl-5 flex-shrink-0">
                    <button
                      onClick={() => handleApprove(post.id)}
                      className="flex-1 lg:flex-none py-1.5 px-3.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Approve</span>
                    </button>

                    <button
                      onClick={() => {
                        setActionPost(post);
                        setActionType("REQUEST_CHANGES");
                      }}
                      className="flex-1 lg:flex-none py-1.5 px-3.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-purple-300 border border-purple-500/25 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request Changes</span>
                    </button>

                    <button
                      onClick={() => {
                        setActionPost(post);
                        setActionType("REJECT");
                      }}
                      className="flex-1 lg:flex-none py-1.5 px-3.5 rounded-xl text-xs font-medium bg-white/[0.04] hover:bg-white/[0.08] text-rose-300 border border-rose-500/25 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: USER DIRECTORY & SAFETY */}
      {activeSection === "USERS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users by name, username, or email..."
                className="w-full bg-[#11141d] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredUsers.length} total members</span>
          </div>

          <div className="bg-[#11141d] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
            {usersLoading ? (
              <div className="p-12 text-center text-xs text-slate-400">Loading user directory...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">No users found.</div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={u.avatarUrl} alt={u.fullName} className="w-10 h-10 rounded-full object-cover border border-white/[0.1]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{u.fullName}</span>
                        {u.isVerified && (
                          <span title="Verified Creator">
                            <CheckCircle className="w-3.5 h-3.5 text-[#e5b842]" />
                          </span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-[#e5b842] font-mono">
                          {u.role}
                        </span>
                        {u.isSuspended && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-semibold">
                            SUSPENDED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        @{u.username} &bull; {u.email} &bull; Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleUserVerify(u)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                        u.isVerified
                          ? "bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08]"
                          : "bg-[#e5b842]/10 text-[#f5d47a] border-[#e5b842]/30 hover:bg-[#e5b842]/20"
                      }`}
                    >
                      {u.isVerified ? "Remove Badge" : "Grant Verified ✓"}
                    </button>

                    <button
                      onClick={() => handleToggleUserSuspend(u)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                        u.isSuspended
                          ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20"
                      }`}
                    >
                      {u.isSuspended ? "Reactivate" : "Suspend"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: AUDIT TRAIL */}
      {activeSection === "AUDIT" && (
        <div className="bg-[#11141d] p-5 rounded-2xl border border-white/[0.08] space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-[#e5b842]" />
            <span>Moderation Audit Trail</span>
          </div>

          <div className="divide-y divide-white/[0.06] text-xs">
            {auditLogs.length === 0 ? (
              <p className="py-6 text-center text-slate-500">No moderation audit actions logged yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-white font-medium">
                      <strong className="text-white">{log.moderator.fullName}</strong>{" "}
                      <span className="text-slate-400">performed</span>{" "}
                      <span
                        className={`font-semibold ${
                          log.action === "APPROVE"
                            ? "text-emerald-400"
                            : log.action === "REJECT"
                            ? "text-rose-400"
                            : "text-purple-400"
                        }`}
                      >
                        {log.action}
                      </span>
                    </p>
                    {log.reason && <p className="text-[11px] text-slate-400">&ldquo;{log.reason}&rdquo;</p>}
                  </div>
                  <span className="text-[10px] text-slate-500">{formatTimeAgo(log.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Rejection / Request Changes Reason Modal */}
      {actionPost && actionType && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141d] border border-white/10 max-w-md w-full p-6 rounded-2xl space-y-4 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {actionType === "REJECT" ? (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>Reject Submission</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-5 h-5 text-purple-400" />
                    <span>Request Changes from Author</span>
                  </>
                )}
              </h3>
              <button
                onClick={() => {
                  setActionPost(null);
                  setActionType(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Reason (visible to author):
              </label>
              <textarea
                rows={3}
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder={
                  actionType === "REJECT"
                    ? "Explain why this post violates community guidelines..."
                    : "Explain what adjustments are needed before this can be approved..."
                }
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e5b842]/40"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => {
                  setActionPost(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={submitActionWithReason}
                disabled={actionLoading || !reasonInput.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-40 ${
                  actionType === "REJECT"
                    ? "bg-rose-600 hover:bg-rose-500"
                    : "bg-purple-600 hover:bg-purple-500"
                }`}
              >
                {actionLoading ? "Submitting..." : `Confirm ${actionType === "REJECT" ? "Rejection" : "Request"}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
