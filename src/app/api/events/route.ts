import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const events = await prisma.event.findMany({
      include: {
        church: {
          select: {
            id: true,
            name: true,
            isVerified: true,
          },
        },
        registrations: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: { startDate: "asc" },
    });

    const formatted = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      category: e.category,
      location: e.location,
      isOnline: e.isOnline,
      streamUrl: e.streamUrl,
      startDate: e.startDate,
      endDate: e.endDate,
      bannerUrl: e.bannerUrl,
      church: e.church,
      registrationsCount: e.registrations.length,
      isRegistered: userId ? e.registrations.some((r) => r.userId === userId) : false,
    }));

    return NextResponse.json({ success: true, events: formatted });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, userId } = body;

    if (!eventId || !userId) {
      return NextResponse.json({ success: false, error: "eventId and userId required" }, { status: 400 });
    }

    const existing = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (existing) {
      // Unregister
      await prisma.eventRegistration.delete({ where: { id: existing.id } });
      const count = await prisma.eventRegistration.count({ where: { eventId } });
      return NextResponse.json({ success: true, isRegistered: false, count });
    } else {
      // Register
      await prisma.eventRegistration.create({
        data: {
          eventId,
          userId,
        },
      });
      const count = await prisma.eventRegistration.count({ where: { eventId } });
      return NextResponse.json({ success: true, isRegistered: true, count });
    }
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
