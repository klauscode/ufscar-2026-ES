'use client'

import { useState } from 'react'
import AdminSchedule from './admin/AdminSchedule'
import AdminHomework from './admin/AdminHomework'
import AdminTodos from './admin/AdminTodos'
import AdminNews from './admin/AdminNews'

const TABS = [
  { key: 'schedule', label: 'Horários' },
  { key: 'homework', label: 'Tarefas' },
  { key: 'todos', label: 'To-do' },
  { key: 'news', label: 'Avisos' },
]

type Props = {
  initialSchedule: any[]
  initialHomework: any[]
  initialTodos: any[]
  initialNews: any[]
}

export default function AdminPanel({ initialSchedule, initialHomework, initialTodos, initialNews }: Props) {
  const [tab, setTab] = useState('schedule')

  return (
    <div>
      <div className="flex gap-2 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              tab === t.key
                ? 'bg-white border border-b-white border-gray-200 text-blue-600 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'schedule' && <AdminSchedule initial={initialSchedule} />}
      {tab === 'homework' && <AdminHomework initial={initialHomework} />}
      {tab === 'todos' && <AdminTodos initial={initialTodos} />}
      {tab === 'news' && <AdminNews initial={initialNews} />}
    </div>
  )
}
