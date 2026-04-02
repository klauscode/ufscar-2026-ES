'use client'

import { useMemo, useState } from 'react'
import MarkdownPreview from '@/components/MarkdownPreview'
import type { HomeworkItem } from '@/lib/types'

type Props = {
  initial: HomeworkItem[]
  subjects: string[]
}

type FormState = {
  subject: string
  title: string
  description: string
  deadline: string
}

const emptyForm = (subject = ''): FormState => ({
  subject,
  title: '',
  description: '',
  deadline: '',
})

function toInputDateTime(value: string) {
  const date = new Date(value)
  const timezoneOffset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function sortHomework(items: HomeworkItem[]) {
  return [...items].sort(
    (left, right) => new Date(left.deadline).getTime() - new Date(right.deadline).getTime()
  )
}

export default function AdminHomework({ initial, subjects }: Props) {
  const defaultSubject = subjects[0] ?? ''
  const [items, setItems] = useState(sortHomework(initial))
  const [form, setForm] = useState<FormState>(emptyForm(defaultSubject))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)

  const submitLabel = editingId ? 'Salvar alteracoes' : 'Adicionar tarefa'
  const previewContent = form.description.trim()

  const selectedEditingItem = useMemo(
    () => items.find((item) => item.id === editingId) ?? null,
    [items, editingId]
  )

  async function save(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const method = editingId ? 'PATCH' : 'POST'
    const payload = editingId ? { id: editingId, ...form } : form

    const response = await fetch('/api/admin/homework', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel salvar a tarefa.')
      setLoading(false)
      return
    }

    const saved = body.item as HomeworkItem

    setItems((current) =>
      sortHomework(
        editingId
          ? current.map((item) => (item.id === saved.id ? saved : item))
          : [...current, saved]
      )
    )
    setForm(emptyForm(defaultSubject))
    setEditingId(null)
    setLoading(false)
  }

  function startEdit(item: HomeworkItem) {
    setEditingId(item.id)
    setError('')
    setForm({
      subject: item.subject,
      title: item.title,
      description: item.description ?? '',
      deadline: toInputDateTime(item.deadline),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setError('')
    setForm(emptyForm(defaultSubject))
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/homework', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id))
      if (editingId === id) {
        cancelEdit()
      }
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1.12fr]">
      <form onSubmit={save} className="panel space-y-4 px-6 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">
              {editingId ? 'Editar tarefa' : 'Adicionar tarefa'}
            </h2>
            <p className="text-sm text-[var(--text-3)]">
              A descricao aceita markdown simples: `#`, `-`, `1.`, `**negrito**`, `*italico*`, `` `codigo` `` e links.
            </p>
          </div>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="button-secondary px-4 py-2 text-sm">
              Cancelar
            </button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Materia</label>
            <select
              value={form.subject}
              onChange={(event) => setForm({ ...form, subject: event.target.value })}
              className="input"
              required
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
              {subjects.length === 0 && <option value="">Cadastre a grade primeiro</option>}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Titulo</label>
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="input" required />
          </div>
          <div className="md:col-span-2">
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Descricao em markdown</label>
              <button type="button" onClick={() => setPreviewOpen((value) => !value)} className="text-sm font-semibold text-[var(--accent)]">
                {previewOpen ? 'Ocultar preview' : 'Mostrar preview'}
              </button>
            </div>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="input min-h-36 resize-y font-mono text-sm"
              placeholder={'# Exemplo\n- item 1\n- item 2\n\n**Importante**: levar leitura pronta.'}
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Prazo</label>
            <input type="datetime-local" value={form.deadline} onChange={(event) => setForm({ ...form, deadline: event.target.value })} className="input" required />
          </div>
        </div>

        {previewOpen && (
          <div className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Preview</p>
            <MarkdownPreview content={previewContent} className="markdown-body text-sm leading-7 text-[var(--text-2)]" />
          </div>
        )}

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading || subjects.length === 0} className="button-primary px-5 py-3 text-sm disabled:opacity-60">
          {loading ? 'Salvando...' : submitLabel}
        </button>
      </form>

      <section className="panel px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Tarefas cadastradas</h2>
          <p className="text-sm text-[var(--text-3)]">
            Clique em editar para ajustar o conteudo. {selectedEditingItem ? `Editando agora: ${selectedEditingItem.title}.` : 'A lista ja esta ordenada por prazo.'}
          </p>
        </div>
        <div className="mt-4 space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                    <p className="mt-1 text-sm text-[var(--accent)]">{item.subject}</p>
                    {item.description && (
                      <p className="mt-2 text-sm text-[var(--text-2)]">
                        {item.description.slice(0, 140)}
                        {item.description.length > 140 ? '…' : ''}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-[var(--text-3)]">
                      {new Date(item.deadline).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <button onClick={() => startEdit(item)} className="text-sm font-semibold text-[var(--accent)]">
                      Editar
                    </button>
                    <button onClick={() => remove(item.id)} className="text-sm font-semibold text-[var(--danger)]">
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nenhuma tarefa cadastrada.</p>
          )}
        </div>
      </section>
    </div>
  )
}
