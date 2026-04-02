import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { HomeworkItem, NewsItem, ScheduleItem } from '@/lib/types'

const DAY_NAMES = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo']
const COLORS = ['#0f6c74', '#134f7a', '#3f6f44', '#a94d1e', '#7b495a', '#556173']

function subjectColor(subject: string) {
  let hash = 0
  for (const char of subject) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash)
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}

function getDaysUntil(dateText: string) {
  return (new Date(dateText).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
}

function getNextClass(allSlots: ScheduleItem[], dayOfWeek: number) {
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  const todayNext = allSlots
    .filter((slot) => slot.day_of_week === dayOfWeek)
    .filter((slot) => {
      const [hours, minutes] = slot.start_time.split(':').map(Number)
      return hours * 60 + minutes > nowMinutes
    })
    .sort((left, right) => left.start_time.localeCompare(right.start_time))[0]

  if (todayNext) {
    return { ...todayNext, label: 'Hoje' }
  }

  for (let offset = 1; offset <= 6; offset += 1) {
    const nextDay = (dayOfWeek + offset) % 7
    const classes = allSlots
      .filter((slot) => slot.day_of_week === nextDay)
      .sort((left, right) => left.start_time.localeCompare(right.start_time))

    if (classes.length > 0) {
      return { ...classes[0], label: DAY_NAMES[nextDay] }
    }
  }

  return null
}

export default async function HomePage() {
  const today = new Date()
  const currentDay = today.getDay() === 0 ? 6 : today.getDay() - 1

  const [
    { data: scheduleData },
    { data: homeworkData },
    { data: newsData },
    { count: todoCount },
  ] = await Promise.all([
    supabase.from('schedule').select('*').order('day_of_week').order('start_time'),
    supabase.from('homework').select('*').gte('deadline', new Date().toISOString()).order('deadline').limit(4),
    supabase.from('news').select('*').eq('pinned', true).order('created_at', { ascending: false }).limit(1),
    supabase.from('todos').select('*', { count: 'exact', head: true }).eq('done', false),
  ])

  const allSlots: ScheduleItem[] = scheduleData ?? []
  const homework: HomeworkItem[] = homeworkData ?? []
  const pinnedNews: NewsItem[] = newsData ?? []
  const todaySlots = allSlots.filter((slot) => slot.day_of_week === currentDay)
  const nextClass = getNextClass(allSlots, currentDay)
  const nextColor = nextClass ? subjectColor(nextClass.subject) : 'var(--accent)'

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.9fr]">
        <div
          className="panel relative overflow-hidden px-6 py-6 md:px-8 md:py-8"
          style={{
            borderColor: `${nextColor}40`,
            background:
              `radial-gradient(circle at top right, ${nextColor}18, transparent 20rem), var(--surface)`,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="font-display text-xs uppercase tracking-[0.34em] text-[var(--text-3)]">
                Dashboard da turma
              </p>
              <div>
                <h1 className="text-3xl font-semibold text-[var(--text)] md:text-4xl">
                  Organize a semana com menos atrito.
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--text-2)] md:text-base">
                  Horarios, tarefas, arquivos e avisos em um lugar so para a turma de Educacao Especial.
                </p>
              </div>
            </div>
            <div className="rounded-full border px-4 py-2 text-sm font-semibold" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)', color: 'var(--text-2)' }}>
              {today.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {nextClass ? (
            <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-[1.4rem] border px-5 py-5" style={{ borderColor: `${nextColor}35`, background: 'rgba(255,255,255,0.36)' }}>
                <p className="text-xs font-semibold uppercase tracking-[0.3em]" style={{ color: nextColor }}>
                  Proxima aula · {nextClass.label}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--text)]">
                  {nextClass.subject}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-2)]">
                  {nextClass.professor || 'Professor nao informado'}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full px-3 py-1.5 text-sm font-semibold" style={{ background: `${nextColor}18`, color: nextColor }}>
                    {nextClass.start_time.slice(0, 5)} - {nextClass.end_time.slice(0, 5)}
                  </span>
                  {nextClass.room && (
                    <span className="rounded-full border px-3 py-1.5 text-sm font-medium text-[var(--text-2)]" style={{ borderColor: 'var(--border)' }}>
                      {nextClass.room}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                <div className="rounded-[1.25rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-3)]">Tarefas abertas</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-[var(--text)]">{homework.length}</p>
                </div>
                <div className="rounded-[1.25rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-3)]">Checklist</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-[var(--text)]">{todoCount ?? 0}</p>
                </div>
                <div className="rounded-[1.25rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-3)]">Aulas hoje</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-[var(--text)]">{todaySlots.length}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-[1.5rem] border px-5 py-6 text-sm text-[var(--text-2)]" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
              Nenhuma aula cadastrada para os proximos dias.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="panel px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-[var(--text)]">Aviso em destaque</p>
                <p className="text-sm text-[var(--text-3)]">Comunicados importantes da turma</p>
              </div>
              <Link href="/news" className="text-sm font-semibold text-[var(--accent)]">
                Ver avisos
              </Link>
            </div>
            {pinnedNews[0] ? (
              <div className="mt-4 rounded-[1.25rem] border px-4 py-4" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                <p className="text-sm font-semibold text-[var(--text)]">{pinnedNews[0].title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-2)]">
                  {pinnedNews[0].body}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-[var(--text-3)]">Nenhum aviso fixado no momento.</p>
            )}
          </div>

          <div className="panel px-5 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-[var(--text)]">Atalhos</p>
                <p className="text-sm text-[var(--text-3)]">Use as areas mais consultadas</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { href: '/schedule', label: 'Horarios' },
                { href: '/homework', label: 'Tarefas' },
                { href: '/arquivos', label: 'Arquivos' },
                { href: '/todos', label: 'Checklist' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-[1rem] border px-4 py-4 text-sm font-semibold"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)', color: 'var(--text)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="font-display text-lg font-semibold text-[var(--text)]">Hoje</p>
              <p className="text-sm text-[var(--text-3)]">Resumo da grade do dia</p>
            </div>
            <Link href="/schedule" className="text-sm font-semibold text-[var(--accent)]">Ver grade</Link>
          </div>
          <div className="px-5 py-3">
            {todaySlots.length > 0 ? (
              <div className="space-y-3">
                {todaySlots.map((slot) => {
                  const color = subjectColor(slot.subject)
                  return (
                    <div key={slot.id} className="rounded-[1rem] border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 h-10 w-1 rounded-full" style={{ background: color }} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--text)]">{slot.subject}</p>
                          <p className="mt-1 text-sm text-[var(--text-2)]">
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                            {slot.room ? ` · ${slot.room}` : ''}
                          </p>
                          {slot.professor && (
                            <p className="mt-1 text-sm text-[var(--text-3)]">{slot.professor}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-6 text-sm text-[var(--text-3)]">Sem aulas hoje.</p>
            )}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: 'var(--border)' }}>
            <div>
              <p className="font-display text-lg font-semibold text-[var(--text)]">Prazos proximos</p>
              <p className="text-sm text-[var(--text-3)]">Tarefas com vencimento mais proximo</p>
            </div>
            <Link href="/homework" className="text-sm font-semibold text-[var(--accent)]">Ver tarefas</Link>
          </div>
          <div className="px-5 py-3">
            {homework.length > 0 ? (
              <div className="space-y-3">
                {homework.map((item) => {
                  const days = getDaysUntil(item.deadline)
                  const urgent = days < 1
                  const soon = days < 3
                  return (
                    <div key={item.id} className="rounded-[1rem] border px-4 py-3" style={{ borderColor: 'var(--border)', background: 'var(--surface-solid)' }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                          <p className="mt-1 text-sm text-[var(--accent)]">{item.subject}</p>
                          {item.description && (
                            <p className="mt-2 text-sm text-[var(--text-2)]">{item.description}</p>
                          )}
                        </div>
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold"
                          style={{
                            background: urgent
                              ? 'rgba(191,58,48,0.14)'
                              : soon
                                ? 'rgba(169,77,30,0.14)'
                                : 'var(--surface-2)',
                            color: urgent ? 'var(--danger)' : soon ? 'var(--warn)' : 'var(--text-2)',
                          }}
                        >
                          {urgent ? 'Hoje' : `${Math.ceil(days)} dias`}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="py-6 text-sm text-[var(--text-3)]">Nenhuma tarefa pendente.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
