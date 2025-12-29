import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTopRecommendations } from "@/utils/planner/recommendation";

// Mock data for testing when database is not available
const MOCK_PLACES = [
  {
    id: "1",
    title: "Pyramids of Giza and Sphinx",
    description: "The last surviving wonder of the ancient world. Stand in awe before the Great Pyramid of Khufu, explore the mysterious Sphinx, and walk through 4,500 years of history.",
    images: ["/images/places/pyramids.jpeg"],
    latitude: 29.9792,
    longitude: 31.1342,
    address: "Al Haram, Giza Governorate, Egypt",
    vibe: ["historical", "photography", "cultural", "adventure"],
    entryFees: 540,
    cameraFees: 300,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "2",
    title: "Grand Egyptian Museum",
    description: "The world's largest archaeological museum dedicated to a single civilization. Home to over 100,000 artifacts including the complete Tutankhamun collection.",
    images: ["/images/places/grandm.jpeg"],
    latitude: 30.0081,
    longitude: 31.1322,
    address: "Cairo-Alexandria Desert Rd, Kafr Nassar, Al Giza Desert, Giza",
    vibe: ["historical", "cultural", "modern", "photography"],
    entryFees: 600,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "3",
    title: "Khan el-Khalili Bazaar",
    description: "Cairo's most famous marketplace dating back to 1382. Get lost in the maze of shops selling everything from spices to jewelry.",
    images: ["/images/places/khan.jpeg"],
    latitude: 30.0479,
    longitude: 31.2626,
    address: "El-Gamaleya, Cairo Governorate, Egypt",
    vibe: ["cultural", "shopping", "photography", "adventure"],
    entryFees: 0,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "4",
    title: "Cairo Tower",
    description: "Iconic 187-meter tower offering 360° views of Cairo. Perfect for sunset photos and getting a bird's-eye view of the city.",
    images: ["/images/places/cairotower.jpeg"],
    latitude: 30.0456,
    longitude: 31.2242,
    address: "Zamalek, Cairo Governorate, Egypt",
    vibe: ["modern", "romantic", "photography"],
    entryFees: 200,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "5",
    title: "Al-Azhar Park",
    description: "A stunning 30-hectare green oasis in the heart of historic Cairo. Perfect for picnics, walking, and chilling with friends.",
    images: ["/images/backgrounds/home1.jpg"],
    latitude: 30.0407,
    longitude: 31.2629,
    address: "Salah Salem St, Cairo Governorate, Egypt",
    vibe: ["nature", "romantic", "photography"],
    entryFees: 20,
    cameraFees: 0,
    petsFriendly: true,
    kidsFriendly: true,
  },
  {
    id: "6",
    title: "Egyptian Museum (Tahrir)",
    description: "The OG museum in downtown Cairo housing over 120,000 ancient Egyptian artifacts. Home to the famous golden mask of Tutankhamun.",
    images: ["/images/backgrounds/aboutbg.jpg"],
    latitude: 30.0478,
    longitude: 31.2336,
    address: "Meret Basha, Ismailia, Cairo Governorate, Egypt",
    vibe: ["historical", "cultural", "photography"],
    entryFees: 450,
    cameraFees: 50,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "7",
    title: "Citadel of Saladin",
    description: "Medieval Islamic fortress with breathtaking views and stunning mosques. The Muhammad Ali Mosque inside is absolutely gorgeous.",
    images: ["/images/backgrounds/searchbg.jpg"],
    latitude: 30.0296,
    longitude: 31.2600,
    address: "Al Abageyah, Qism El-Khalifa, Cairo Governorate, Egypt",
    vibe: ["historical", "cultural", "photography"],
    entryFees: 180,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "8",
    title: "Cairo Opera House",
    description: "Egypt's main performing arts venue in the heart of Zamalek. Catch world-class performances, concerts, and cultural events.",
    images: ["/images/backgrounds/authbg.jpg"],
    latitude: 30.0428,
    longitude: 31.2244,
    address: "Gezira, Cairo Governorate, Egypt",
    vibe: ["modern", "cultural", "romantic"],
    entryFees: 300,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "9",
    title: "Nile River Cruise",
    description: "Experience Cairo from the water! Cruise down the Nile with dinner, live entertainment, and stunning city views.",
    images: ["/images/backgrounds/home1.jpg"],
    latitude: 30.0444,
    longitude: 31.2357,
    address: "Nile Corniche, Cairo Governorate, Egypt",
    vibe: ["romantic", "modern", "adventure"],
    entryFees: 800,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
  {
    id: "10",
    title: "City Stars Mall",
    description: "The largest shopping mall in Cairo. Over 750 stores, restaurants, cinema, and entertainment. Perfect for shopping sprees!",
    images: ["/images/backgrounds/aboutbg.jpg"],
    latitude: 30.0726,
    longitude: 31.3456,
    address: "Nasr City, Cairo Governorate, Egypt",
    vibe: ["shopping", "modern"],
    entryFees: 0,
    cameraFees: 0,
    petsFriendly: false,
    kidsFriendly: true,
  },
];

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

    let places;
    let usingMockData = false;

    // Try to fetch from database first
    try {
      places = await prisma.place.findMany({
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
      
      // If no places in database, use mock data
      if (places.length === 0) {
        console.log("No places in database, using mock data");
        places = MOCK_PLACES;
        usingMockData = true;
      }
    } catch (dbError) {
      console.log("Database error, using mock data:", dbError);
      places = MOCK_PLACES;
      usingMockData = true;
    }

    // Get recommendations based on preferences
    const recommendations = getTopRecommendations(places, preferences);

    return NextResponse.json({
      success: true,
      recommendations,
      totalPlaces: places.length,
      matchedPlaces: recommendations.length,
      usingMockData, // Let frontend know we're using mock data
    });
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}

