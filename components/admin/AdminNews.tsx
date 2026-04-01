'use client'

import { useState } from 'react'

export default function AdminNews({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState({ title: '', body: '', pinned: false })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', body: '', pinned: false })
      window.location.reload()
    }
    setLoading(false)
  }

  async function togglePin(item: any) {
    await fetch('/api/admin/news', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, pinned: !item.pinned }),
    })
    setItems((prev) => prev.map((n) => n.id === item.id ? { ...n, pinned: !n.pinned } : n))
  }

  async function remove(id: string) {
    await fetch('/api/admin/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Publicar aviso</h2>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Título</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Ex: Aula cancelada na quinta"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            required
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Mensagem</label>
          <textarea
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            placeholder="Escreva o aviso aqui..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            required
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.pinned}
            onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm text-gray-600">Fixar no topo</span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? 'Publicando...' : 'Publicar aviso'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Avisos publicados</h2>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhum aviso publicado.</p>
        ) : (
          <ul className="space-y-3">
            {items.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl border p-4 ${n.pinned ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'}`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{n.title}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{n.body}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => togglePin(n)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition ${
                        n.pinned
                          ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {n.pinned ? 'Fixado' : 'Fixar'}
                    </button>
                    <button
                      onClick={() => remove(n.id)}
                      className="text-red-400 hover:text-red-600 text-sm transition"
                    >
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
