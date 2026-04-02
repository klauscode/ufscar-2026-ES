import { supabase } from '@/lib/supabase'
import type { ScheduleItem } from '@/lib/types'

const DAYS = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado']
const COLORS = ['#0f6c74', '#134f7a', '#3f6f44', '#a94d1e', '#7b495a', '#556173']

function subjectColor(subject: string) {
  let hash = 0
  for (const char of subject) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

export default async function SchedulePage() {
  const { data } = await supabase.from('schedule').select('*').order('day_of_week').order('start_time')
  const slots: ScheduleItem[] = data ?? []
  const byDay: Record<number, ScheduleItem[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [] }

  for (const slot of slots) {
    if (slot.day_of_week in byDay) {
      byDay[slot.day_of_week].push(slot)
    }
  }

  const today = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="space-y-6">
      <header className="panel px-6 py-6">
        <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
          Grade semanal
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Horarios da semana</h1>
        <p className="mt-2 text-sm text-[var(--text-2)]">
          Visualizacao limpa da rotina letiva, com destaque para o dia atual.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DAYS.map((day, index) => (
          <section
            key={day}
            className="panel overflow-hidden"
            style={{
              borderColor: index === today ? 'color-mix(in srgb, var(--accent) 35%, var(--border))' : 'var(--border)',
            }}
          >
            <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--text)]">{day}</h2>
                <p className="text-sm text-[var(--text-3)]">
                  {byDay[index].length > 0 ? `${byDay[index].length} aula(s)` : 'Sem aulas'}
                </p>
              </div>
              {index === today && (
                <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]" style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}>
                  Hoje
                </span>
              )}
            </div>

            <div className="space-y-3 px-5 py-4">
              {byDay[index].length > 0 ? (
                byDay[index].map((slot) => (
                  <div key={slot.id} className="rounded-[1rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-10 w-1 rounded-full" style={{ background: subjectColor(slot.subject) }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[var(--text)]">{slot.subject}</p>
                        <p className="mt-1 text-sm text-[var(--text-2)]">
                          {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        </p>
                        {slot.room && (
                          <p className="mt-1 text-sm text-[var(--text-3)]">{slot.room}</p>
                        )}
                        {slot.professor && (
                          <p className="mt-1 text-sm text-[var(--text-3)]">{slot.professor}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--text-3)]">Nenhuma aula cadastrada.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
