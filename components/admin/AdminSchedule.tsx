'use client'

import { useState } from 'react'
import type { ScheduleItem } from '@/lib/types'

const DAYS = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']

type FormState = {
  day_of_week: number
  start_time: string
  end_time: string
  subject: string
  room: string
  professor: string
}

type Props = {
  initial: ScheduleItem[]
}

const emptyForm: FormState = {
  day_of_week: 0,
  start_time: '',
  end_time: '',
  subject: '',
  room: '',
  professor: '',
}

export default function AdminSchedule({ initial }: Props) {
  const [slots, setSlots] = useState(initial)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function add(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel salvar a aula.')
      setLoading(false)
      return
    }

    setSlots((current) =>
      [...current, body.item as ScheduleItem].sort((left, right) =>
        left.day_of_week === right.day_of_week
          ? left.start_time.localeCompare(right.start_time)
          : left.day_of_week - right.day_of_week
      )
    )
    setForm(emptyForm)
    setLoading(false)
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/schedule', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      setSlots((current) => current.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={add} className="panel space-y-4 px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Adicionar aula</h2>
          <p className="text-sm text-[var(--text-3)]">Cadastre o horario base da semana.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Dia</label>
            <select
              value={form.day_of_week}
              onChange={(event) => setForm({ ...form, day_of_week: Number(event.target.value) })}
              className="input"
            >
              {DAYS.map((day, index) => (
                <option key={day} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Materia</label>
            <input value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="input" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Inicio</label>
            <input type="time" value={form.start_time} onChange={(event) => setForm({ ...form, start_time: event.target.value })} className="input" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Fim</label>
            <input type="time" value={form.end_time} onChange={(event) => setForm({ ...form, end_time: event.target.value })} className="input" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Sala</label>
            <input value={form.room} onChange={(event) => setForm({ ...form, room: event.target.value })} className="input" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Professor</label>
            <input value={form.professor} onChange={(event) => setForm({ ...form, professor: event.target.value })} className="input" />
          </div>
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading} className="button-primary px-5 py-3 text-sm disabled:opacity-60">
          {loading ? 'Salvando...' : 'Adicionar aula'}
        </button>
      </form>

      <section className="panel px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Aulas cadastradas</h2>
          <p className="text-sm text-[var(--text-3)]">Use esta lista para revisar a grade.</p>
        </div>
        <div className="mt-4 space-y-3">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <div key={slot.id} className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{slot.subject}</p>
                    <p className="mt-1 text-sm text-[var(--text-2)]">
                      {DAYS[slot.day_of_week]} · {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                    </p>
                    <p className="mt-1 text-sm text-[var(--text-3)]">
                      {[slot.room, slot.professor].filter(Boolean).join(' · ') || 'Sem detalhes extras'}
                    </p>
                  </div>
                  <button onClick={() => remove(slot.id)} className="text-sm font-semibold text-[var(--danger)]">
                    Remover
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nenhuma aula cadastrada.</p>
          )}
        </div>
      </section>
    </div>
  )
}
