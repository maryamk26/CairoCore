import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopRecommendations } from "@/utils/planner/recommendation";

const MOCK_PLACES = [ /* ...your mock data... */ ];

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json();
    if (!preferences) return NextResponse.json({ error: "Preferences are required" }, { status: 400 });

    let places;
    let usingMockData = false;

    try {
      places = await prisma.place.findMany({
        where: { status: "approved" },
        select: {
          id: true,
          title: true,
          description: true,
          images: true,
          latitude: true,
          longitude: true,
          address: true,
          vibe: true,
          entryFees: true,
          cameraFees: true,
          petsFriendly: true,
          kidsFriendly: true,
        },
      });

      if (places.length === 0) {
        places = MOCK_PLACES;
        usingMockData = true;
      }
    } catch {
      places = MOCK_PLACES;
      usingMockData = true;
    }

    const recommendations = getTopRecommendations(places, preferences);

    return NextResponse.json({
      success: true,
      recommendations,
      totalPlaces: places.length,
      matchedPlaces: recommendations.length,
      usingMockData,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get recommendations" }, { status: 500 });
  }
}
