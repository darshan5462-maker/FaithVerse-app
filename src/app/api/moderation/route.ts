import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/moderation - Get stats, pending queue, and audit logs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "PENDING"; // PENDING, REJECTED, NEEDS_CHANGES, APPROVED, ALL

    // Gather overview metrics
    const [
      totalUsers,
      totalPosts,
      pendingCount,
      approvedCount,
      rejectedCount,
      needsChangesCount,
      reportsCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.count({ where: { moderationStatus: "PENDING" } }),
      prisma.post.count({ where: { moderationStatus: "APPROVED" } }),
      prisma.post.count({ where: { moderationStatus: "REJECTED" } }),
      prisma.post.count({ where: { moderationStatus: "NEEDS_CHANGES" } }),
      prisma.report.count({ where: { status: "OPEN" } }),
    ]);

    const where: any = {};
    if (filter !== "ALL") {
      where.moderationStatus = filter;
    }

    const queue = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                posts: true,
              },
            },
          },
        },
        media: true,
        moderationReviews: {
          include: {
            reviewer: {
              select: {
                username: true,
                fullName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const auditLogs = await prisma.moderationAuditLog.findMany({
      include: {
        admin: {
          select: {
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers,
        totalPosts,
        pendingCount,
        approvedCount,
        rejectedCount,
        needsChangesCount,
        reportsCount,
      },
      queue,
      auditLogs,
    });
  } catch (error: any) {
    console.error("Error fetching moderation data:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/moderation - Execute moderation action (APPROVE, REJECT, REQUEST_CHANGES, REMOVE)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, action, reason, internalNotes, adminId } = body;

    if (!postId || !action || !adminId) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: postId, action, adminId" },
        { status: 400 }
      );
    }

    // Ensure post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    });

    if (!post) {
      return NextResponse.json({ success: false, error: "Post not found" }, { status: 404 });
    }

    // Ensure admin exists or map to first admin
    let reviewer = await prisma.user.findUnique({ where: { id: adminId } });
    if (!reviewer) {
      reviewer = await prisma.user.findFirst({
        where: { role: { in: ["SUPER_ADMIN", "ADMIN", "MODERATOR"] } },
      });
      if (!reviewer) {
        return NextResponse.json({ success: false, error: "Authorized reviewer not found" }, { status: 403 });
      }
    }

    let newStatus = "APPROVED";
    let notificationTitle = "Post Approved!";
    let notificationMessage = "Your post has been reviewed, approved, and is now visible on FaithVerse feeds.";

    if (action === "APPROVE") {
      newStatus = "APPROVED";
      await prisma.post.update({
        where: { id: postId },
        data: {
          moderationStatus: "APPROVED",
          publishedAt: new Date(),
          rejectionReason: null,
          needsChangesNote: null,
        },
      });
    } else if (action === "REJECT") {
      newStatus = "REJECTED";
      notificationTitle = "Post Submission Update";
      notificationMessage = `Your submission was not approved. Reason: ${reason || "Did not align with community safety standards."}`;
      await prisma.post.update({
        where: { id: postId },
        data: {
          moderationStatus: "REJECTED",
          rejectionReason: reason || "Community safety guideline standard.",
        },
      });
    } else if (action === "REQUEST_CHANGES") {
      newStatus = "NEEDS_CHANGES";
      notificationTitle = "Changes Requested for Your Post";
      notificationMessage = `A moderator requested edits: ${reason || "Please review and update your content."}`;
      await prisma.post.update({
        where: { id: postId },
        data: {
          moderationStatus: "NEEDS_CHANGES",
          needsChangesNote: reason || "Please clarify or adjust content before approval.",
        },
      });
    } else if (action === "REMOVE") {
      newStatus = "REMOVED";
      notificationTitle = "Post Removed by Administration";
      notificationMessage = `Your post was taken down due to: ${reason || "Policy compliance violation."}`;
      await prisma.post.update({
        where: { id: postId },
        data: {
          moderationStatus: "REMOVED",
          rejectionReason: reason,
        },
      });
    }

    // Record formal ModerationReview
    await prisma.moderationReview.create({
      data: {
        postId,
        reviewerId: reviewer.id,
        action,
        reason: reason || null,
        internalNotes: internalNotes || null,
      },
    });

    // Record immutable ModerationAuditLog
    await prisma.moderationAuditLog.create({
      data: {
        adminId: reviewer.id,
        action: `${action}_POST`,
        targetEntity: "POST",
        targetId: postId,
        details: `Post by @${post.author.username} status set to ${newStatus}. Note: ${reason || "Standard review"}`,
      },
    });

    // Send author notification
    await prisma.notification.create({
      data: {
        userId: post.authorId,
        title: notificationTitle,
        message: notificationMessage,
        type: newStatus === "APPROVED" ? "POST_APPROVED" : "POST_REJECTED",
        actionUrl: `/profile/${post.author.username}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Post ${postId} transitioned to ${newStatus}`,
      moderationStatus: newStatus,
    });
  } catch (error: any) {
    console.error("Error executing moderation action:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
