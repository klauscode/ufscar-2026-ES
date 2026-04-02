'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BrandMark from './BrandMark'
import ThemeToggle from './ThemeToggle'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/schedule', label: 'Horarios' },
  { href: '/homework', label: 'Tarefas' },
  { href: '/arquivos', label: 'Arquivos' },
  { href: '/news', label: 'Avisos' },
]

export default function Nav() {
  const pathname = usePathname()

  if (pathname === '/enter' || pathname === '/admin/login') {
    return null
  }

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--border)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3">
        <Link href="/" className="mr-2 flex shrink-0 items-center gap-3">
          <Image
            src="/navbar-logo.png"
            alt="Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-lg object-cover"
            priority
          />
          <BrandMark compact />
        </Link>

        <div className="order-3 flex w-full gap-1 overflow-x-auto pb-1 md:order-2 md:w-auto md:flex-1 md:justify-center md:pb-0">
          {links.map(({ href, label }) => {
            const active = pathname === href

            return (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-2 text-sm font-medium transition"
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

        <div className="ml-auto flex items-center gap-2 md:order-3">
          <ThemeToggle />
          <Link
            href="/admin"
            className="rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition"
            style={{ color: 'var(--text-2)', background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
