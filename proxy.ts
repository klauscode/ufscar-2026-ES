import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/enter', '/api/enter', '/admin/login', '/api/admin/login', '/favicon.ico', '/_next']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const adminSession = req.cookies.get('admin_session')
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/admin/')) {
    const adminSession = req.cookies.get('admin_session')
    if (!adminSession) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
    }
    return NextResponse.next()
  }

  const classAccess = req.cookies.get('class_access')
  if (!classAccess || classAccess.value !== 'granted') {
    return NextResponse.redirect(new URL('/enter', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
