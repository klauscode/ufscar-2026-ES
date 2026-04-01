import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== process.env.CLASS_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('class_access', 'granted', {
    httpOnly: true,
    sameSite: 'lax',
    // Cookie lasts 30 days — coursemates don't retype every visit
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
  return res
}
