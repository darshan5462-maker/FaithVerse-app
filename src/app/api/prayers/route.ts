import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // all, answered, mine
    const userId = searchParams.get("userId");

    const where: any = {
      isPrivate: false,
    };

    if (filter === "answered") {
      where.isAnswered = true;
    } else if (filter === "active") {
      where.isAnswered = false;
    }

    if (filter === "mine" && userId) {
      where.authorId = userId;
    }

    const prayers = await prisma.prayerRequest.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
        interactions: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = prayers.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      isAnonymous: p.isAnonymous,
      isAnswered: p.isAnswered,
      answeredNotes: p.answeredNotes,
      prayerCount: p.prayerCount,
      createdAt: p.createdAt,
      author: p.isAnonymous
        ? {
            id: "anon",
            username: "anonymous_seeker",
            fullName: "Faith Companion",
            avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
            isVerified: false,
          }
        : p.author,
      hasPrayed: userId ? p.interactions.some((i) => i.userId === userId) : false,
    }));

    return NextResponse.json({ success: true, prayers: formatted });
  } catch (error: any) {
    console.error("Error fetching prayers:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, isAnonymous, isPrivate, authorId } = body;

    if (!title || !description || !authorId) {
      return NextResponse.json(
        { success: false, error: "Title, description, and authorId are required" },
        { status: 400 }
      );
    }

    const prayer = await prisma.prayerRequest.create({
      data: {
        authorId,
        title: title.trim(),
        description: description.trim(),
        isAnonymous: Boolean(isAnonymous),
        isPrivate: Boolean(isPrivate),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, prayer });
  } catch (error: any) {
    console.error("Error creating prayer:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
