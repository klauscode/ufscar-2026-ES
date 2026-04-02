'use client'

import { useState } from 'react'
import type { TodoItem } from '@/lib/types'

type Props = {
  initial: TodoItem[]
}

export default function AdminTodos({ initial }: Props) {
  const [items, setItems] = useState(initial)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function add(event: React.FormEvent) {
    event.preventDefault()
    if (!text.trim()) return

    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim() }),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      setError(body.error || 'Nao foi possivel adicionar o item.')
      setLoading(false)
      return
    }

    setItems((current) => [...current, body.item as TodoItem])
    setText('')
    setLoading(false)
  }

  async function remove(id: string) {
    const response = await fetch('/api/admin/todos', {
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
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Adicionar item</h2>
          <p className="text-sm text-[var(--text-3)]">Use a checklist para pendencias coletivas da turma.</p>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-3)]">Texto</label>
          <input value={text} onChange={(event) => setText(event.target.value)} className="input" placeholder="Ex: confirmar sala da aula de quinta" required />
        </div>

        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}

        <button type="submit" disabled={loading} className="button-primary px-5 py-3 text-sm disabled:opacity-60">
          {loading ? 'Salvando...' : 'Adicionar item'}
        </button>
      </form>

      <section className="panel px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Itens atuais</h2>
          <p className="text-sm text-[var(--text-3)]">Eles aparecem para a turma no checklist compartilhado.</p>
        </div>
        <div className="mt-4 space-y-3">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text)]">{item.text}</p>
                    <p className="mt-1 text-sm text-[var(--text-3)]">{item.done ? 'Concluido' : 'Pendente'}</p>
                  </div>
                  <button onClick={() => remove(item.id)} className="text-sm font-semibold text-[var(--danger)]">
                    Remover
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nenhum item cadastrado.</p>
          )}
        </div>
      </section>
    </div>
  )
}
