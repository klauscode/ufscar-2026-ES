'use client'

import { useMemo, useState } from 'react'
import MarkdownPreview from '@/components/MarkdownPreview'
import type { HomeworkItem } from '@/lib/types'

type Props = {
  items: HomeworkItem[]
  nowIso: string
}

function urgency(deadline: string, nowIso: string) {
  const days =
    (new Date(deadline).getTime() - new Date(nowIso).getTime()) /
    (1000 * 60 * 60 * 24)
  if (days < 1) return { tone: 'var(--danger)', bg: 'rgba(191,58,48,0.14)', label: 'Hoje' }
  if (days < 3) return { tone: 'var(--warn)', bg: 'rgba(169,77,30,0.14)', label: `${Math.ceil(days)} dias` }
  return { tone: 'var(--accent)', bg: 'var(--accent-bg)', label: `${Math.ceil(days)} dias` }
}

export default function HomeworkBoard({ items, nowIso }: Props) {
  const upcoming = useMemo(
    () => items.filter((item) => item.deadline >= nowIso),
    [items, nowIso]
  )
  const past = useMemo(
    () => items.filter((item) => item.deadline < nowIso),
    [items, nowIso]
  )
  const [selectedId, setSelectedId] = useState<string | null>(upcoming[0]?.id ?? null)

  const selected =
    upcoming.find((item) => item.id === selectedId) ??
    past.find((item) => item.id === selectedId) ??
    upcoming[0] ??
    past[0] ??
    null

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="space-y-4">
        {upcoming.length > 0 ? (
          upcoming.map((item) => {
            const badge = urgency(item.deadline, nowIso)
            const active = selected?.id === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="panel block w-full overflow-hidden text-left"
                style={{
                  borderColor: active
                    ? 'color-mix(in srgb, var(--accent) 38%, var(--border))'
                    : 'var(--border)',
                }}
              >
                <div className="h-1" style={{ background: badge.tone }} />
                <div className="px-6 py-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold text-[var(--text)]">{item.title}</h2>
                    <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ background: badge.bg, color: badge.tone }}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-[var(--accent)]">{item.subject}</p>
                  <p className="mt-3 text-sm text-[var(--text-2)]">
                    {item.description?.trim() ? 'Clique para abrir a descricao formatada.' : 'Sem descricao.'}
                  </p>
                </div>
              </button>
            )
          })
        ) : (
          <div className="panel px-6 py-12 text-center">
            <p className="font-display text-2xl font-semibold text-[var(--text)]">Nenhuma tarefa pendente</p>
            <p className="mt-2 text-sm text-[var(--text-3)]">Quando aparecer algo novo, voce ve primeiro aqui.</p>
          </div>
        )}

        {past.length > 0 && (
          <section className="panel px-6 py-6">
            <h2 className="font-display text-xl font-semibold text-[var(--text)]">Arquivadas</h2>
            <p className="mt-1 text-sm text-[var(--text-3)]">Itens cujo prazo ja passou.</p>
            <div className="mt-4 space-y-3">
              {past.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className="flex w-full flex-col gap-2 rounded-[1rem] border px-4 py-4 text-left opacity-75"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}
                >
                  <p className="text-sm font-semibold text-[var(--text)] line-through">{item.title}</p>
                  <p className="text-sm text-[var(--text-3)]">{item.subject}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </section>

      <aside className="panel h-fit px-6 py-6 lg:sticky lg:top-24">
        {selected ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-2xl font-semibold text-[var(--text)]">{selected.title}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--accent)]">{selected.subject}</p>
              </div>
              <div className="rounded-[1rem] border px-4 py-3 text-sm text-[var(--text-2)]" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                {new Date(selected.deadline).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>

            <div className="mt-6 rounded-[1rem] border px-5 py-5" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
              <MarkdownPreview
                content={selected.description}
                className="markdown-body text-sm leading-7 text-[var(--text-2)]"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm text-[var(--text-3)]">Selecione uma tarefa para ver os detalhes.</p>
        )}
      </aside>
    </div>
  )
}
