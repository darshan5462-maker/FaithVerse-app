import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await props.params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });
    }

    // Check if like exists
    const existing = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existing) {
      // Unlike
      await prisma.like.delete({
        where: { id: existing.id },
      });
      const likesCount = await prisma.like.count({ where: { postId } });
      return NextResponse.json({ success: true, liked: false, likesCount });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      const likesCount = await prisma.like.count({ where: { postId } });
      return NextResponse.json({ success: true, liked: true, likesCount });
    }
  } catch (error: any) {
    console.error("Error in like API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
