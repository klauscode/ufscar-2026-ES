'use client'

import { useState } from 'react'

type Props = { initial: any[]; subjects: string[] }

export default function AdminHomework({ initial, subjects }: Props) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState({ subject: subjects[0] ?? '', title: '', description: '', deadline: '' })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/homework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setForm({ subject: subjects[0] ?? '', title: '', description: '', deadline: '' }); window.location.reload() }
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch('/api/admin/homework', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }
  const labelStyle = { color: 'var(--text-2)' }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Adicionar tarefa</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Matéria</label>
            <select
              value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
              required
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              {subjects.length === 0 && <option value="">Adicione matérias na grade primeiro</option>}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Título</label>
            <input
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Lista de exercícios 3"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
              required
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Descrição (opcional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Detalhes sobre a tarefa..."
              rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Prazo</label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={e => setForm({ ...form, deadline: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || subjects.length === 0}
          className="py-2 px-5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
        >
          {loading ? 'Salvando...' : 'Adicionar tarefa'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Tarefas cadastradas</h2>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Nenhuma tarefa cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {items.map(hw => (
              <li key={hw.id} className="rounded-xl border px-4 py-3 flex justify-between items-start" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{hw.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>{hw.subject}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>Prazo: {new Date(hw.deadline).toLocaleString('pt-BR')}</p>
                </div>
                <button onClick={() => remove(hw.id)} className="text-xs ml-4 shrink-0 transition-all font-medium" style={{ color: 'var(--text-3)' }}
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
