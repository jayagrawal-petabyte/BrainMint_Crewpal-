// import { useState } from 'react';
// import { X } from 'lucide-react';
// import { useTaskStore, MOCK_TEAM_MEMBERS } from '../../store/tasks';
// import { useToast } from '../../hooks/useToast';
// import type { TaskStatus, TaskPriority, Assignee } from '../../types/task';

// // ─── Create Task Modal ─────────────────────────────────────────────────────

// interface CreateTaskModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
//   const addTask = useTaskStore((state) => state.addTask);
//   const toast = useToast();

//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [techTag, setTechTag] = useState('React + Node');
//   const [status, setStatus] = useState<TaskStatus>('on_track');
//   const [priority, setPriority] = useState<TaskPriority>('medium');
//   const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
//   const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);

//   const toggleAssignee = (assignee: Assignee) => {
//     setSelectedAssignees((prev) =>
//       prev.some((a) => a.id === assignee.id)
//         ? prev.filter((a) => a.id !== assignee.id)
//         : [...prev, assignee]
//     );
//   };

//   const handleSubmit = () => {
//     if (!title.trim()) return;

//     addTask({
//       title: title.trim(),
//       description: description.trim(),
//       techTag,
//       status,
//       priority,
//       dueDate,
//       assignees: selectedAssignees.length > 0 ? selectedAssignees : [MOCK_TEAM_MEMBERS[0]],
//     });

//     // Reset form
//     setTitle('');
//     setDescription('');
//     setTechTag('React + Node');
//     setStatus('on_track');
//     setPriority('medium');
//     setDueDate(new Date().toISOString().split('T')[0]);
//     setSelectedAssignees([]);
//     onClose();

//     toast.success('Task created successfully');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/40 backdrop-blur-sm animate-in fade-in duration-200">
//       {/* Modal */}
//       <div 
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="create-task-title"
//         className="relative bg-cream-50 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in"
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
//           <h2 id="create-task-title" className="text-lg font-bold text-forest-900">New Task</h2>
//           <button
//             onClick={onClose}
//             aria-label="Close modal"
//             className="text-forest-400 hover:text-forest-700 transition-colors p-1"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="px-6 py-5 space-y-4">
//           {/* Title */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Task Title</label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter task title..."
//               className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-colors"
//             />
//           </div>

//           {/* Description */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Description</label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter description..."
//               rows={3}
//               className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-colors resize-none"
//             />
//           </div>

//           {/* Tech Tag */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Tech Stack</label>
//             <select
//               value={techTag}
//               onChange={(e) => setTechTag(e.target.value)}
//               className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
//             >
//               <option value="React + Node">React + Node</option>
//               <option value="React Native">React Native</option>
//               <option value="React">React</option>
//               <option value="Node.js">Node.js</option>
//               <option value="Next.js">Next.js</option>
//             </select>
//           </div>

//           {/* Status + Priority Row */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Status</label>
//               <select
//                 value={status}
//                 onChange={(e) => setStatus(e.target.value as TaskStatus)}
//                 className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
//               >
//                 <option value="on_track">On Track</option>
//                 <option value="delayed">Delayed</option>
//                 <option value="completed">Completed</option>
//               </select>
//             </div>
//             <div className="space-y-1.5">
//               <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Priority</label>
//               <select
//                 value={priority}
//                 onChange={(e) => setPriority(e.target.value as TaskPriority)}
//                 className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
//               >
//                 <option value="high">High</option>
//                 <option value="medium">Medium</option>
//                 <option value="low">Low</option>
//               </select>
//             </div>
//           </div>

//           {/* Due Date */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Due Date</label>
//             <input
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//               className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
//             />
//           </div>

//           {/* Assignees */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Assignees</label>
//             <div className="flex flex-wrap gap-2">
//               {MOCK_TEAM_MEMBERS.map((member) => {
//                 const isSelected = selectedAssignees.some((a) => a.id === member.id);
//                 return (
//                   <button
//                     key={member.id}
//                     onClick={() => toggleAssignee(member)}
//                     className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
//                       isSelected
//                         ? 'bg-forest-700 text-white shadow-sm'
//                         : 'bg-white border border-cream-200 text-forest-600 hover:border-forest-400'
//                     }`}
//                   >
//                     <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${
//                       isSelected ? 'bg-white/20 text-white' : `${member.avatarColor ?? 'bg-olive-300'} text-forest-800`
//                     }`}>
//                       {member.initials}
//                     </div>
//                     {member.name}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-200">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={!title.trim()}
//             className="px-5 py-2 bg-forest-700 hover:bg-forest-800 disabled:bg-forest-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
//           >
//             Create Task
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };







import { useState } from 'react';
import { useTaskStore, MOCK_TEAM_MEMBERS } from '../../store/tasks';
import { useToast } from '../../hooks/useToast';
import type { TaskStatus, TaskPriority, Assignee } from '../../types/task';

// Import our newly created reusable components
import { Modal } from '../ui/Modal';
import { FormGroup } from '../common/FormGroup';
import { Textarea } from '../common/Textarea';
import { Select } from '../common/Select';
// Assuming you have an Input component similar to Textarea based on the folder structure
import { Input } from '../common/Input';

