import React, { useState } from 'react';
import { useStore } from '../../store/StateContext';
import { X, CheckCircle2 } from 'lucide-react';

export function NewTaskModal({ isOpen, onClose }) {
  const { addTask } = useStore();
  const [title, setTitle] = useState('');
  const [project, setProject] = useState('Academic Administration');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('Today');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({ title, project, priority, dueDate });
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Assigned Task</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>Task Title / Description *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Audit Class 10 Attendance Records"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label>Project / Department Category</label>
              <select
                className="form-select"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              >
                <option value="Academic Administration">Academic Administration</option>
                <option value="Core Platform">Core Platform</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Fee Management">Fee Management</option>
                <option value="Examination System">Examination System</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Priority Level</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <select
                  className="form-select"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Aug 02">Aug 02</option>
                  <option value="Aug 05">Aug 05</option>
                  <option value="Aug 10">Aug 10</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} />
              <span>Create Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
