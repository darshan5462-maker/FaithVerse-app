import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/profile?username=... - Get user profile details & statistics
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username parameter is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
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
        website: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            posts: {
              where: { moderationStatus: "APPROVED" },
            },
            followers: true,
            following: true,
            prayerActions: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: user,
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update user profile information & avatar
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, fullName, bio, avatarUrl, bannerUrl, location, religion } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required to update profile" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName ? fullName.trim() : existingUser.fullName,
        bio: typeof bio === "string" ? bio.trim() : existingUser.bio,
        avatarUrl: avatarUrl ? avatarUrl : existingUser.avatarUrl,
        bannerUrl: bannerUrl ? bannerUrl : existingUser.bannerUrl,
        location: typeof location === "string" ? location.trim() : existingUser.location,
        religion: typeof religion === "string" ? religion.trim() : existingUser.religion,
      },
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
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: updated,
    });
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
