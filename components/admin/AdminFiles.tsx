'use client'

import { useState } from 'react'

type Props = { initial: any[]; subjects: string[] }

export default function AdminFiles({ initial, subjects }: Props) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState({ subject: subjects[0] ?? '', title: '', url: '', file_date: '' })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setForm({ subject: subjects[0] ?? '', title: '', url: '', file_date: '' }); window.location.reload() }
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch('/api/admin/files', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }
  const labelStyle = { color: 'var(--text-2)' }

  // Group existing files by subject for display
  const bySubject: Record<string, any[]> = {}
  for (const item of items) {
    if (!bySubject[item.subject]) bySubject[item.subject] = []
    bySubject[item.subject].push(item)
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold" style={{ color: 'var(--text)' }}>Adicionar arquivo</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Matéria</label>
            <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Nome do arquivo</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Slides Aula 3 — Ética"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
          </div>
          <div className="col-span-2">
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Link (Google Drive, Slides, etc.)</label>
            <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
              placeholder="https://drive.google.com/..."
              type="url"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
          </div>
          <div>
            <label className="text-xs mb-1 block font-medium" style={labelStyle}>Data da aula</label>
            <input type="date" value={form.file_date} onChange={e => setForm({ ...form, file_date: e.target.value })}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none" style={inputStyle} required />
          </div>
        </div>
        <button type="submit" disabled={loading || subjects.length === 0}
          className="py-2 px-5 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
          {loading ? 'Salvando...' : 'Adicionar arquivo'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold mb-3" style={{ color: 'var(--text)' }}>Arquivos cadastrados</h2>
        {items.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--text-3)' }}>Nenhum arquivo cadastrado.</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(bySubject).map(([subject, files]) => (
              <div key={subject}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-3)' }}>{subject}</p>
                <ul className="space-y-2">
                  {files.map(f => (
                    <li key={f.id} className="rounded-xl border px-4 py-3 flex justify-between items-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{f.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                          {new Date(f.file_date + 'T12:00:00').toLocaleDateString('pt-BR')} · <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>Ver link</a>
                        </p>
                      </div>
                      <button onClick={() => remove(f.id)} className="text-xs ml-4 font-medium transition-all" style={{ color: 'var(--text-3)' }}
                        onMouseOver={e => (e.currentTarget.style.color = '#ef4444')}
                        onMouseOut={e => (e.currentTarget.style.color = 'var(--text-3)')}>
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
