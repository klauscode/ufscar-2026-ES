'use client'

import { useState } from 'react'

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export default function AdminSchedule({ initial }: { initial: any[] }) {
  const [slots, setSlots] = useState(initial)
  const [form, setForm] = useState({ day_of_week: 0, start_time: '', end_time: '', subject: '', room: '', professor: '' })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/schedule', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setForm({ day_of_week: 0, start_time: '', end_time: '', subject: '', room: '', professor: '' }); window.location.reload() }
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch('/api/admin/schedule', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setSlots(prev => prev.filter(s => s.id !== id))
  }

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }
  const labelStyle = { color: 'var(--text-2)' }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Adicionar aula</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Dia</label>
            <select value={form.day_of_week} onChange={e => setForm({ ...form, day_of_week: Number(e.target.value) })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle}>
              {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Matéria</label>
            <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
              placeholder="Ex: Ética e Educação Especial"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Início</label>
            <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Fim</label>
            <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Sala</label>
            <input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })}
              placeholder="Ex: AT2 Sala 31"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Professor(a)</label>
            <input value={form.professor} onChange={e => setForm({ ...form, professor: e.target.value })}
              placeholder="Ex: Profa. Rosimeire Orlando"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} />
          </div>
        </div>
        <button type="submit" disabled={loading}
          className="py-2 px-5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          {loading ? 'Salvando...' : 'Adicionar aula'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Aulas cadastradas</h2>
        {slots.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-3)' }}>Nenhuma aula.</p> : (
          <ul className="space-y-2">
            {slots.map(s => (
              <li key={s.id} className="rounded-xl border px-4 py-3 flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{s.subject} — {DAYS[s.day_of_week]}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                    {s.start_time?.slice(0,5)}–{s.end_time?.slice(0,5)}{s.room ? ` · ${s.room}` : ''}{s.professor ? ` · ${s.professor}` : ''}
                  </p>
                </div>
                <button onClick={() => remove(s.id)} className="text-xs ml-4 font-medium transition-all" style={{ color: 'var(--text-3)' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--text-3)')}>
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
