import { supabase } from '@/lib/supabase'
import TodoList from '@/components/TodoList'

export default async function TodosPage() {
  const { data: todos } = await supabase.from('todos').select('*').order('created_at')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">To-do da Turma</h1>
        <p className="text-gray-500 text-sm mt-1">Lista compartilhada — clique para marcar como feito.</p>
      </div>
      <TodoList initialTodos={todos ?? []} />
    </div>
  )
}
