import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/admin/users - List all users with stats
export async function GET(request: Request) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        isSuspended: true,
        religion: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    console.error("Admin Users Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/admin/users - Toggle verification or suspension
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, action, value } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (userId, action)" },
        { status: 400 }
      );
    }

    let updateData: any = {};
    if (action === "TOGGLE_VERIFY") {
      updateData.isVerified = value !== undefined ? value : true;
    } else if (action === "TOGGLE_SUSPEND") {
      updateData.isSuspended = value !== undefined ? value : true;
    } else if (action === "SET_ROLE") {
      updateData.role = value;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `User ${action} updated successfully`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Admin User Update Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