// ─── Form Validation Helper (Security Rule 5: UX Only) ──────────────────────
const validateTaskForm = (data: { title: string; description: string }) => {
  const errors: Record<string, string> = {};
  if (!data.title.trim()) {
    errors.title = 'Task title is required';
  }
  if (data.title.trim().length > 100) {
    errors.title = 'Title must be under 100 characters';
  }
  return errors;
};
// ─────────────────────────────────────────────────────────────────────────────

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTaskModal = ({ isOpen, onClose }: CreateTaskModalProps) => {
  const addTask = useTaskStore((state) => state.addTask);
  const toast = useToast();

  // Teammate's Original State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techTag, setTechTag] = useState('React + Node');
  const [status, setStatus] = useState<TaskStatus>('on_track');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAssignees, setSelectedAssignees] = useState<Assignee[]>([]);

  // New State for Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Teammate's Original Logic
  const toggleAssignee = (assignee: Assignee) => {
    setSelectedAssignees((prev) =>
      prev.some((a) => a.id === assignee.id)
        ? prev.filter((a) => a.id !== assignee.id)
        : [...prev, assignee]
    );
  };

  const handleSubmit = () => {
    // 1. Run UX Validation Helper
    const validationErrors = validateTaskForm({ title, description });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return; // Stop submission for UX purposes
    }

    // Clear errors if validation passes
    setErrors({});

    // 2. Original Submission Logic
    addTask({
      title: title.trim(),
      description: description.trim(),
      techTag,
      status,
      priority,
      dueDate,
      assignees: selectedAssignees.length > 0 ? selectedAssignees : [MOCK_TEAM_MEMBERS[0]],
    });

    // 3. Reset form
    setTitle('');
    setDescription('');
    setTechTag('React + Node');
    setStatus('on_track');
    setPriority('medium');
    setDueDate(new Date().toISOString().split('T')[0]);
    setSelectedAssignees([]);
    onClose();

    toast.success('Task created successfully');
  };

  // Footer constructed for the Modal component
  const modalFooter = (
    <>
      <button
        onClick={onClose}
        type="button"
        className="px-4 py-2 text-sm font-medium text-forest-600 hover:text-forest-800 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={!title.trim()}
        type="button"
        className="px-5 py-2 bg-forest-700 hover:bg-forest-800 disabled:bg-forest-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-full transition-colors shadow-sm"
      >
        Create Task
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Task"
      footer={modalFooter}
      size="md"
    >
      <div className="space-y-4 pt-2">
        {/* Title */}
        <FormGroup label="Task Title" id="title" error={errors.title}>
          {/* Fallback to native input styled to match if <Input /> isn't fully implemented yet */}
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="Enter task title..."
            className={`w-full px-3 py-2.5 bg-white border rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none transition-colors ${errors.title ? 'border-red-600 focus:border-red-600' : 'border-cream-200 focus:border-forest-400'
              }`}
          />
        </FormGroup>

        {/* Description */}
        <FormGroup label="Description" id="description" error={errors.description}>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description..."
            rows={3}
            error={!!errors.description}
          />
        </FormGroup>

        {/* Tech Tag */}
        <FormGroup label="Tech Stack" id="techTag">
          <Select
            id="techTag"
            value={techTag}
            onChange={(e) => setTechTag(e.target.value)}
            options={[
              { label: 'React + Node', value: 'React + Node' },
              { label: 'React Native', value: 'React Native' },
              { label: 'React', value: 'React' },
              { label: 'Node.js', value: 'Node.js' },
              { label: 'Next.js', value: 'Next.js' },
            ]}
          />
        </FormGroup>

        {/* Status + Priority Row */}
        <div className="grid grid-cols-2 gap-3">
          <FormGroup label="Status" id="status">
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              options={[
                { label: 'On Track', value: 'on_track' },
                { label: 'Delayed', value: 'delayed' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
          </FormGroup>

          <FormGroup label="Priority" id="priority">
            <Select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              options={[
                { label: 'High', value: 'high' },
                { label: 'Medium', value: 'medium' },
                { label: 'Low', value: 'low' },
              ]}
            />
          </FormGroup>
        </div>

        {/* Due Date */}
        <FormGroup label="Due Date" id="dueDate">
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
          />
        </FormGroup>

        {/* Assignees (Preserved Teammate's Custom UI) */}
        <FormGroup label="Assignees" id="assignees">
          <div className="flex flex-wrap gap-2">
            {MOCK_TEAM_MEMBERS.map((member) => {
              const isSelected = selectedAssignees.some((a) => a.id === member.id);
              return (
                <button
                  type="button"
                  key={member.id}
                  onClick={() => toggleAssignee(member)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isSelected
                      ? 'bg-forest-700 text-white shadow-sm'
                      : 'bg-white border border-cream-200 text-forest-600 hover:border-forest-400'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold ${isSelected ? 'bg-white/20 text-white' : `${member.avatarColor ?? 'bg-olive-300'} text-forest-800`
                    }`}>
                    {member.initials}
                  </div>
                  {member.name}
                </button>
              );
            })}
          </div>
        </FormGroup>
      </div>
    </Modal>
  );
};