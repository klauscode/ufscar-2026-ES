import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    console.error('Supabase login error:', error?.message)
    return NextResponse.json({ error: error?.message ?? 'Credenciais inválidas.' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  // Store the Supabase access token in a secure http-only cookie
  res.cookies.set('admin_session', data.session.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
  return res
}
