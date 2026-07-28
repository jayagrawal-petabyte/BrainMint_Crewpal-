import React, { useState } from 'react';
import { useStore } from '../../store/StateContext';
import { Check, Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';

export function TasksWidget({ onOpenNewTaskModal }) {
  const { tasks, taskFilter, setTaskFilter, toggleTaskStatus, deleteTask } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      taskFilter === 'all' ? true : task.status === taskFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <div className="panel-title-group">
          <h2>Assigned Tasks</h2>
          <p>Manage and track task state for your school ERP responsibilities.</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onOpenNewTaskModal}>
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>

      <div className="tasks-filters">
        {['all', 'pending', 'in-progress', 'completed'].map((status) => (
          <button
            key={status}
            className={`filter-tab ${taskFilter === status ? 'active' : ''}`}
            onClick={() => setTaskFilter(status)}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="table-responsive">
        <table className="tasks-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>Status</th>
              <th>Task Title</th>
              <th>Project / Category</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assignee</th>
              <th style={{ width: '40px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  <AlertCircle size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p>No assigned tasks match the selected filter.</p>
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const isCompleted = task.status === 'completed';
                const isHigh = task.priority === 'High';
                const isMedium = task.priority === 'Medium';
                const badgeClass = isHigh ? 'badge-high' : isMedium ? 'badge-medium' : 'badge-low';

                return (
                  <tr key={task.id}>
                    <td>
                      <div
                        className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
                        onClick={() => toggleTaskStatus(task.id)}
                        title="Click to toggle status (Pending -> In Progress -> Completed)"
                      >
                        {isCompleted && <Check size={12} />}
                      </div>
                    </td>
                    <td>
                      <span className={`task-title ${isCompleted ? 'completed' : ''}`}>
                        {task.title}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        ● {task.project}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>{task.priority}</span>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontWeight: task.dueDate === 'Today' ? 700 : 500,
                        color: task.dueDate === 'Today' ? 'var(--danger-text)' : 'var(--text-muted)'
                      }}>
                        <Calendar size={12} />
                        {task.dueDate}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                          {task.assigneeInitials}
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600 }}>{task.assignedTo}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() => deleteTask(task.id)}
                        title="Delete Task"
                        style={{ color: 'var(--danger)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
