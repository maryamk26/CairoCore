import { createClient } from '@/lib/supabase/server'

/**
 * Get the current authenticated user
 * Use this in Server Components and API routes
 */
export async function getCurrentUser() {
  console.log("[lib/auth] getCurrentUser() called");
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log("[lib/auth] getCurrentUser() error:", error.message);
      return null;
    }
    
    console.log("[lib/auth] getCurrentUser() result:", {
      userId: user?.id || "none",
      email: user?.email || "none",
      hasUser: !!user,
    });
    return user;
  } catch (error) {
    console.error("[lib/auth] getCurrentUser() error:", error);
    return null;
  }
}

/**
 * Get the current user's ID
 * Use this in Server Components and API routes
 */
export async function getCurrentUserId() {
  console.log("[lib/auth] getCurrentUserId() called");
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.log("[lib/auth] getCurrentUserId() result: none");
      return null;
    }
    
    console.log("[lib/auth] getCurrentUserId() result:", user.id);
    return user.id;
  } catch (error) {
    console.error("[lib/auth] getCurrentUserId() error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * Use this in Server Components and API routes
 */
export async function isAuthenticated() {
  console.log("[lib/auth] isAuthenticated() called");
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    const authenticated = !!user && !error;
    console.log("[lib/auth] isAuthenticated() result:", authenticated, user?.id || "no userId");
    return authenticated;
  } catch (error) {
    console.error("[lib/auth] isAuthenticated() error:", error);
    return false;
  }
}


