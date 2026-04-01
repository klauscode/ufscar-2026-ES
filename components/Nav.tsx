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

  if (pathname === '/enter' || pathname === '/admin/login') return null

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50" style={{ boxShadow: '0 1px 12px rgba(0,0,0,0.06)' }}>
      <div className="max-w-5xl mx-auto px-4 flex items-center gap-1 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
            U
          </div>
          <span className="font-bold text-gray-900 text-base hidden sm:block">UFSCar ES</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'text-indigo-700 bg-indigo-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto">
          <Link
            href="/admin"
            className="text-xs text-gray-300 hover:text-gray-500 transition"
          >
            admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
