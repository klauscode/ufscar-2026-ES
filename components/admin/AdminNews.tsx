'use client'

import { useState } from 'react'
import type { NewsItem } from '@/lib/types'

type Props = {
  initial: NewsItem[]
}

type FormState = {
  title: string
  body: string
  pinned: boolean
}

export default function AdminNews({ initial }: Props) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState<FormState>({ title: '', body: '', pinned: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function add(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel publicar o aviso.')
      setLoading(false)
      return
    }

    setItems((current) => [body.item as NewsItem, ...current])
    setForm({ title: '', body: '', pinned: false })
    setLoading(false)
  }

  async function togglePin(item: NewsItem) {
    const response = await fetch('/api/admin/news', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, pinned: !item.pinned }),
    })

    const body = await response.json().catch(() => ({}))
    if (response.ok) {
      setItems((current) => current.map((entry) => (entry.id === item.id ? (body.item as NewsItem) : entry)))
    }
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
      <form onSubmit={add} className="panel space-y-4 px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Publicar aviso</h2>
          <p className="text-sm text-[var(--text-3)]">Use avisos fixados para o que realmente precisa destaque.</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Titulo</label>
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="input" required />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Mensagem</label>
          <textarea value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="input min-h-32 resize-y" required />
        </div>

        <label className="flex items-center gap-3 text-sm text-[var(--text-2)]">
          <input type="checkbox" checked={form.pinned} onChange={(event) => setForm({ ...form, pinned: event.target.checked })} />
          Fixar no topo
        </label>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading} className="button-primary px-5 py-3 text-sm disabled:opacity-60">
          {loading ? 'Publicando...' : 'Publicar aviso'}
        </button>
      </form>

      <section className="panel px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Avisos publicados</h2>
          <p className="text-sm text-[var(--text-3)]">Revise o que esta visivel para a turma.</p>
        </div>
        <div className="mt-4 space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                      {item.pinned && (
                        <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ background: 'rgba(169,77,30,0.14)', color: 'var(--warn)' }}>
                          Fixado
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-2)]">{item.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button onClick={() => togglePin(item)} className="text-sm font-semibold text-[var(--accent)]">
                      {item.pinned ? 'Desfixar' : 'Fixar'}
                    </button>
                    <button onClick={() => remove(item.id)} className="text-sm font-semibold text-[var(--danger)]">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nenhum aviso publicado.</p>
          )}
        </div>
      </section>
    </div>
  )
}
