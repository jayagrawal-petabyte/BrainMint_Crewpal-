import { useState } from 'react';
import { X, Layers, Settings, User2 } from 'lucide-react';
import { useProjectStore } from '../../store/projects';
import { useToast } from '../../hooks/useToast';
import type { ProjectStatus } from '../../types/project';

// ─── Create Project Modal ───────────────────────────────────────────────────

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SECTION_DIVIDER = ({ icon: Icon, label }: { icon: React.FC<{ className?: string }>; label: string }) => (
  <div className="flex items-center gap-2 pt-1 pb-0.5">
    <Icon className="w-3.5 h-3.5 text-forest-500" />
    <span className="text-[10px] font-bold uppercase tracking-widest text-forest-500">{label}</span>
    <div className="flex-1 border-t border-cream-200" />
  </div>
);

const fieldClass =
  'w-full px-3 py-2.5 bg-white border border-cream-200 rounded-xl text-sm text-forest-800 placeholder:text-forest-400 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 transition-all';
const labelClass = 'text-[11px] font-semibold text-forest-600 uppercase tracking-wider';

const CATEGORY_OPTIONS = ['Development', 'Management', 'Design', 'HR / Recruitment', 'Research', 'Other'];
const TECH_STACK_SUGGESTIONS = ['React + Node', 'React Native', 'Next.js + PostgreSQL', 'React + Zustand', 'Vue + FastAPI', 'Flutter'];

export const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
  const addProject = useProjectStore((state) => state.addProject);
  const toast = useToast();

  // Core fields (stored in Zustand)
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development');
  const [status, setStatus] = useState<ProjectStatus>('on_track');
  const [techStack, setTechStack] = useState('');
  const [progress, setProgress] = useState(0);
  const [nameError, setNameError] = useState('');

  // UI-only fields (not persisted in store)
  const [supervisor, setSupervisor] = useState('');
  const [submitForApproval, setSubmitForApproval] = useState(false);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCategory('Development');
    setStatus('on_track');
    setTechStack('');
    setProgress(0);
    setNameError('');
    setSupervisor('');
    setSubmitForApproval(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Project name is required');
      return;
    }

    addProject({
      name: name.trim(),
      owner: supervisor.trim() || 'Jay Agarwal',
      description: description.trim() || undefined,
      category,
      status,
      techStack: techStack.trim() || 'React + Node',
      progress,
      memberIds: [],
    });

    resetForm();
    onClose();
    toast.success(
      submitForApproval
        ? 'Project submitted for approval'
        : 'Project created successfully'
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-project-title"
        className="relative bg-cream-50 rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* ── Header ──────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200 shrink-0">
          <div>
            <h2 id="create-project-title" className="text-lg font-bold text-forest-900">
              New Project
            </h2>
            <p className="text-[11px] text-forest-500 mt-0.5">Fill in the details to set up your project</p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="text-forest-400 hover:text-forest-700 transition-colors p-1.5 rounded-lg hover:bg-cream-200"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* ── Form (scrollable) ───────────────────── */}
        <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">

          {/* ─ Section: Identity ─ */}
          <SECTION_DIVIDER icon={Layers} label="Project Identity" />

          {/* Project Name */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              Project Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value.trim()) setNameError('');
              }}
              placeholder="e.g., School Mobile App"
              autoFocus
              className={`${fieldClass} ${nameError ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''}`}
            />
            {nameError && (
              <p className="text-[11px] text-rose-500 font-medium">{nameError}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of what this project is about..."
              rows={3}
              className={`${fieldClass} resize-none`}
            />
          </div>

          {/* Supervisor (UI-only) */}
          <div className="space-y-1.5">
            <label className={labelClass}>
              <span className="flex items-center gap-1">
                Supervisor / Lead
                <span className="text-[9px] normal-case tracking-normal font-normal text-forest-400 bg-forest-100 px-1.5 py-0.5 rounded">
                  optional
                </span>
              </span>
            </label>
            <div className="relative">
              <User2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-forest-400 pointer-events-none" />
              <input
                type="text"
                value={supervisor}
                onChange={(e) => setSupervisor(e.target.value)}
                placeholder="e.g., Jay Agarwal"
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>

          {/* ─ Section: Classification ─ */}
          <SECTION_DIVIDER icon={Settings} label="Classification" />

          {/* Category + Tech Stack (2-col) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={fieldClass}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>Tech Stack</label>
              <input
                type="text"
                list="tech-stack-suggestions"
                value={techStack}
                onChange={(e) => setTechStack(e.target.value)}
                placeholder="e.g., React + Node"
                className={fieldClass}
              />
              <datalist id="tech-stack-suggestions">
                {TECH_STACK_SUGGESTIONS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
          </div>

          {/* ─ Section: Execution ─ */}
          <SECTION_DIVIDER icon={Settings} label="Execution" />

          {/* Status + Progress (2-col) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className={labelClass}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className={fieldClass}
              >
                <option value="on_track">On Track</option>
                <option value="delayed">Delayed</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className={labelClass}>
                Progress
                <span className="ml-1.5 text-forest-400 font-normal normal-case tracking-normal">
                  ({progress}%)
                </span>
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progress}
                  onChange={(e) => setProgress(parseInt(e.target.value))}
                  className="w-full h-2 bg-cream-200 rounded-full appearance-none cursor-pointer accent-forest-700"
                />
                <div className="flex justify-between text-[10px] text-forest-400">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit for Approval (UI-only checkbox) */}
          <div className="flex items-start gap-3 p-3 bg-cream-100 border border-cream-200 rounded-xl">
            <input
              id="submit-for-approval"
              type="checkbox"
              checked={submitForApproval}
              onChange={(e) => setSubmitForApproval(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-forest-300 text-forest-600 focus:ring-forest-500 cursor-pointer"
            />
            <label htmlFor="submit-for-approval" className="cursor-pointer space-y-0.5">
              <p className="text-sm font-semibold text-forest-800">Submit for Approval</p>
              <p className="text-[11px] text-forest-500">
                Project will be sent to your admin for review before going live.
              </p>
            </label>
          </div>
        </div>

        {/* ── Footer ──────────────────────────────── */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream-200 bg-cream-100/60 shrink-0">
          <button
            onClick={handleClose}
            className="px-5 py-2 text-sm font-medium text-forest-600 bg-cream-200 hover:bg-cream-300 rounded-full transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-semibold text-white bg-forest-900 hover:bg-forest-800 rounded-full transition-colors shadow-sm"
          >
            {submitForApproval ? 'Submit for Approval' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};
