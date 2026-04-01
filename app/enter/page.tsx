'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function EnterPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/enter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) { router.push('/') }
    else { setError('Senha incorreta. Tente novamente.'); setLoading(false) }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--bg)' }}>
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #4f46e5, transparent 70%)' }} />
      </div>

      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-8">
          <img src="https://i.imgur.com/H61msci.png" alt="Logo" className="w-16 h-16 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Educação Especial 2026</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>UFSCar · Dashboard da turma</p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <p className="text-sm text-center mb-6" style={{ color: 'var(--text-2)' }}>Digite a senha para acessar</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              placeholder="Senha da turma"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' }}
              autoFocus required
            />
            {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 4px 15px rgba(79,70,229,0.4)' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
