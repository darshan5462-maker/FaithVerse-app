import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: prayerRequestId } = await props.params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, error: "userId required" }, { status: 400 });
    }

    // Check if already prayed
    const existing = await prisma.prayerInteraction.findUnique({
      where: {
        prayerRequestId_userId: {
          prayerRequestId,
          userId,
        },
      },
    });

    if (existing) {
      // Undo pray
      await prisma.prayerInteraction.delete({ where: { id: existing.id } });
      const updated = await prisma.prayerRequest.update({
        where: { id: prayerRequestId },
        data: { prayerCount: { decrement: 1 } },
      });
      return NextResponse.json({ success: true, hasPrayed: false, prayerCount: Math.max(0, updated.prayerCount) });
    } else {
      // Record prayer
      await prisma.prayerInteraction.create({
        data: {
          prayerRequestId,
          userId,
        },
      });
      const updated = await prisma.prayerRequest.update({
        where: { id: prayerRequestId },
        data: { prayerCount: { increment: 1 } },
        include: { author: true },
      });

      // Send notification to author
      if (updated.authorId !== userId) {
        await prisma.notification.create({
          data: {
            userId: updated.authorId,
            title: "Someone Prayed For You! 🙏",
            message: `A community member just lifted up your prayer request: "${updated.title.substring(0, 30)}..."`,
            type: "PRAYER",
            actionUrl: `/prayers`,
          },
        });
      }

      return NextResponse.json({ success: true, hasPrayed: true, prayerCount: updated.prayerCount });
    }
  } catch (error: any) {
    console.error("Error in pray action:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
