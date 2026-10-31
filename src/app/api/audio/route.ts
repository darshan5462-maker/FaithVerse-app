import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const tracks = await prisma.audioTrack.findMany({
      orderBy: { playsCount: "desc" },
    });

    return NextResponse.json({ success: true, tracks });
  } catch (error: any) {
    console.error("Error fetching audio tracks:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
