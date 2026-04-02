'use client'

import { useState } from 'react'
import type { FileItem } from '@/lib/types'

type Props = {
  initial: FileItem[]
  subjects: string[]
}

type FormState = {
  subject: string
  title: string
  url: string
  file_date: string
}

export default function AdminFiles({ initial, subjects }: Props) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState<FormState>({
    subject: subjects[0] ?? '',
    title: '',
    url: '',
    file_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function add(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/files', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel salvar o arquivo.')
      setLoading(false)
      return
    }

    setItems((current) =>
      [...current, body.item as FileItem].sort(
        (left, right) => new Date(right.file_date).getTime() - new Date(left.file_date).getTime()
      )
    )
    setForm({ subject: subjects[0] ?? '', title: '', url: '', file_date: '' })
    setLoading(false)
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/files', {
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
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Adicionar arquivo</h2>
          <p className="text-sm text-[var(--text-3)]">Links de Drive, Slides, Docs ou qualquer material util.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Materia</label>
            <select value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} className="input" required>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Titulo</label>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="input" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">URL</label>
            <input type="url" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} className="input" required />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Data</label>
            <input type="date" value={form.file_date} onChange={(event) => setForm({ ...form, file_date: event.target.value })} className="input" required />
          </div>
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading || subjects.length === 0} className="button-primary px-5 py-3 text-sm disabled:opacity-60">
          {loading ? 'Salvando...' : 'Adicionar arquivo'}
        </button>
      </form>

      <section className="panel px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Arquivos cadastrados</h2>
          <p className="text-sm text-[var(--text-3)]">Arquivos mais recentes aparecem primeiro.</p>
        </div>
        <div className="mt-4 space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--accent)]">{item.subject}</p>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-2 block text-sm text-[var(--text-2)] underline decoration-[var(--border-strong)] underline-offset-4">
                      {item.url}
                    </a>
                    <p className="mt-2 text-sm text-[var(--text-3)]">
                      {new Date(`${item.file_date}T12:00:00`).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-sm font-semibold text-[var(--danger)]">
                    Remover
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nenhum arquivo cadastrado.</p>
          )}
        </div>
      </section>
    </div>
  )
}
