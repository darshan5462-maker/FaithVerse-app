import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/users/search?q=...&currentUserId=...
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";
    const currentUserId = searchParams.get("currentUserId") || "";

    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { fullName: { contains: query, mode: "insensitive" } },
              { username: { contains: query, mode: "insensitive" } },
              { bio: { contains: query, mode: "insensitive" } },
              { religion: { contains: query, mode: "insensitive" } },
              { location: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      select: {
        id: true,
        username: true,
        fullName: true,
        role: true,
        avatarUrl: true,
        bannerUrl: true,
        bio: true,
        location: true,
        religion: true,
        isVerified: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: { where: { moderationStatus: "APPROVED" } },
          },
        },
        followers: currentUserId
          ? {
              where: { followerId: currentUserId },
              select: { id: true },
            }
          : false,
      },
      take: 25,
      orderBy: { createdAt: "desc" },
    });

    const formattedUsers = users.map((u: any) => ({
      id: u.id,
      username: u.username,
      fullName: u.fullName,
      role: u.role,
      avatarUrl:
        u.avatarUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      bannerUrl: u.bannerUrl,
      bio: u.bio || "Member of the FaithVerse global family.",
      location: u.location || "Global Sanctuary",
      religion: u.religion || "Christian",
      isVerified: u.isVerified,
      followersCount: u._count.followers,
      followingCount: u._count.following,
      postsCount: u._count.posts,
      isFollowing: currentUserId
        ? Array.isArray(u.followers) && u.followers.length > 0
        : false,
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      count: formattedUsers.length,
    });
  } catch (error: any) {
    console.error("Error searching users:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to search users" },
      { status: 500 }
    );
  }
}
