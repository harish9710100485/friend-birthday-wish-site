import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, verifySessionCookie } from './lib/auth'

export async function middleware(req: NextRequest){
  const secret = process.env.SESSION_SECRET
  if (!secret) return NextResponse.next()

  const cookie = req.cookies.get(COOKIE_NAME)?.value
  if (await verifySessionCookie(cookie, secret)) return NextResponse.next()

  const loginUrl = new URL('/login', req.url)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!login|api/login|_next/static|_next/image|favicon.ico).*)'],
}
