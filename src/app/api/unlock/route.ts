import { NextResponse } from 'next/server'
import { AUTH_COOKIE, expectedToken, safeEqual } from '@/lib/auth'

const THIRTY_DAYS = 60 * 60 * 24 * 30

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  // Lock: clear the cookie.
  if (body?.lock === true) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set(AUTH_COOKIE, '', { path: '/', maxAge: 0 })
    return res
  }

  const password = typeof body?.password === 'string' ? body.password : ''
  const expected = process.env.PREP_PASSWORD ?? ''

  if (!expected || !safeEqual(password, expected)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(AUTH_COOKIE, await expectedToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: THIRTY_DAYS,
  })
  return res
}
