import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Card } from '../../components/common/Card';
import { Plus, Search, User } from 'lucide-react';

const projects = [
  { name: 'School Mobile App', owner: 'Jay Agarwal' },
  { name: 'Management Project', owner: 'Jay Agarwal' },
  { name: 'School ERP Project', owner: 'Jay Agarwal' },
  { name: 'Intern Management Project', owner: 'Jay Agarwal' },
];

export const Projects = () => {
  return (
    <div className="space-y-6">
      {/* Page Title + Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-forest-900">Project</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-forest-200">
        {[
          { name: 'Overview', count: null, active: true },
          { name: 'Tasks', count: 7 },
          { name: 'Updates', count: 2 },
          { name: 'Meetings', count: '99+' },
        ].map((tab) => (
          <button
            key={tab.name}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              tab.active
                ? 'text-forest-900 border-b-2 border-forest-700'
                : 'text-forest-400 hover:text-forest-600'
            }`}
          >
            {tab.name}
            {tab.count && (
              <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-forest-100 text-forest-700 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search + New Project */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Input
            placeholder="Enter project name"
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} size="sm">
          New Project
        </Button>
      </div>

      {/* Project List */}
      <Card noPadding className="overflow-hidden border-olive-200">
        {/* Table Header */}
        <div className="bg-rose-300 px-4 py-3 flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 rounded border-forest-300 accent-forest-700" />
          <span className="font-semibold text-sm text-forest-900 uppercase">PROJECT</span>
        </div>

        {/* Project Rows */}
        {projects.map((project, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-4 border-b border-olive-100 last:border-b-0 bg-olive-50 hover:bg-olive-100 transition-colors cursor-pointer"
          >
            <input type="checkbox" className="w-4 h-4 rounded border-forest-300 accent-forest-700" />
            <div className="w-9 h-9 rounded-full bg-cream-200 text-forest-400 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="font-medium text-sm text-forest-900">{project.name}</p>
              <p className="text-xs text-forest-400">{project.owner}</p>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
};
