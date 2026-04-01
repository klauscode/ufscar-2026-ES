'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Todo = { id: string; text: string; done: boolean }

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)

  async function toggle(todo: Todo) {
    const { data } = await supabase
      .from('todos')
      .update({ done: !todo.done })
      .eq('id', todo.id)
      .select()
      .single()
    if (data) setTodos((prev) => prev.map((t) => (t.id === data.id ? data : t)))
  }

  return (
    <ul className="space-y-2">
      {todos.length === 0 && (
        <p className="text-gray-400 text-sm">Nenhum item na lista.</p>
      )}
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => toggle(todo)}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition select-none"
        >
          <span
            className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
              todo.done ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
            }`}
          >
            {todo.done && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          <span className={todo.done ? 'line-through text-gray-400' : 'text-gray-800'}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  )
}
