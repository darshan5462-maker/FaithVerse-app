import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const reels = await prisma.video.findMany({
      where: {
        videoType: "REEL",
        moderationStatus: "APPROVED",
      },
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
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, reels });
  } catch (error: any) {
    console.error("Error fetching reels:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
