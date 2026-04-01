'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/', label: 'Início' },
  { href: '/schedule', label: 'Horários' },
  { href: '/homework', label: 'Tarefas' },
  { href: '/arquivos', label: 'Arquivos' },
  { href: '/news', label: 'Avisos' },
]

export default function Nav() {
  const pathname = usePathname()
  if (pathname === '/enter' || pathname === '/admin/login') return null

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-14">
        <Link href="/" className="flex items-center gap-2.5 mr-5">
          <img src="https://i.imgur.com/H61msci.png" alt="Logo" className="w-7 h-7 object-contain" />
          <span className="font-semibold text-sm hidden sm:block" style={{ color: 'var(--text)' }}>
            Ed. Especial <span style={{ color: 'var(--text-3)' }}>2026</span>
          </span>
        </Link>

        <div className="flex items-center gap-0.5">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: active ? 'var(--accent)' : 'var(--text-2)',
                  background: active ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/admin"
            className="text-xs px-2.5 py-1 rounded-lg transition-all font-medium"
            style={{ color: 'var(--text-3)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
