'use client'

import { useState } from 'react'

export default function AdminTodos({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    const res = await fetch('/api/admin/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.trim(), done: false }),
    })
    if (res.ok) {
      window.location.reload()
    }
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch('/api/admin/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="bg-white rounded-xl border border-gray-200 p-6 flex gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Novo item da lista..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
        >
          Adicionar
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Itens da lista</h2>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum item.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((todo) => (
              <li key={todo.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-center">
                <span className={todo.done ? 'line-through text-gray-400' : 'text-gray-800'}>
                  {todo.text}
                </span>
                <button
                  onClick={() => remove(todo.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition ml-4"
                >
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
