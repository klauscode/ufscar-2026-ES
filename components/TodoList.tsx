'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Todo = { id: string; text: string; done: boolean }

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  async function toggle(todo: Todo) {
    const { data } = await supabase
      .from('todos').update({ done: !todo.done }).eq('id', todo.id).select().single()
    if (data) setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)))
  }

  const done = todos.filter((t) => t.done)
  const pending = todos.filter((t) => !t.done)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {pending.length === 0 && done.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhum item na lista.</p>
        )}
        {pending.map((todo) => (
          <button
            key={todo.id}
            onClick={() => toggle(todo)}
            className="w-full bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-4 text-left hover:border-indigo-200 transition group"
          >
            <span className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-400 flex items-center justify-center shrink-0 transition" />
            <span className="text-gray-800 text-sm font-medium">{todo.text}</span>
          </button>
        ))}
      </div>

      {done.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Concluídos</p>
          <div className="space-y-2">
            {done.map((todo) => (
              <button
                key={todo.id}
                onClick={() => toggle(todo)}
                className="w-full bg-white rounded-xl border border-gray-100 px-5 py-4 flex items-center gap-4 text-left opacity-50 hover:opacity-70 transition"
              >
                <span className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                <span className="text-sm text-gray-500 line-through">{todo.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
