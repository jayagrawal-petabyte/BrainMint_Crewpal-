import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Plus, Search, User, Star, ArrowUpDown, Filter, MoreVertical, Clock } from 'lucide-react';
import { useProjectStore } from '../../store/projects';
import { useToast } from '../../hooks/useToast';
import { ProjectBadge } from '../../components/ui/ProjectBadge';
import { ProjectActionsMenu } from '../../components/ui/ProjectActionsMenu';
import { CreateProjectModal } from '../../components/modals/CreateProjectModal';
import { EditProjectModal } from '../../components/modals/EditProjectModal';
import { DeleteConfirmModal } from '../../components/modals/DeleteConfirmModal';
import { ReviewApprovalModal } from '../../components/modals/ReviewApprovalModal';
import type { PendingApproval } from '../../components/modals/ReviewApprovalModal';
import type { ProjectStatus, ProjectSortKey, Project } from '../../types/project';

export const Projects = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(new Set());
  const [actionMenuProjectId, setActionMenuProjectId] = useState<string | null>(null);

  // Pending approval state
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      id: 'pending-1',
      name: 'Marketing Campaign',
      owner: 'Aastha Sharma',
      requestedAt: '2026-08-01',
      description: 'A multi-channel digital marketing campaign for Q3 product launches.',
    },
    {
      id: 'pending-2',
      name: 'Q4 Planning',
      owner: 'Rahul Verma',
      requestedAt: '2026-08-01',
      description: 'Strategic planning and resource allocation for Q4 initiatives.',
    },
  ]);
  const [reviewApproval, setReviewApproval] = useState<PendingApproval | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Store bindings
  const projects = useProjectStore((s) => s.projects);
  const isLoading = useProjectStore((s) => s.isLoading);
  const error = useProjectStore((s) => s.error);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const getFilteredProjects = useProjectStore((s) => s.getFilteredProjects);

  const {
    filter,
    setSearch,
    setStatusFilter,
    setStarredOnly,
    setSortBy,
    toggleStarProject,
    deleteProject,
    resetFilter,
  } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const toast = useToast();
  // Re-computed on every render; will reflect latest projects + filter state.
  const filteredProjects = getFilteredProjects();
  // `projects` referenced here to keep the dependency linter satisfied and
  // ensure this line re-runs whenever any project field (including isStarred) changes.
  void projects;

  // ── Search ───────────────────────────────────────────────
  const handleSearch = (val: string) => {
    setSearchInput(val);
    setSearch(val);
  };

  // ── Selection ────────────────────────────────────────────
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedProjectIds.size === filteredProjects.length) {
      setSelectedProjectIds(new Set());
    } else {
      setSelectedProjectIds(new Set(filteredProjects.map((p) => p.id)));
    }
  };

  // ── Edit ─────────────────────────────────────────────────
  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setShowEditModal(true);
    setActionMenuProjectId(null);
  };

  // ── Delete (with confirmation) ────────────────────────────
  const handleDeleteRequest = (project: Project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
    setActionMenuProjectId(null);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete.id);
    // Clean up stale selection
    setSelectedProjectIds((prev) => {
      const next = new Set(prev);
      next.delete(projectToDelete.id);
      return next;
    });
    toast.success('Project deleted');
    setProjectToDelete(null);
    setShowDeleteModal(false);
  };

  // ── Review approval ──────────────────────────────────────
  const handleReviewClick = (approval: PendingApproval) => {
    setReviewApproval(approval);
    setShowReviewModal(true);
  };

  const handleApprove = (id: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  const handleReject = (id: string) => {
    setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-5">
      {error && (
        <div role="alert" className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="py-8 text-center text-xs text-forest-600 font-medium animate-pulse">
          Loading project data from backend...
        </div>
      )}

      {/* Page Title + New Project Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-forest-900">Projects</h1>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          onClick={() => setShowCreateModal(true)}
        >
          New Project
        </Button>
      </div>

      {/* Pending Approval Section */}
      {pendingApprovals.length > 0 && (
        <Card className="border-rose-200 bg-rose-50/40 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-7 h-7 rounded-full bg-rose-200 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-rose-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-forest-900">Pending Approvals</h3>
              <p className="text-xs text-forest-500">{pendingApprovals.length} project{pendingApprovals.length !== 1 ? 's' : ''} awaiting approval</p>
            </div>
          </div>
          <div className="space-y-2">
            {pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-rose-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-cream-200 flex items-center justify-center text-[10px] font-bold text-forest-600">
                    {approval.owner.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-forest-900">{approval.name}</p>
                    <p className="text-[11px] text-forest-500">Requested by {approval.owner}</p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs px-3 py-1.5"
                  onClick={() => handleReviewClick(approval)}
                >
                  Review
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Advanced Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-cream-50 p-3 rounded-xl border border-cream-200">
        {/* Search */}
        <div className="flex-1 min-w-[180px]">
          <Input
            placeholder="Search projects..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-forest-400" />}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-forest-400" />
          <select
            value={filter.status}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="rounded-full border border-forest-200 bg-white px-2.5 py-1.5 text-xs text-forest-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="on_track">On Track</option>
            <option value="delayed">Delayed</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Favorites Filter */}
        <button
          onClick={() => setStarredOnly(!filter.starredOnly)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            filter.starredOnly
              ? 'bg-rose-300 text-forest-900 border-rose-400 shadow-sm'
              : 'bg-white text-forest-750 border-forest-200 hover:bg-cream-100'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${filter.starredOnly ? 'fill-rose-700 text-rose-700' : 'text-forest-400'}`} />
          Starred
        </button>

        {/* Sorting */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-forest-400" />
          <select
            value={filter.sortBy}
            onChange={(e) => setSortBy(e.target.value as ProjectSortKey)}
            className="rounded-full border border-forest-200 bg-white px-2.5 py-1.5 text-xs text-forest-800 focus:outline-none cursor-pointer"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>

        {/* Reset */}
        {(filter.status !== 'all' || filter.starredOnly || filter.search !== '') && (
          <button
            onClick={() => {
              setSearchInput('');
              resetFilter();
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* Project list */}
      <Card noPadding className="overflow-hidden border-olive-200">
        {/* Header bar */}
        <div className="bg-rose-300 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedProjectIds.size === filteredProjects.length && filteredProjects.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 rounded border-forest-300 text-forest-600 focus:ring-forest-500 cursor-pointer self-center"
            />
            <span className="font-bold text-xs tracking-wider text-forest-900 uppercase">PROJECT INFO</span>
          </div>
          <div className="flex items-center gap-4 text-forest-900 font-bold text-xs tracking-wider uppercase">
            <span className="hidden lg:inline w-24 text-center">TECH STACK</span>
            <span className="hidden md:inline w-16 text-center">STATUS</span>
            <span className="hidden md:inline w-16 text-center">PROGRESS</span>
            <span className="w-8 text-center">FAV</span>
            <span className="w-8 text-center"></span>
          </div>
        </div>

        {/* Rows */}
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(`/projects/${project.id}`)}
                className="flex items-center justify-between px-4 py-3 border-b border-olive-100 last:border-b-0 bg-olive-50/20 hover:bg-olive-100/40 transition-colors duration-150 group cursor-pointer"
              >
                {/* Checkbox + Info */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProjectIds.has(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-forest-300 text-forest-600 focus:ring-forest-500 cursor-pointer shrink-0 self-center"
                  />
                  <div className="w-9 h-9 rounded-full bg-cream-200 text-forest-600 flex items-center justify-center shrink-0 border border-cream-300 font-bold">
                    <User className="w-4 h-4 text-forest-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-forest-900 truncate group-hover:text-forest-700 transition-colors">{project.name}</p>
                      {project.category && (
                        <span className="text-[10px] bg-forest-50 text-forest-600 border border-forest-100 rounded px-1.5 font-medium shrink-0">
                          {project.category}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-forest-500 truncate">Lead: {project.owner}</p>
                    {project.description && (
                      <p className="text-[11px] text-forest-400 italic mt-0.5 max-w-md truncate">{project.description}</p>
                    )}
                  </div>
                </div>

                {/* Right side columns */}
                <div className="flex items-center gap-4 shrink-0">
                  {/* Tech Stack */}
                  <div className="hidden lg:block w-24 text-center">
                    <span className="text-xs text-forest-600 font-medium truncate block">
                      {project.techStack || '-'}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="hidden md:block w-16 text-center">
                    <ProjectBadge status={project.status} size="sm" />
                  </div>

                  {/* Progress */}
                  <div className="hidden md:block w-16 text-center">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cream-100 border border-cream-200">
                      <div className="w-8 h-1 bg-cream-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest-500 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-forest-600">{project.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Star */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStarProject(project.id);
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors text-forest-400 hover:text-rose-500 cursor-pointer"
                    title={project.isStarred ? 'Unstar Project' : 'Star Project'}
                  >
                    <Star
                      className={`w-4 h-4 transition-transform active:scale-125 ${
                        project.isStarred
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-forest-400'
                      }`}
                    />
                  </button>

                  {/* Actions menu */}
                  <div className="relative w-8 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActionMenuProjectId(actionMenuProjectId === project.id ? null : project.id);
                      }}
                      className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors text-forest-400 hover:text-forest-700 cursor-pointer"
                      title="More options"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                    {actionMenuProjectId === project.id && (
                      <ProjectActionsMenu
                        isOpen={true}
                        onClose={() => setActionMenuProjectId(null)}
                        onEdit={() => handleEditProject(project)}
                        onDelete={() => handleDeleteRequest(project)}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16 space-y-2"
            >
              <p className="text-3xl">📁</p>
              <p className="text-forest-700 font-bold">No projects matched your criteria</p>
              <p className="text-forest-450 text-xs">Try clearing filters or create a new project above.</p>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Edit Project Modal */}
      {selectedProject && (
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
        />
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setProjectToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          taskTitle={projectToDelete.name}
        />
      )}

      {/* Review Approval Modal */}
      <ReviewApprovalModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReviewApproval(null);
        }}
        approval={reviewApproval}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
};
