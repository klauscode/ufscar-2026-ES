import FilesView from '@/components/FilesView'
import { supabase } from '@/lib/supabase'
import type { FileItem, ScheduleItem } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ArquivosPage() {
  const [{ data: filesData }, { data: scheduleData }] = await Promise.all([
    supabase.from('files').select('*').order('file_date', { ascending: false }),
    supabase.from('schedule').select('*').order('day_of_week'),
  ])

  const files: FileItem[] = filesData ?? []
  const schedule: ScheduleItem[] = scheduleData ?? []
  const subjects = [...new Set(schedule.map((item) => item.subject))]

  return (
    <div className="space-y-6">
      <header className="panel px-6 py-6">
        <h1 className="mt-3 text-3xl font-semibold text-[var(--text)]">Arquivos por materia</h1>
      </header>

      {subjects.length > 0 ? (
        <FilesView files={files} subjects={subjects} />
      ) : (
        <div className="panel px-6 py-12 text-center">
          <p className="font-display text-2xl font-semibold text-[var(--text)]">Nenhuma materia cadastrada</p>
          <p className="mt-2 text-sm text-[var(--text-3)]">Cadastre a grade primeiro para organizar os arquivos.</p>
        </div>
      )}
    </div>
  )
}
