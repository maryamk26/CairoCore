import { prisma } from "@/lib/prisma";

export async function createFolder(userId: string, name: string) {
  return prisma.folder.create({
    data: { userId, name: name.trim() },
  });
}

export async function getFoldersByUserId(userId: string) {
  return prisma.folder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { savedPlaces: true } },
    },
  });
}

