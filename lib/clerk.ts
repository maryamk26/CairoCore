import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  console.log("[lib/clerk] getCurrentUser() called");
  try {
    const user = await currentUser();
    console.log("[lib/clerk] getCurrentUser() result:", {
      userId: user?.id || "none",
      email: user?.emailAddresses?.[0]?.emailAddress || "none",
      hasUser: !!user,
    });
    return user;
  } catch (error) {
    console.error("[lib/clerk] getCurrentUser() error:", error);
    throw error;
  }
}

/**
 * Get the current user's ID
 * Use this in Server Components and API routes
 */
export async function getCurrentUserId() {
  console.log("[lib/clerk] getCurrentUserId() called");
  try {
    const { userId } = await auth();
    console.log("[lib/clerk] getCurrentUserId() result:", userId || "none");
    return userId;
  } catch (error) {
    console.error("[lib/clerk] getCurrentUserId() error:", error);
    throw error;
  }
}

/**
 * Check if user is authenticated
 * Use this in Server Components and API routes
 */
export async function isAuthenticated() {
  console.log("[lib/clerk] isAuthenticated() called");
  try {
    const { userId } = await auth();
    const authenticated = !!userId;
    console.log("[lib/clerk] isAuthenticated() result:", authenticated, userId || "no userId");
    return authenticated;
  } catch (error) {
    console.error("[lib/clerk] isAuthenticated() error:", error);
    return false;
  }
}

