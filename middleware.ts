import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest, NextResponse } from 'next/server'

// no auth required
const publicRoutes = [
  '/',
  '/sign-in',
  '/sign-up',
  '/auth',
  '/about',
  '/search',
  '/places',
  '/api/webhooks',
  '/api/auth/session',
  '/auth/callback',
]

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route.endsWith('(.*)')) {
      const baseRoute = route.replace('(.*)', '')
      return pathname.startsWith(baseRoute)
    }
    return pathname === route || pathname.startsWith(`${route}/`)
  })
}

export async function middleware(request: NextRequest) {
  const pathname = new URL(request.url).pathname
  const isPublic = isPublicRoute(pathname)
  const response = await updateSession(request)

  if (!isPublic) {
    const userId = response.headers.get('x-user-id')
    if (!userId) {
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
