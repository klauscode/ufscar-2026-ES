import { supabase } from '@/lib/supabase'
import TodoList from '@/components/TodoList'

export default async function TodosPage() {
  const { data: todos } = await supabase
    .from('todos')
    .select('*')
    .order('created_at')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">To-do da Turma</h1>
      <p className="text-sm text-gray-500">Lista compartilhada — qualquer um pode marcar como feito.</p>
      <TodoList initialTodos={todos ?? []} />
    </div>
  )
}
