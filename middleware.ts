import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/about',
  '/search',
  '/places',
  '/api/webhooks',
  '/api/auth/session',
  '/auth/callback',
  '/test-auth',
  '/debug-auth',
  '/test-clerk-config',
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      // Handle wildcard routes
      const baseRoute = route.replace('(.*)', '')
      return pathname.startsWith(baseRoute)
    }
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

export async function middleware(request: NextRequest) {
  const timestamp = new Date().toISOString()
  const url = request.url
  const pathname = new URL(url).pathname
  const isPublic = isPublicRoute(pathname)

  console.log('\n=== MIDDLEWARE REQUEST ===')
  console.log(`[${timestamp}] ${request.method} ${pathname}`)
  console.log('Is Public Route:', isPublic)
  console.log('Full URL:', url)

  // Update the session (refresh tokens, etc.)
  const response = await updateSession(request)

  if (!isPublic) {
    console.log('Protected route - checking authentication...')
    
    // For protected routes, check if user is authenticated
    const supabaseResponse = response.headers.get('x-user-id')
    
    if (!supabaseResponse) {
      console.log('⚠️  No user found - redirecting to sign-in')
      const redirectUrl = new URL('/sign-in', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    
    console.log('✅ User authenticated, allowing access')
  } else {
    console.log('Public route - skipping auth check')
  }

  console.log('===================\n')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
