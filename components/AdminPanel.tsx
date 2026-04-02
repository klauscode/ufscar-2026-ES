'use client'

import { useState } from 'react'
import AdminFiles from './admin/AdminFiles'
import AdminHomework from './admin/AdminHomework'
import AdminNews from './admin/AdminNews'
import AdminSchedule from './admin/AdminSchedule'
import type { FileItem, HomeworkItem, NewsItem, ScheduleItem } from '@/lib/types'

const TABS = [
  { key: 'schedule', label: 'Horarios' },
  { key: 'homework', label: 'Tarefas' },
  { key: 'files', label: 'Arquivos' },
  { key: 'news', label: 'Avisos' },
] as const

type TabKey = (typeof TABS)[number]['key']

type Props = {
  initialSchedule: ScheduleItem[]
  initialHomework: HomeworkItem[]
  initialFiles: FileItem[]
  initialNews: NewsItem[]
}

export default function AdminPanel({
  initialSchedule,
  initialHomework,
  initialFiles,
  initialNews,
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
      {tab === 'news' && <AdminNews initial={initialNews} />}
    </div>
  )
}
