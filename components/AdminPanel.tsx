'use client'

import { useState } from 'react'
import AdminFiles from './admin/AdminFiles'
import AdminHomework from './admin/AdminHomework'
import AdminNews from './admin/AdminNews'
import AdminSchedule from './admin/AdminSchedule'
import AdminTodos from './admin/AdminTodos'
import type { FileItem, HomeworkItem, NewsItem, ScheduleItem, TodoItem } from '@/lib/types'

const TABS = [
  { key: 'schedule', label: 'Horarios' },
  { key: 'homework', label: 'Tarefas' },
  { key: 'files', label: 'Arquivos' },
  { key: 'todos', label: 'Checklist' },
  { key: 'news', label: 'Avisos' },
] as const

type TabKey = (typeof TABS)[number]['key']

type Props = {
  initialSchedule: ScheduleItem[]
  initialHomework: HomeworkItem[]
  initialFiles: FileItem[]
  initialNews: NewsItem[]
  initialTodos: TodoItem[]
}

export default function AdminPanel({
  initialSchedule,
  initialHomework,
  initialFiles,
  initialNews,
  initialTodos,
}: Props) {
  const [tab, setTab] = useState<TabKey>('schedule')
  const subjects = [...new Set(initialSchedule.map((item) => item.subject))]

  return (
    <div className="space-y-5">
      <div className="panel flex flex-wrap gap-2 px-3 py-3">
        {TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              background: tab === item.key ? 'var(--accent)' : 'transparent',
              color: tab === item.key ? '#ffffff' : 'var(--text-2)',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'schedule' && <AdminSchedule initial={initialSchedule} />}
      {tab === 'homework' && <AdminHomework initial={initialHomework} subjects={subjects} />}
      {tab === 'files' && <AdminFiles initial={initialFiles} subjects={subjects} />}
      {tab === 'todos' && <AdminTodos initial={initialTodos} />}
      {tab === 'news' && <AdminNews initial={initialNews} />}
    </div>
  )
}
