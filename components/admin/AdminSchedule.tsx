'use client'

import { useState } from 'react'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function AdminSchedule({ initial }: { initial: any[] }) {
  const [slots, setSlots] = useState(initial)
  const [form, setForm] = useState({
    day_of_week: 0,
    start_time: '',
    end_time: '',
    subject: '',
    room: '',
    professor: '',
  })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ day_of_week: 0, start_time: '', end_time: '', subject: '', room: '', professor: '' })
      window.location.reload()
    }
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch('/api/admin/schedule', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Adicionar aula</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Dia</label>
            <select
              value={form.day_of_week}
              onChange={(e) => setForm({ ...form, day_of_week: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Matéria</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Ex: Cálculo II"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Início</label>
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Fim</label>
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Sala (opcional)</label>
            <input
              value={form.room}
              onChange={(e) => setForm({ ...form, room: e.target.value })}
              placeholder="Ex: B-204"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Professor (opcional)</label>
            <input
              value={form.professor}
              onChange={(e) => setForm({ ...form, professor: e.target.value })}
              placeholder="Ex: Dr. Silva"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? 'Salvando...' : 'Adicionar aula'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Aulas cadastradas</h2>
        {slots.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma aula cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {slots.map((s) => (
              <li key={s.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{s.subject} — {DAYS[s.day_of_week]}</p>
                  <p className="text-sm text-gray-500">
                    {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                    {s.room ? ` · ${s.room}` : ''}
                    {s.professor ? ` · ${s.professor}` : ''}
                  </p>
                </div>
                <button
                  onClick={() => remove(s.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
