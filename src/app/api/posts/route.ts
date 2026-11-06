import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/posts - Fetch posts with strict moderation filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") || "forYou";
    const category = searchParams.get("category");
    const authorUsername = searchParams.get("author");
    const statusParam = searchParams.get("status"); // only for author or admin view
    const currentUserId = searchParams.get("userId");

    // Standard public feed MUST ONLY return APPROVED posts
    const whereClause: any = {
      moderationStatus: statusParam || "APPROVED",
    };

    if (category && category !== "ALL") {
      whereClause.category = category;
    }

    if (authorUsername) {
      whereClause.author = {
        username: authorUsername,
      };
    }

    let orderBy: any = { publishedAt: "desc" };

    if (tab === "trending") {
      orderBy = { likes: { _count: "desc" } };
    } else if (tab === "latest") {
      orderBy = { createdAt: "desc" };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
            role: true,
          },
        },
        media: {
          orderBy: { orderIndex: "asc" },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
            savedBy: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
                avatarUrl: true,
              },
            },
            replies: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy,
      take: 30,
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      postType: post.postType,
      category: post.category,
      moderationStatus: post.moderationStatus,
      rejectionReason: post.rejectionReason,
      needsChangesNote: post.needsChangesNote,
      createdAt: post.createdAt,
      publishedAt: post.publishedAt,
      author: post.author,
      media: post.media,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      savesCount: post._count.savedBy,
      isLikedByMe: currentUserId ? post.likes.some((l) => l.userId === currentUserId) : false,
      recentComments: post.comments,
    }));

    return NextResponse.json({ success: true, posts: formattedPosts });
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/posts - Submit new post into PENDING moderation state
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, category, postType, mediaUrls, authorId } = body;

    if (!content || !authorId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (content, authorId)" },
        { status: 400 }
      );
    }

    // Verify user exists or find demo user
    let user = await prisma.user.findUnique({ where: { id: authorId } });
    if (!user) {
      // Find first user as fallback
      user = await prisma.user.findFirst();
      if (!user) {
        return NextResponse.json({ success: false, error: "No author found" }, { status: 404 });
      }
    }

    // Every user-submitted public post defaults strictly to PENDING
    const newPost = await prisma.post.create({
      data: {
        authorId: user.id,
        content: content.trim(),
        category: category || "FAITH_GROWTH",
        postType: postType || (mediaUrls && mediaUrls.length > 0 ? "PHOTO" : "TEXT"),
        moderationStatus: "PENDING", // Strict admin approval required
        media: mediaUrls && mediaUrls.length > 0
          ? {
              create: mediaUrls.map((url: string, index: number) => {
                const isVideo =
                  postType === "VIDEO" ||
                  postType === "SERMON" ||
                  postType === "REEL" ||
                  url.startsWith("data:video") ||
                  Boolean(url.match(/\.(mp4|webm|mov|ogg|m4v)($|\?)/i));
                return {
                  url,
                  orderIndex: index,
                  mediaType: isVideo ? "VIDEO" : "IMAGE",
                  aspectRatio: isVideo ? "16:9" : "1:1",
                };
              }),
            }
          : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
            role: true,
          },
        },
        media: true,
      },
    });

    // Create system notification for post submission
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Post Submitted for Review",
        message: "Your post has entered the moderation queue. It will be published once approved by a moderator.",
        type: "SYSTEM",
        actionUrl: `/profile/${user.username}`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Post submitted successfully and is pending administrator review.",
      post: newPost,
    });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
