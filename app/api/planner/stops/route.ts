import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function vibeToArray(v: string | null): string[] {
  if (!v?.trim()) return [];
  return v.split(",").map((s) => s.trim());
}

function toRecommendationShape(place: {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  entranceFee: number | null;
  cameraFee: number | null;
  vibe: string | null;
}) {
  return {
    id: place.id,
    title: place.name,
    description: place.description ?? "",
    images: [],
    latitude: place.latitude,
    longitude: place.longitude,
    address: place.address ?? "",
    vibe: vibeToArray(place.vibe),
    entryFees: place.entranceFee,
    cameraFees: place.cameraFee,
    petsFriendly: false,
    kidsFriendly: true,
    matchScore: 0,
    matchReasons: [] as string[],
    ...(place.category && { category: place.category }),
  };
}

function isCoffeeShop(category: string | null): boolean {
  if (!category || typeof category !== "string") return false;
  const lower = category.toLowerCase();
  return (
    lower.includes("cafe") ||
    lower.includes("coffee") ||
    lower === "catering.cafe" ||
    lower === "catering.coffee_shop"
  );
}

function isRestaurant(category: string | null): boolean {
  if (!category || typeof category !== "string") return false;
  const lower = category.toLowerCase();
  return lower.includes("restaurant") || lower === "catering.restaurant";
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type !== "coffee_shop" && type !== "restaurant") {
      return NextResponse.json(
        { error: "Invalid type. Use coffee_shop or restaurant" },
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
        entranceFee: true,
        cameraFee: true,
        vibe: true,
      },
    });

    const matchFn = type === "coffee_shop" ? isCoffeeShop : isRestaurant;
    const places = allPlaces
      .filter((p) => matchFn(p.category))
      .sort((a, b) => a.name.localeCompare(b.name));

    const recommendations = places.map(toRecommendationShape);

    return NextResponse.json({
      success: true,
      recommendations,
      type,
    });
  } catch (error) {
    console.error("Error getting stop recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
