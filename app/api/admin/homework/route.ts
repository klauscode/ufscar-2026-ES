import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/admin-auth'
import {
  optionalString,
  requireDateTime,
  requireObject,
  requireString,
  requireUuid,
} from '@/lib/validators'

function parseHomeworkPayload(payload: unknown) {
  const body = requireObject(payload)

  return {
    subject: requireString(body.subject, 'subject'),
    title: requireString(body.title, 'title'),
    description: optionalString(body.description),
    deadline: requireDateTime(body.deadline, 'deadline'),
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const values = parseHomeworkPayload(await req.json())
    const { data, error } = await createAdminClient()
      .from('homework')
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
    const values = parseHomeworkPayload(body)
    const { data, error } = await createAdminClient()
      .from('homework')
      .update(values)
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
      .from('homework')
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
