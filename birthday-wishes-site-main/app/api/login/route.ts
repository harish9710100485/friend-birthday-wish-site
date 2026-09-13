import { NextRequest, NextResponse } from 'next/server'
import { createSessionCookie } from '../../../lib/auth'

export const runtime = 'edge'

export async function POST(req: NextRequest){
  const expectedPassword = process.env.SITE_PASSWORD
  const secret = process.env.SESSION_SECRET
  if (!expectedPassword || !secret) {
    return NextResponse.json({ ok: false, error: 'Server not configured' }, { status: 500 })
  }

  const { password } = await req.json().catch(() => ({ password: '' }))
  if (typeof password !== 'string' || password.trim().toLowerCase() !== expectedPassword.trim().toLowerCase()) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const cookie = await createSessionCookie(secret)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(cookie.name, cookie.value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: cookie.maxAge,
  })
  return res
}
