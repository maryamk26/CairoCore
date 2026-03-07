import { prisma } from "@/lib/prisma";

export async function upsertUser(
  supabaseId: string,
  email: string,
  data?: { name?: string; username?: string }
) {
  const trimmedEmail = email.trim();
  const existingByEmail = await prisma.user.findUnique({
    where: { email: trimmedEmail },
  });

  if (existingByEmail) {
    if (existingByEmail.id === supabaseId) {
      return prisma.user.update({
        where: { id: supabaseId },
        data: {
          ...(data && {
            name: data.name ?? undefined,
            username: data.username ?? undefined,
          }),
        },
      });
    }
    const oldId = existingByEmail.id;
    await prisma.$transaction([
      prisma.user.create({
        data: {
          id: supabaseId,
          email: `${trimmedEmail}.reconnect`,
          name: existingByEmail.name,
          username: existingByEmail.username,
        },
      }),
      prisma.place.updateMany({ where: { createdBy: oldId }, data: { createdBy: supabaseId } }),
      prisma.folder.updateMany({ where: { userId: oldId }, data: { userId: supabaseId } }),
      prisma.follow.updateMany({ where: { followerId: oldId }, data: { followerId: supabaseId } }),
      prisma.follow.updateMany({ where: { followingId: oldId }, data: { followingId: supabaseId } }),
      prisma.user.delete({ where: { id: oldId } }),
      prisma.user.update({ where: { id: supabaseId }, data: { email: trimmedEmail } }),
    ]);
    return prisma.user.findUniqueOrThrow({ where: { id: supabaseId } });
  }

  return prisma.user.create({
    data: {
      id: supabaseId,
      email: trimmedEmail,
      name: data?.name ?? null,
      username: data?.username ?? null,
    },
  });
}

export type UpdateProfileData = {
  name?: string | null;
  username?: string | null;
};

export async function updateUserProfile(userId: string, data: UpdateProfileData) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name !== undefined && { name: data.name || null }),
      ...(data.username !== undefined && { username: data.username || null }),
    },
  });
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
  });
  if (!user) return null;
  const { _count, ...rest } = user;
  return {
    ...rest,
    followerCount: _count.followers,
    followingCount: _count.following,
  };
}
