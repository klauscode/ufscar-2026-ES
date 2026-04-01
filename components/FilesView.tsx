'use client'

import { useState } from 'react'

type File = { id: string; subject: string; title: string; url: string; file_date: string }

function fileIcon(url: string) {
  const u = url.toLowerCase()
  if (u.includes('docs.google') || u.includes('document')) return '📝'
  if (u.includes('presentation') || u.includes('ppt') || u.includes('slides')) return '📊'
  if (u.includes('spreadsheet') || u.includes('sheet') || u.includes('xls')) return '📋'
  return '📄'
}

export default function FilesView({ files, subjects }: { files: File[]; subjects: string[] }) {
  const [selected, setSelected] = useState(subjects[0] ?? '')

  const filtered = files
    .filter(f => f.subject === selected)
    .sort((a, b) => new Date(b.file_date).getTime() - new Date(a.file_date).getTime())

  return (
    <div className="space-y-6">
      {/* Subject pills */}
      <div className="flex flex-wrap gap-2">
        {subjects.map(s => (
          <button
            key={s}
            onClick={() => setSelected(s)}
            className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
            style={{
              background: selected === s ? 'var(--accent)' : 'var(--surface)',
              color: selected === s ? '#fff' : 'var(--text-2)',
              border: `1px solid ${selected === s ? 'var(--accent)' : 'var(--border)'}`,
              boxShadow: selected === s ? '0 4px 12px rgba(79,70,229,0.3)' : 'var(--shadow)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Files for selected subject */}
      <div>
        {filtered.length > 0 ? (
          <ul className="space-y-2">
            {filtered.map(f => (
              <li key={f.id}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-2xl border px-5 py-4 transition-all group"
                  style={{ background: 'var(--surface)', borderColor: 'var(--border)', boxShadow: 'var(--shadow)', textDecoration: 'none' }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)' }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)' }}
                >
                  <span className="text-2xl shrink-0">{fileIcon(f.url)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate" style={{ color: 'var(--text)' }}>{f.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>
                      {new Date(f.file_date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="text-sm font-medium shrink-0 transition-all" style={{ color: 'var(--accent)' }}>
                    Abrir →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border px-6 py-12 text-center" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <p className="text-3xl mb-2">📂</p>
            <p className="font-semibold" style={{ color: 'var(--text)' }}>Nenhum arquivo ainda.</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-3)' }}>O admin pode adicionar arquivos nesta matéria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
