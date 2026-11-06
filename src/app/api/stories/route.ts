import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/stories - Fetch all active (unexpired) stories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const now = new Date();

    const dbStories = await prisma.story.findMany({
      where: {
        expiresAt: { gt: now },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // If database has stories, return them formatted
    if (dbStories.length > 0) {
      const formatted = dbStories.map((s) => ({
        id: s.id,
        userId: s.userId,
        username: s.user.username,
        fullName: s.user.fullName,
        avatarUrl: s.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
        storyMedia: s.mediaUrl,
        mediaType: s.mediaType,
        caption: s.caption || "",
        isVerified: s.user.isVerified,
        createdAt: s.createdAt,
        expiresAt: s.expiresAt,
      }));
      return NextResponse.json({ success: true, stories: formatted });
    }

    // Default starter stories if table is fresh
    const fallbackStories = [
      {
        id: "s1",
        userId: "pastor-demo-id",
        username: "pastor_john",
        fullName: "Pastor John Mathew",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
        storyMedia: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",
        mediaType: "IMAGE",
        caption: "Morning sunrise prayer walk. Praying for peace across our world today. 🌅",
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "s2",
        userId: "rachel-demo-id",
        username: "rachel_worship",
        fullName: "Rachel Vance",
        avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
        storyMedia: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
        mediaType: "IMAGE",
        caption: "Soundcheck in Bengaluru! So excited for tonight's worship night. 🎵✨",
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "s3",
        userId: "priya-demo-id",
        username: "priya_grace",
        fullName: "Priya Sharma",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
        storyMedia: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=800&q=80",
        mediaType: "IMAGE",
        caption: "Quiet morning devotion with coffee & Psalms. ☕📖",
        isVerified: true,
        createdAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json({ success: true, stories: fallbackStories });
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/stories - Upload a new 24-hour story
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, mediaUrl, mediaType, caption } = body;

    if (!userId || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (userId, mediaUrl)" },
        { status: 400 }
      );
    }

    // Verify user exists in database or fallback to first user
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ success: false, error: "Author not found" }, { status: 404 });
      }
    }

    // Set 24 hour expiration from right now
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.story.create({
      data: {
        userId: user.id,
        mediaUrl,
        mediaType: mediaType || "IMAGE",
        caption: caption ? caption.trim() : null,
        moderationStatus: "APPROVED", // Stories expire in 24 hours
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    const formattedStory = {
      id: story.id,
      userId: story.userId,
      username: story.user.username,
      fullName: story.user.fullName,
      avatarUrl: story.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      storyMedia: story.mediaUrl,
      mediaType: story.mediaType,
      caption: story.caption || "",
      isVerified: story.user.isVerified,
      createdAt: story.createdAt,
      expiresAt: story.expiresAt,
    };

    return NextResponse.json({
      success: true,
      message: "Story published to your 24-hour reel successfully!",
      story: formattedStory,
    });
  } catch (error: any) {
    console.error("Error creating story:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
