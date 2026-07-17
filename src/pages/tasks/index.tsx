// Day 5: Task store wired to page — Day 6 will add full Task List UI
import { useTaskStore } from '../../store/tasks';

export const Tasks = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-forest-900">Tasks</h1>
      <p className="text-forest-500 text-sm">
        Store loaded ✅ — {tasks.length} tasks in store, {filteredTasks.length} shown after filter.
      </p>
      <ul className="space-y-2">
        {filteredTasks.map((task) => (
          <li key={task.id} className="bg-white rounded-xl p-4 border border-cream-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-forest-900">{task.title}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                task.status === 'on_track' ? 'bg-olive-200 text-forest-800' :
                task.status === 'delayed' ? 'bg-rose-200 text-rose-900' :
                'bg-cream-200 text-forest-600'
              }`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-forest-500 mt-1">{task.techTag} · Due {task.dueDate} · {task.priority.toUpperCase()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
