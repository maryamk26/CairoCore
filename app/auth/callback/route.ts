import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get('code');
    const nextPath = searchParams.get('next') ?? '/';

    if (!code) {
      console.error("No code provided in callback");
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error exchanging code for session:", error.message);
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    // Determine redirect URL
    const forwardedHost = request.headers.get('x-forwarded-host');
    const isDev = process.env.NODE_ENV === 'development';
    const redirectUrl = isDev
      ? `${origin}${nextPath}`
      : forwardedHost
      ? `https://${forwardedHost}${nextPath}`
      : `${origin}${nextPath}`;

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error("Unexpected error in auth callback:", err);
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }
}



