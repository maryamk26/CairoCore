import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopRecommendations } from "@/utils/planner/recommendation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preferences } = body;

    if (!preferences) {
      return NextResponse.json(
        { error: "Preferences are required" },
        { status: 400 }
      );
    }

    // Fetch all approved places from database
    const places = await prisma.place.findMany({
      where: {
        status: "approved",
      },
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

    // Get recommendations based on preferences
    const recommendations = getTopRecommendations(places, preferences);

    return NextResponse.json({
      success: true,
      recommendations,
      totalPlaces: places.length,
      matchedPlaces: recommendations.length,
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}

