import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

/**
 * Get the current user's ID
 * Use this in Server Components and API routes
 */
export async function getCurrentUserId() {
  const { userId } = await auth();
  return userId;
}

/**
 * Check if user is authenticated
 * Use this in Server Components and API routes
 */
export async function isAuthenticated() {
  const { userId } = await auth();
  return !!userId;
}

