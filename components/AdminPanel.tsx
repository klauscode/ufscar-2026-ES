'use client'

import { useState } from 'react'
import AdminSchedule from './admin/AdminSchedule'
import AdminHomework from './admin/AdminHomework'
import AdminNews from './admin/AdminNews'

const TABS = [
  { key: 'schedule', label: '🗓 Horários' },
  { key: 'homework', label: '📚 Tarefas' },
  { key: 'news', label: '📢 Avisos' },
]

type Props = {
  initialSchedule: any[]
  initialHomework: any[]
  initialNews: any[]
}

export default function AdminPanel({ initialSchedule, initialHomework, initialNews }: Props) {
  const [tab, setTab] = useState('schedule')

  const subjects = [...new Set(initialSchedule.map((s) => s.subject))]

  return (
    <div>
      <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'var(--surface-2)', width: 'fit-content' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
            style={{
              background: tab === t.key ? 'var(--surface)' : 'transparent',
              color: tab === t.key ? 'var(--text)' : 'var(--text-2)',
              boxShadow: tab === t.key ? 'var(--shadow)' : 'none',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'schedule' && <AdminSchedule initial={initialSchedule} />}
      {tab === 'homework' && <AdminHomework initial={initialHomework} subjects={subjects} />}
      {tab === 'news' && <AdminNews initial={initialNews} />}
    </div>
  )
}
