import { NextResponse, type NextRequest } from 'next/server'
import { AUTH_COOKIE, isValidToken } from '@/lib/auth'

const PUBLIC_PATHS = ['/unlock', '/api/unlock']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value
  if (await isValidToken(token)) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = '/unlock'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
