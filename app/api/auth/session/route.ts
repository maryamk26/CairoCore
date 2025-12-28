import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

/**
 * GET /api/auth/session
 * Check if the user is authenticated and return session information
 */
export async function GET(request: Request) {
  const timestamp = new Date().toISOString();
  
  try {
    // Log request information
    const headersList = await headers();
    const authHeader = headersList.get("authorization");
    const cookieHeader = headersList.get("cookie");
    const userAgent = headersList.get("user-agent");
    const referer = headersList.get("referer");
    
    console.log("=== SESSION API REQUEST ===");
    console.log(`[${timestamp}] Request received`);
    console.log("Request URL:", request.url);
    console.log("User-Agent:", userAgent);
    console.log("Referer:", referer);
    console.log("Authorization Header:", authHeader ? "Present" : "Missing");
    console.log("Cookie Header:", cookieHeader ? "Present" : "Missing");
    if (cookieHeader) {
      const hasSupabaseCookie = cookieHeader.includes("sb-") || cookieHeader.includes("supabase");
      console.log("Has Supabase Cookie:", hasSupabaseCookie);
    }

    // Check authentication
    console.log("\n--- Checking Auth ---");
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log("Auth result:", {
      userId: user?.id,
      email: user?.email,
      hasUser: !!user,
      error: authError?.message || "none",
    });

    // Build response
    if (!user || authError) {
      console.log("\n--- Response: NOT AUTHENTICATED ---");
      const response = {
        authenticated: false,
        userId: null,
        user: null,
        sessionId: null,
        debug: {
          timestamp,
          error: authError?.message || "No user found",
        },
      };
      console.log("Response payload:", JSON.stringify(response, null, 2));
      return NextResponse.json(response, { status: 200 });
    }

    console.log("\n--- Response: AUTHENTICATED ---");
    const response = {
      authenticated: true,
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: user.email_confirmed_at ? true : false,
        metadata: user.user_metadata,
        createdAt: user.created_at,
      },
      debug: {
        timestamp,
      },
    };
    console.log("Response payload:", JSON.stringify(response, null, 2));
    console.log("===================\n");
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("\n=== SESSION API ERROR ===");
    console.error(`[${timestamp}] Error checking session:`, error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    console.error("===================\n");
    
    return NextResponse.json(
      {
        authenticated: false,
        error: "Failed to check session",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        debug: {
          timestamp,
        },
      },
      { status: 500 }
    );
  }
}
