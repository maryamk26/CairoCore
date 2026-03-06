import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function normalizeVibe(v: string | null): string[] {
  if (!v?.trim()) return [];
  return v.split(",").map((s) => s.trim());
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const place = await prisma.place.findUnique({ where: { id } });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: place.id,
      title: place.name,
      description: place.description ?? "",
      images: [],
      location: {
        address: place.address ?? "",
        lat: place.latitude,
        lng: place.longitude,
      },
      workingHours: place.openingHours ?? null,
      entryFees: place.entranceFee,
      cameraFees: place.cameraFee,
      vibe: normalizeVibe(place.vibe),
      petsFriendly: false,
      kidsFriendly: true,
      bestTimeToVisit: place.bestVisitTime ? { timeOfDay: [place.bestVisitTime] } : null,
      category: place.category ?? "other",
    });
  } catch (error) {
    console.error("Place fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch place" }, { status: 500 });
  }
}
