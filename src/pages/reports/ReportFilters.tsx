import { Search } from "lucide-react";

interface ReportFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  project: string;
  setProject: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  availableProjects?: string[];
}

const ReportFilters = ({
  search,
  setSearch,
  project,
  setProject,
  status,
  setStatus,
  availableProjects = [],
}: ReportFiltersProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
          />
        </div>

        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
        >
          <option value="All">All Projects</option>
          {availableProjects.map((pName) => (
            <option key={pName} value={pName}>
              {pName}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
};

export default ReportFilters;