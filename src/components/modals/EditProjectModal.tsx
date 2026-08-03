import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProjectStore } from '../../store/projects';
import { useToast } from '../../hooks/useToast';
import type { Project, ProjectStatus } from '../../types/project';

// ─── Edit Project Modal ─────────────────────────────────────────────────────

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const EditProjectModal = ({ isOpen, onClose, project }: EditProjectModalProps) => {
  const updateProject = useProjectStore((state) => state.updateProject);
  const toast = useToast();

  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || '');
  const [category, setCategory] = useState(project.category || 'Development');
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [techStack, setTechStack] = useState(project.techStack || 'React + Node');
  const [progress, setProgress] = useState(project.progress || 0);

  // Reset form when project changes
  useEffect(() => {
    setName(project.name);
    setDescription(project.description || '');
    setCategory(project.category || 'Development');
    setStatus(project.status);
    setTechStack(project.techStack || 'React + Node');
    setProgress(project.progress || 0);
  }, [project]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    updateProject(project.id, {
      name: name.trim(),
      description: description.trim(),
      category,
      status,
      techStack,
      progress,
    });

    onClose();
    toast.success('Project updated');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-project-title"
        className="relative bg-cream-50 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
          <h2 id="edit-project-title" className="text-lg font-bold text-forest-900">Edit Project</h2>
          <button 
            onClick={onClose} 
            className="text-forest-400 hover:text-forest-700 transition-colors p-1"
            aria-label="Close edit modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-colors"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description..."
              rows={3}
              className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
            >
              <option value="Development">Development</option>
              <option value="Management">Management</option>
              <option value="Design">Design</option>
              <option value="HR / Recruitment">HR / Recruitment</option>
            </select>
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Tech Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g., React + Node"
              className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-400 transition-colors"
            />
          </div>

          {/* Status + Progress Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
              >
                <option value="on_track">On Track</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-forest-600 uppercase tracking-wide">Progress</label>
              <input
                type="number"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 outline-none focus:border-forest-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-forest-600 bg-cream-200 hover:bg-cream-300 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-semibold text-white bg-forest-900 hover:bg-forest-800 rounded-full transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
