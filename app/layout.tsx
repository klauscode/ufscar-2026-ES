import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Educação Especial 2026 — UFSCar',
  description: 'Horários, tarefas e avisos da turma',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            const t = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
      <body>
        <Nav />
        <main className="max-w-5xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  )
}
