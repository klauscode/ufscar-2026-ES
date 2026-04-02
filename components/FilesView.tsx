'use client'

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
  return (
    <div className="space-y-4">
      {subjects.map((subject, index) => {
        const subjectFiles = files
          .filter((file) => file.subject === subject)
          .sort(
            (left, right) =>
              new Date(right.file_date).getTime() - new Date(left.file_date).getTime()
          )

        return (
          <details
            key={subject}
            className="panel overflow-hidden"
            open={index === 0}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4"
              style={{ background: 'var(--surface-solid)' }}
            >
              <div>
                <p className="text-base font-semibold text-[var(--text)]">{subject}</p>
                <p className="mt-1 text-sm text-[var(--text-3)]">
                  {subjectFiles.length > 0
                    ? `${subjectFiles.length} arquivo(s)`
                    : 'Nenhum arquivo cadastrado'}
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--accent)]">Abrir</span>
            </summary>

            <div className="border-t px-5 py-4" style={{ borderColor: 'var(--border)' }}>
              {subjectFiles.length > 0 ? (
                <div className="grid gap-3">
                  {subjectFiles.map((file) => (
                    <a
                      key={file.id}
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[1rem] border px-4 py-4"
                      style={{
                        textDecoration: 'none',
                        borderColor: 'var(--border)',
                        background: 'var(--surface-solid)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="rounded-[1rem] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                          style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                        >
                          {fileLabel(file.url)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--text)]">
                            {file.title}
                          </p>
                          <p className="mt-1 text-sm text-[var(--text-3)]">
                            {new Date(`${file.file_date}T12:00:00`).toLocaleDateString(
                              'pt-BR',
                              {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[var(--accent)]">
                          Abrir
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-3)]">
                  Nenhum material publicado para esta materia.
                </p>
              )}
            </div>
          </details>
        )
      })}
    </div>
  )
}
