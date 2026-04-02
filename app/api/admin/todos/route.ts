import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/admin-auth'
import {
  requireObject,
  requireString,
  requireUuid,
} from '@/lib/validators'

function parseTodoPayload(payload: unknown) {
  const body = requireObject(payload)

  return {
    text: requireString(body.text, 'text'),
    done: false,
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const values = parseTodoPayload(await req.json())
    const { data, error } = await createAdminClient()
      .from('todos')
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
      .from('todos')
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
