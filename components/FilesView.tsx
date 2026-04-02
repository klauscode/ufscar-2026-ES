'use client'

import { useState } from 'react'
import type { FileItem } from '@/lib/types'

function fileLabel(url: string) {
  const lower = url.toLowerCase()
  if (lower.includes('slides') || lower.includes('presentation') || lower.includes('ppt')) return 'Slides'
  if (lower.includes('docs.google') || lower.includes('document')) return 'Doc'
  if (lower.includes('sheet') || lower.includes('spreadsheet') || lower.includes('xls')) return 'Planilha'
  return 'Arquivo'
}

type Props = {
  files: FileItem[]
  subjects: string[]
}

export default function FilesView({ files, subjects }: Props) {
  const [selected, setSelected] = useState(subjects[0] ?? '')

  const filtered = files
    .filter((file) => file.subject === selected)
    .sort((left, right) => new Date(right.file_date).getTime() - new Date(left.file_date).getTime())

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setSelected(subject)}
            className="rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              background: selected === subject ? 'var(--accent)' : 'var(--surface)',
              color: selected === subject ? '#ffffff' : 'var(--text-2)',
              border: `1px solid ${selected === subject ? 'var(--accent)' : 'var(--border)'}`,
              boxShadow: selected === subject ? 'var(--shadow)' : 'none',
            }}
          >
            {subject}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-3">
          {filtered.map((file) => (
            <a
              key={file.id}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="panel flex items-center gap-4 px-5 py-4 hover:-translate-y-0.5"
              style={{ textDecoration: 'none' }}
            >
              <div className="rounded-[1rem] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                {fileLabel(file.url)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text)]">{file.title}</p>
                <p className="mt-1 text-sm text-[var(--text-3)]">
                  {new Date(`${file.file_date}T12:00:00`).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--accent)]">Abrir</span>
            </a>
          ))}
        </div>
      ) : (
        <div className="panel px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--text)]">Nenhum arquivo ainda</p>
          <p className="mt-2 text-sm text-[var(--text-3)]">O admin pode adicionar materiais para esta materia.</p>
        </div>
      )}
    </div>
  )
}
