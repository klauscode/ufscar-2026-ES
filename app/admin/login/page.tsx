'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BrandMark from '@/components/BrandMark'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      router.push('/admin')
      router.refresh()
      return
    }

    const body = await response.json().catch(() => ({}))
    setError(body.error || 'Nao foi possivel entrar.')
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[2rem] border px-6 py-8 shadow-[var(--shadow-lg)]" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <BrandMark />
        <div className="mt-8">
          <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
            Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Acesso restrito</h1>
          <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">
            Use a conta criada no Supabase para publicar avisos e atualizar o painel.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
            required
          />
          {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full px-5 py-3 text-sm disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  )
}
