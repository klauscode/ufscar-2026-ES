import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/admin-auth'
import {
  requireDateOnly,
  requireObject,
  requireString,
  requireUuid,
} from '@/lib/validators'

function parseFilesPayload(payload: unknown) {
  const body = requireObject(payload)

  return {
    subject: requireString(body.subject, 'subject'),
    title: requireString(body.title, 'title'),
    url: requireString(body.url, 'url'),
    file_date: requireDateOnly(body.file_date, 'file_date'),
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const values = parseFilesPayload(await req.json())
    const { data, error } = await createAdminClient()
      .from('files')
      .insert(values)
      .select('*')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ item: data })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const body = requireObject(await req.json())
    const id = requireUuid(body.id, 'id')
    const { data, error } = await createAdminClient()
      .from('files')
      .delete()
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ item: data })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
