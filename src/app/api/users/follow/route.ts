import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/users/follow - Follow or Unfollow a user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { followerId, followingId, action } = body;

    if (!followerId || !followingId) {
      return NextResponse.json(
        { success: false, error: "followerId and followingId are required" },
        { status: 400 }
      );
    }

    if (followerId === followingId) {
      return NextResponse.json(
        { success: false, error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Verify both users exist
    const [follower, targetUser] = await Promise.all([
      prisma.user.findUnique({ where: { id: followerId } }),
      prisma.user.findUnique({ where: { id: followingId } }),
    ]);

    if (!follower || !targetUser) {
      return NextResponse.json(
        { success: false, error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Check existing follow relationship
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    let isFollowing = false;

    if (action === "UNFOLLOW" || (action === "TOGGLE" && existingFollow)) {
      if (existingFollow) {
        await prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId,
              followingId,
            },
          },
        });
      }
      isFollowing = false;
    } else {
      if (!existingFollow) {
        await prisma.follow.create({
          data: {
            followerId,
            followingId,
          },
        });

        // Create notification for followed user
        await prisma.notification.create({
          data: {
            userId: followingId,
            title: "New Follower",
            message: `${follower.fullName} (@${follower.username}) started following you in FaithVerse!`,
            type: "SOCIAL",
            actionUrl: `/profile/${follower.username}`,
          },
        });
      }
      isFollowing = true;
    }

    // Get updated follower count for target user
    const followersCount = await prisma.follow.count({
      where: { followingId },
    });

    return NextResponse.json({
      success: true,
      isFollowing,
      followersCount,
      message: isFollowing
        ? `You are now following ${targetUser.fullName}`
        : `Unfollowed ${targetUser.fullName}`,
    });
  } catch (error: any) {
    console.error("Error in /api/users/follow:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update follow status" },
      { status: 500 }
    );
  }
}
