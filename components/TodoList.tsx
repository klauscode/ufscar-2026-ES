'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { TodoItem } from '@/lib/types'

type Props = {
  initialTodos: TodoItem[]
}

export default function TodoList({ initialTodos }: Props) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)

  async function toggle(todo: TodoItem) {
    const { data } = await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', todo.id)
      .select('*')
      .single()

    if (data) {
      setTodos((current) => current.map((item) => (item.id === data.id ? (data as TodoItem) : item)))
    }
  }

  const pending = todos.filter((todo) => !todo.done)
  const completed = todos.filter((todo) => todo.done)

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
      <section className="panel px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">Pendentes</h2>
            <p className="text-sm text-[var(--text-3)]">{pending.length} item(ns) em aberto</p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {pending.length > 0 ? (
            pending.map((todo) => (
              <button
                key={todo.id}
                onClick={() => toggle(todo)}
                className="flex w-full items-center gap-3 rounded-[1rem] border px-4 py-4 text-left"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}
              >
                <span className="inline-flex h-5 w-5 shrink-0 rounded-full border-2" style={{ borderColor: 'var(--accent)' }} />
                <span className="text-sm font-medium text-[var(--text)]">{todo.text}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nenhum item pendente.</p>
          )}
        </div>
      </section>

      <section className="panel px-6 py-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--text)]">Concluidos</h2>
          <p className="text-sm text-[var(--text-3)]">Marque novamente se algo voltar a ser pendente.</p>
        </div>
        <div className="mt-4 space-y-3">
          {completed.length > 0 ? (
            completed.map((todo) => (
              <button
                key={todo.id}
                onClick={() => toggle(todo)}
                className="flex w-full items-center gap-3 rounded-[1rem] border px-4 py-4 text-left opacity-70"
                style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}
              >
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: 'var(--accent)' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-[var(--text-3)] line-through">{todo.text}</span>
              </button>
            ))
          ) : (
            <p className="text-sm text-[var(--text-3)]">Nada concluido ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}
