import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

// GET - Fetch all saved locations for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: {
        savedLocations: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      locations: dbUser.savedLocations
    });
  } catch (error) {
    console.error("Error fetching saved locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved locations" },
      { status: 500 }
    );
  }
}

// POST - Create a new saved location
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, address, latitude, longitude } = body;

    if (!title || latitude === undefined || longitude === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: title, latitude, longitude" },
        { status: 400 }
      );
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: "Invalid coordinates" },
        { status: 400 }
      );
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create saved location
    const savedLocation = await prisma.savedLocation.create({
      data: {
        userId: dbUser.id,
        title,
        address: address || null,
        latitude,
        longitude
      }
    });

    return NextResponse.json({
      success: true,
      location: savedLocation
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating saved location:", error);
    return NextResponse.json(
      { error: "Failed to create saved location" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a saved location
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('id');

    if (!locationId) {
      return NextResponse.json(
        { error: "Location ID is required" },
        { status: 400 }
      );
    }

    // Find user in database
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! }
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Verify the location belongs to the user
    const location = await prisma.savedLocation.findUnique({
      where: { id: locationId }
    });

    if (!location || location.userId !== dbUser.id) {
      return NextResponse.json(
        { error: "Location not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the location
    await prisma.savedLocation.delete({
      where: { id: locationId }
    });

    return NextResponse.json({
      success: true,
      message: "Location deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting saved location:", error);
    return NextResponse.json(
      { error: "Failed to delete saved location" },
      { status: 500 }
    );
  }
}

