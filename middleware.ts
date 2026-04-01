import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/enter', '/api/enter', '/admin/login', '/api/admin/login', '/favicon.ico', '/_next']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow public paths through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Admin route: must have a valid admin session cookie set by /api/admin/login
  if (pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get('admin_session')
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // All other routes: must have the class password cookie
  const classAccess = req.cookies.get('class_access')
  if (!classAccess || classAccess.value !== 'granted') {
    return NextResponse.redirect(new URL('/enter', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
