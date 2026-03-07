import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const places = await prisma.place.findMany({
      where: { createdBy: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        address: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      places: places.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        address: p.address,
        createdAt: p.createdAt,
      })),
    });
  } catch (err) {
    console.error("Profile places fetch failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
