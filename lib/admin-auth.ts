import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

function createAuthClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function validateAdminToken(token: string | undefined) {
  if (!token) return null

  const supabase = createAuthClient()
  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    return null
  }

  return data.user
}

export async function requireAdminPage() {
  const cookieStore = await cookies()
  const user = await validateAdminToken(cookieStore.get('admin_session')?.value)

  if (!user) {
    redirect('/admin/login')
  }

  return user
}

export async function requireAdminRequest(req: NextRequest) {
  const user = await validateAdminToken(req.cookies.get('admin_session')?.value)

  if (!user) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 401 })
  }

  return user
}
