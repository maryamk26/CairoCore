/**
 * Client-side utilities for authentication
 * Use these functions in Client Components when you need to check session via API
 */

export interface SessionResponse {
  authenticated: boolean;
  userId: string | null;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    emailAddresses: Array<{
      id: string;
      emailAddress: string;
    }>;
    imageUrl: string;
    username: string | null;
  } | null;
  error?: string;
}

/**
 * Check authentication status by calling the session API
 * Use this in Client Components when you need to explicitly check session via API
 * 
 * @returns Promise<SessionResponse>
 * 
 * @example
 * ```tsx
 * "use client";
 * import { checkSession } from "@/lib/auth-client";
 * 
 * async function MyComponent() {
 *   const session = await checkSession();
 *   if (session.authenticated) {
 *     // User is logged in
 *   }
 * }
 * ```
 */
export async function checkSession(): Promise<SessionResponse> {
  const timestamp = new Date().toISOString();
  console.log("\n=== CLIENT SESSION CHECK ===");
  console.log(`[${timestamp}] Calling /api/auth/session`);
  
  try {
    const response = await fetch("/api/auth/session", {
      method: "GET",
      credentials: "include", // Include cookies for authentication
      cache: "no-store", // Always fetch fresh data
    });

    console.log("Response status:", response.status, response.statusText);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`Failed to check session: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Session response:", {
      authenticated: data.authenticated,
      userId: data.userId || "none",
      hasUser: !!data.user,
      error: data.error || "none",
    });
    console.log("===================\n");
    
    return data;
  } catch (error) {
    console.error("\n=== CLIENT SESSION CHECK ERROR ===");
    console.error(`[${timestamp}] Error:`, error);
    console.error("===================\n");
    
    return {
      authenticated: false,
      userId: null,
      user: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

