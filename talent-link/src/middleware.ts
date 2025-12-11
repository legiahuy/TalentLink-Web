import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SETTINGS_PATHS = ['/settings/my-profile']

export function middleware(req: NextRequest) {
  const role = req.cookies.get('user_role')?.value
  const path = req.nextUrl.pathname

  if (SETTINGS_PATHS.some((p) => path.startsWith(p))) {
    if (!role) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/settings/my-profile'],
}
