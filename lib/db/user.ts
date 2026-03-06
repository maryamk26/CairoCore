import { prisma } from "@/lib/prisma";

export async function upsertUser(supabaseId: string, email: string) {
  return prisma.user.upsert({
    where: { id: supabaseId },
    create: { id: supabaseId, email },
    update: { email },
  });
}
