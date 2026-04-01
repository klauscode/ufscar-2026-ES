'use client'

import { useState } from 'react'

export default function AdminNews({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState({ title: '', body: '', pinned: false })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/news', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (res.ok) { setForm({ title: '', body: '', pinned: false }); window.location.reload() }
    setLoading(false)
  }

  async function togglePin(item: any) {
    await fetch('/api/admin/news', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id, pinned: !item.pinned }) })
    setItems(prev => prev.map(n => n.id === item.id ? { ...n, pinned: !n.pinned } : n))
  }

  async function remove(id: string) {
    await fetch('/api/admin/news', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setItems(prev => prev.filter(n => n.id !== id))
  }

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Publicar aviso</h2>
        <div>
          <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-2)' }}>Título</label>
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Aula cancelada na quinta"
            className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
        </div>
        <div>
          <label className="text-xs mb-1 block font-medium" style={{ color: 'var(--text-2)' }}>Mensagem</label>
          <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })}
            placeholder="Escreva o aviso aqui..."
            rows={3} className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none" style={inputStyle} required />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="rounded" />
          <span className="text-sm" style={{ color: 'var(--text-2)' }}>Fixar no topo</span>
        </label>
        <button type="submit" disabled={loading}
          className="py-2 px-5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          {loading ? 'Publicando...' : 'Publicar aviso'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Avisos publicados</h2>
        {items.length === 0 ? <p className="text-sm" style={{ color: 'var(--text-3)' }}>Nenhum aviso.</p> : (
          <ul className="space-y-2">
            {items.map(n => (
              <li key={n.id} className="rounded-xl border px-4 py-3" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{n.title}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-3)' }}>{n.body}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => togglePin(n)}
                      className="text-xs px-2 py-1 rounded-full font-medium transition-all"
                      style={{ background: n.pinned ? 'rgba(245,158,11,0.15)' : 'var(--surface-2)', color: n.pinned ? '#d97706' : 'var(--text-3)' }}>
                      {n.pinned ? 'Fixado' : 'Fixar'}
                    </button>
                    <button onClick={() => remove(n.id)} className="text-xs font-medium transition-all" style={{ color: 'var(--text-3)' }}
                      onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
                      onMouseOut={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
