'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Início' },
  { href: '/schedule', label: 'Horários' },
  { href: '/homework', label: 'Tarefas' },
  { href: '/todos', label: 'To-do' },
  { href: '/news', label: 'Avisos' },
]

export default function Nav() {
  const pathname = usePathname()

  // Don't show nav on password entry or admin login pages
  if (pathname === '/enter' || pathname === '/admin/login') return null

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-14">
        <span className="font-bold text-blue-600 mr-4 text-lg">Turma</span>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </Link>
        ))}
        <div className="ml-auto">
          <Link
            href="/admin"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
