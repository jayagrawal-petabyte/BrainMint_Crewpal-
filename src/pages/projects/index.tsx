import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Plus, Search, User, Star, ArrowUpDown, Filter } from 'lucide-react';
import { useProjectStore } from '../../store/projects';
import type { ProjectStatus, ProjectSortKey } from '../../types/project';

export const Projects = () => {
  const [searchInput, setSearchInput] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjCategory, setNewProjCategory] = useState('Development');

  const {
    filter,
    setSearch,
    setStatusFilter,
    setStarredOnly,
    setSortBy,
    toggleStarProject,
    addProject,
    getFilteredProjects,
    resetFilter,
  } = useProjectStore();

  const filteredProjects = getFilteredProjects();

  const handleSearch = (val: string) => {
    setSearchInput(val);
    setSearch(val);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    addProject({
      name: newProjName,
      owner: 'Jay Agarwal', // Default to current owner context
      description: newProjDesc,
      category: newProjCategory,
      status: 'on_track',
    });

    setNewProjName('');
    setNewProjDesc('');
    setNewProjCategory('Development');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Title + New Project Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-forest-900">Projects</h1>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : 'New Project'}
        </Button>
      </div>

      {/* Add New Project Inline Form */}
      {showAddForm && (
        <Card className="border-forest-300 bg-cream-50/50 p-5 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <h3 className="text-sm font-bold text-forest-900 uppercase">Create New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name"
                placeholder="Enter project name"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                required
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-forest-700">Category</label>
                <select
                  value={newProjCategory}
                  onChange={(e) => setNewProjCategory(e.target.value)}
                  className="w-full rounded-full border border-forest-200 bg-white px-4 py-2.5 text-sm text-forest-800 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
                >
                  <option value="Development">Development</option>
                  <option value="Management">Management</option>
                  <option value="Design">Design</option>
                  <option value="HR / Recruitment">HR / Recruitment</option>
                </select>
              </div>
            </div>
            <Input
              label="Description"
              placeholder="Brief description about the project"
              value={newProjDesc}
              onChange={(e) => setNewProjDesc(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Project
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Advanced Filters & Sorting Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-cream-50 p-4 rounded-2xl border border-cream-200">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Search projects by name..."
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-forest-400" />}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-forest-400" />
          <select
            value={filter.status}
            onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
            className="rounded-full border border-forest-200 bg-white px-3 py-2 text-xs text-forest-800 focus:outline-none cursor-pointer"
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            filter.starredOnly
              ? 'bg-rose-300 text-forest-900 border-rose-400 shadow-sm'
              : 'bg-white text-forest-750 border-forest-200 hover:bg-cream-100'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${filter.starredOnly ? 'fill-rose-700 text-rose-700' : 'text-forest-400'}`} />
          Starred Only
        </button>

        {/* Sorting Selection */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-forest-400" />
          <select
            value={filter.sortBy}
            onChange={(e) => setSortBy(e.target.value as ProjectSortKey)}
            className="rounded-full border border-forest-200 bg-white px-3 py-2 text-xs text-forest-800 focus:outline-none cursor-pointer"
          >
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(filter.status !== 'all' || filter.starredOnly || filter.search !== '') && (
          <button
            onClick={() => {
              setSearchInput('');
              resetFilter();
            }}
            className="text-xs text-rose-600 hover:text-rose-800 font-semibold cursor-pointer py-1"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Project list rendering */}
      <Card noPadding className="overflow-hidden border-olive-200">
        {/* Header bar */}
        <div className="bg-rose-300 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-xs tracking-wider text-forest-900 uppercase">PROJECT INFO</span>
          </div>
          <div className="flex items-center gap-8 text-forest-900 font-bold text-xs tracking-wider uppercase">
            <span className="hidden sm:inline w-24 text-center">STATUS</span>
            <span className="w-10 text-center">FAV</span>
          </div>
        </div>

        {/* Rows */}
        {filteredProjects.map((project) => {
          const statusColors =
            project.status === 'on_track' ? 'bg-olive-200 text-forest-900 border-olive-350' :
            project.status === 'delayed' ? 'bg-rose-200 text-rose-900 border-rose-350' :
            'bg-cream-200 text-forest-755 border-cream-350';

          return (
            <div
              key={project.id}
              className="flex items-center justify-between px-5 py-4 border-b border-olive-100 last:border-b-0 bg-olive-50/50 hover:bg-olive-100/50 transition-colors"
            >
              {/* Project main info */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-cream-200 text-forest-600 flex items-center justify-center shrink-0 border border-cream-300 font-bold">
                  <User className="w-4 h-4 text-forest-500" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-forest-900 truncate">{project.name}</p>
                    {project.category && (
                      <span className="text-[10px] bg-forest-50 text-forest-600 border border-forest-100 rounded px-1.5 font-medium">
                        {project.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-forest-400 truncate">Lead: {project.owner}</p>
                  {project.description && (
                    <p className="text-xs text-forest-500 italic mt-0.5 max-w-md truncate">{project.description}</p>
                  )}
                </div>
              </div>

              {/* Status & Favorites Action Column */}
              <div className="flex items-center gap-8 shrink-0">
                <span className={`hidden sm:inline text-center text-[10px] font-bold px-2.5 py-0.5 rounded-full border w-24 select-none ${statusColors}`}>
                  {project.status.replace('_', ' ').toUpperCase()}
                </span>
                
                {/* Star icon toggle */}
                <button
                  onClick={() => toggleStarProject(project.id)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-cream-200 transition-colors text-forest-400 hover:text-rose-500 cursor-pointer"
                  title={project.isStarred ? 'Unstar Project' : 'Star Project'}
                >
                  <Star
                    className={`w-5 h-5 transition-transform active:scale-125 ${
                      project.isStarred ? 'fill-rose-350 text-rose-500' : 'text-forest-400'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 space-y-2">
            <p className="text-3xl">📁</p>
            <p className="text-forest-700 font-bold">No projects matched your criteria</p>
            <p className="text-forest-450 text-xs">Try clearing filters or create a new project above.</p>
          </div>
        )}
      </Card>
    </div>
  );
};
