import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'

const bodyFont = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Educacao Especial 2026 | UFSCar',
  description: 'Horarios, tarefas, arquivos e avisos da turma.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', t);
          } catch (e) {}
        `}} />
      </head>
      <body>
        <div className="app-shell">
          <div className="app-glow app-glow-left" />
          <div className="app-glow app-glow-right" />
        </div>
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">{children}</main>
      </body>
    </html>
  )
}
