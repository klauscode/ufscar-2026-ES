import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

function getAdmin() {
  return createAdminClient()
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = getAdmin()
  const { error } = await supabase.from('schedule').insert(body)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const supabase = getAdmin()
  const { error } = await supabase.from('schedule').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
