import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/profile?username=...&currentUserId=... - Get user profile details & settings
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const currentUserId = searchParams.get("currentUserId");

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
        email: true,
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
        settings: {
          select: {
            isPrivate: true,
            allowDirectMessages: true,
            preferredLanguage: true,
            emailNotifications: true,
            dailyVerseAlert: true,
            prayerAlerts: true,
            theme: true,
          },
        },
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
        followers: currentUserId
          ? {
              where: { followerId: currentUserId },
              select: { id: true },
            }
          : false,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    const isFollowing = currentUserId
      ? Array.isArray(user.followers) && user.followers.length > 0
      : false;

    return NextResponse.json({
      success: true,
      profile: {
        ...user,
        isFollowing,
      },
    });
  } catch (error: any) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to load profile" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update user profile information, media & settings
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      fullName,
      bio,
      avatarUrl,
      bannerUrl,
      location,
      religion,
      website,
      email,
      settings,
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required to update profile" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found in database" },
        { status: 404 }
      );
    }

    // Update core user record
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName ? fullName.trim() : existingUser.fullName,
        bio: typeof bio === "string" ? bio.trim() : existingUser.bio,
        avatarUrl: avatarUrl ? avatarUrl : existingUser.avatarUrl,
        bannerUrl: bannerUrl ? bannerUrl : existingUser.bannerUrl,
        location: typeof location === "string" ? location.trim() : existingUser.location,
        religion: typeof religion === "string" ? religion.trim() : existingUser.religion,
        website: typeof website === "string" ? website.trim() : existingUser.website,
        email: email ? email.trim() : existingUser.email,
      },
      select: {
        id: true,
        email: true,
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
      },
    });

    // Update or create UserSettings if provided
    let updatedSettings = existingUser.settings;
    if (settings && typeof settings === "object") {
      updatedSettings = await prisma.userSettings.upsert({
        where: { userId },
        create: {
          userId,
          isPrivate: settings.isPrivate ?? false,
          allowDirectMessages: settings.allowDirectMessages ?? true,
          preferredLanguage: settings.preferredLanguage || "en",
          emailNotifications: settings.emailNotifications ?? true,
          dailyVerseAlert: settings.dailyVerseAlert ?? true,
          prayerAlerts: settings.prayerAlerts ?? true,
          theme: settings.theme || "dark",
        },
        update: {
          isPrivate: settings.isPrivate !== undefined ? settings.isPrivate : undefined,
          allowDirectMessages:
            settings.allowDirectMessages !== undefined
              ? settings.allowDirectMessages
              : undefined,
          preferredLanguage: settings.preferredLanguage || undefined,
          emailNotifications:
            settings.emailNotifications !== undefined
              ? settings.emailNotifications
              : undefined,
          dailyVerseAlert:
            settings.dailyVerseAlert !== undefined ? settings.dailyVerseAlert : undefined,
          prayerAlerts:
            settings.prayerAlerts !== undefined ? settings.prayerAlerts : undefined,
          theme: settings.theme || undefined,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Profile and account settings updated successfully!",
      user: {
        ...updated,
        settings: updatedSettings,
      },
    });
  } catch (error: any) {
    console.error("Profile PATCH error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 500 }
    );
  }
}
