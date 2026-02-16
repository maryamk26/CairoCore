import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/apiUtils";

export async function GET() {
  const { dbUser, error } = await getAuthenticatedUser();
  if (!dbUser) return NextResponse.json({ error }, { status: 401 });

  const locations = await prisma.savedLocation.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, locations });
}

export async function POST(request: NextRequest) {
  const { dbUser, error } = await getAuthenticatedUser();
  if (!dbUser) return NextResponse.json({ error }, { status: 401 });

  const body = await request.json();
  const { title, address, latitude, longitude } = body;

  if (!title || latitude === undefined || longitude === undefined)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180)
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });

  const location = await prisma.savedLocation.create({
    data: { userId: dbUser.id, title, address: address || null, latitude, longitude },
  });

  return NextResponse.json({ success: true, location }, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { dbUser, error } = await getAuthenticatedUser();
  if (!dbUser) return NextResponse.json({ error }, { status: 401 });

  const locationId = new URL(request.url).searchParams.get("id");
  if (!locationId) return NextResponse.json({ error: "Location ID is required" }, { status: 400 });

  const location = await prisma.savedLocation.findUnique({ where: { id: locationId } });
  if (!location || location.userId !== dbUser.id)
    return NextResponse.json({ error: "Location not found or unauthorized" }, { status: 404 });

  await prisma.savedLocation.delete({ where: { id: locationId } });
  return NextResponse.json({ success: true, message: "Location deleted successfully" });
}
