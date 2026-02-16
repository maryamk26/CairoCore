import { createClient } from "./supabase/server";
import { prisma } from "./prisma";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error) {
    return { user: null, dbUser: null, error: error?.message || "Unauthorized" };
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    return { user, dbUser: null, error: "User not found in database" };
  }

  return { user, dbUser, error: null };
}
