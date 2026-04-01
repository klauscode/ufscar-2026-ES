'use client'

import { useState } from 'react'

export default function AdminHomework({ initial }: { initial: any[] }) {
  const [items, setItems] = useState(initial)
  const [form, setForm] = useState({ subject: '', title: '', description: '', deadline: '' })
  const [loading, setLoading] = useState(false)

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/admin/homework', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ subject: '', title: '', description: '', deadline: '' })
      window.location.reload()
    }
    setLoading(false)
  }

  async function remove(id: string) {
    await fetch('/api/admin/homework', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-700">Adicionar tarefa</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Matéria</label>
            <input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Ex: Física III"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Título</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Lista 4 — Eletromagnetismo"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-gray-500 mb-1 block">Descrição (opcional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Detalhes sobre a tarefa..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Prazo</label>
            <input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? 'Salvando...' : 'Adicionar tarefa'}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-gray-700 mb-3">Tarefas cadastradas</h2>
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm">Nenhuma tarefa cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((hw) => (
              <li key={hw.id} className="bg-white rounded-xl border border-gray-200 p-4 flex justify-between items-start">
                <div>
                  <p className="font-medium">{hw.title}</p>
                  <p className="text-sm text-blue-600">{hw.subject}</p>
                  <p className="text-sm text-gray-500">
                    Prazo: {new Date(hw.deadline).toLocaleString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => remove(hw.id)}
                  className="text-red-400 hover:text-red-600 text-sm transition ml-4 shrink-0"
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
