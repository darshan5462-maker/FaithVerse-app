import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const churches = await prisma.church.findMany({
      include: {
        _count: {
          select: {
            members: true,
            events: true,
          },
        },
      },
      orderBy: { isVerified: "desc" },
    });

    return NextResponse.json({ success: true, churches });
  } catch (error: any) {
    console.error("Error fetching churches:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
