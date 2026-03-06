import { prisma } from "@/lib/prisma";

export type CreatePlaceInput = {
  name: string;
  latitude: number;
  longitude: number;
  category?: string | null;
  description?: string | null;
  address?: string | null;
  openingHours?: string | null;
  entranceFee?: number | null;
  cameraFee?: number | null;
  vibe?: string | null;
  bestVisitTime?: string | null;
};

export async function createPlace(data: CreatePlaceInput, createdById: string) {
  return prisma.place.create({
    data: {
      name: data.name,
      latitude: data.latitude,
      longitude: data.longitude,
      category: data.category ?? null,
      description: data.description ?? null,
      address: data.address ?? null,
      openingHours: data.openingHours ?? null,
      entranceFee: data.entranceFee ?? null,
      cameraFee: data.cameraFee ?? null,
      vibe: data.vibe ?? null,
      bestVisitTime: data.bestVisitTime ?? null,
      createdBy: createdById,
    },
  });
}
