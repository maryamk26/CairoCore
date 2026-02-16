import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (!user || error) {
      return NextResponse.json({
        authenticated: false,
        userId: null,
        user: null,
        sessionId: null,
        error: error?.message || "No user found",
      });
    }

    return NextResponse.json({
      authenticated: true,
      userId: user.id,
      user: {
        id: user.id,
        email: user.email,
        emailVerified: !!user.email_confirmed_at,
        metadata: user.user_metadata,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      error: "Failed to check session",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
