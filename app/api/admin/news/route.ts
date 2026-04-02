import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/admin-auth'
import {
  requireBoolean,
  requireObject,
  requireString,
  requireUuid,
} from '@/lib/validators'

function parseNewsPayload(payload: unknown) {
  const body = requireObject(payload)

  return {
    title: requireString(body.title, 'title'),
    body: requireString(body.body, 'body'),
    pinned: requireBoolean(body.pinned, 'pinned'),
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const values = parseNewsPayload(await req.json())
    const { data, error } = await createAdminClient()
      .from('news')
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

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const body = requireObject(await req.json())
    const id = requireUuid(body.id, 'id')
    const pinned = requireBoolean(body.pinned, 'pinned')
    const { data, error } = await createAdminClient()
      .from('news')
      .update({ pinned })
      .eq('id', id)
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
      .from('news')
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
