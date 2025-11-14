import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ARTIST = ['/profile/artist', '/profile/edit/artist']
const VENUE = ['/profile/venue', '/profile/edit/venue']

export function middleware(req: NextRequest) {
  const role = req.cookies.get('user_role')?.value
  const path = req.nextUrl.pathname

  if (!role) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (ARTIST.some(p => path.startsWith(p))) {
    if (role !== 'singer' && role !== 'producer') {
      return NextResponse.redirect(new URL('/not-authorized', req.url))
    }
  }

  if (VENUE.some(p => path.startsWith(p))) {
    if (role !== 'venue') {
      return NextResponse.redirect(new URL('/not-authorized', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile/:path*']
}
