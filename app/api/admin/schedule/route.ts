import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminRequest } from '@/lib/admin-auth'
import {
  optionalString,
  requireDayOfWeek,
  requireObject,
  requireTime,
  requireUuid,
  requireString,
} from '@/lib/validators'

function parseSchedulePayload(payload: unknown) {
  const body = requireObject(payload)

  return {
    day_of_week: requireDayOfWeek(body.day_of_week),
    start_time: requireTime(body.start_time, 'start_time'),
    end_time: requireTime(body.end_time, 'end_time'),
    subject: requireString(body.subject, 'subject'),
    room: optionalString(body.room),
    professor: optionalString(body.professor),
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminRequest(req)
  if (auth instanceof NextResponse) return auth

  try {
    const values = parseSchedulePayload(await req.json())
    const { data, error } = await createAdminClient()
      .from('schedule')
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
      .from('schedule')
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
