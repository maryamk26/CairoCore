import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopRecommendations } from "@/utils/planner/recommendation";

const STOP_CATEGORIES = ["catering.restaurant", "catering.cafe", "catering.coffee_shop"];

function isRestaurantOrCafe(category: string | null): boolean {
  if (!category || typeof category !== "string") return false;
  const lower = category.toLowerCase();
  return (
    STOP_CATEGORIES.includes(category) ||
    lower.includes("restaurant") ||
    lower.includes("cafe") ||
    lower.includes("coffee")
  );
}

function dbPlaceToInput(place: {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  openingHours: string | null;
  entranceFee: number | null;
  cameraFee: number | null;
  vibe: string | null;
}) {
  return {
    id: place.id,
    name: place.name,
    title: place.name,
    description: place.description ?? "",
    latitude: place.latitude,
    longitude: place.longitude,
    address: place.address ?? "",
    entranceFee: place.entranceFee,
    cameraFee: place.cameraFee,
    vibe: place.vibe,
    category: place.category ?? undefined,
    images: [],
    entryFees: place.entranceFee,
    cameraFees: place.cameraFee,
    petsFriendly: false,
    kidsFriendly: true,
  };
}

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

    const allPlaces = await prisma.place.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        latitude: true,
        longitude: true,
        address: true,
        openingHours: true,
        entranceFee: true,
        cameraFee: true,
        vibe: true,
      },
    });

    const places = allPlaces.filter((p) => !isRestaurantOrCafe(p.category));
    const inputPlaces = places.map(dbPlaceToInput);
    const recommendations = getTopRecommendations(inputPlaces, preferences, 24);

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
