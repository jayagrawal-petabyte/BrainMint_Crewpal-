import { useEffect, useMemo, useState } from "react";
import ReportCard from "./ReportCard";
import ReportFilters from "./ReportFilters";
import ReportCharts from "./ReportCharts";
import ExportButtons from "./ExportButtons";
import { generateReportData, ReportData } from "../../services/reportService";
import { useProjectStore } from "../../store/projects";
import { useTaskStore } from "../../store/tasks";
import { exportReportPDF } from "../../utils/exportPDF";
import { exportReportExcel } from "../../utils/exportExcel";

const Reports = () => {
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();

  const [search, setSearch] = useState("");
  const [project, setProject] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    void fetchProjects();
    void fetchTasks();
  }, [fetchProjects, fetchTasks]);

  // Compute reports dynamically from real projects and tasks
  const reports: ReportData = useMemo(() => {
    return generateReportData(projects, tasks);
  }, [projects, tasks]);

  const availableProjects = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.name).filter(Boolean)));
  }, [projects]);

  const exportPDF = async () => {
    try {
      await exportReportPDF();
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Unable to export the report as PDF.");
    }
  };

  const exportExcel = () => {
    try {
      exportReportExcel(filteredProjects);
    } catch (error) {
      console.error("Excel export failed:", error);
      alert("Unable to export the report as Excel.");
    }
  };

  /*
   * Filter project progress based on:
   * 1. Search
   * 2. Project
   * 3. Status
   */
  const filteredProjects = useMemo(() => {
    return reports.projectProgress.filter((item) => {
      // Search filter
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      // Project filter
      const matchesProject =
        project === "All" || item.name === project;

      // Derive status from progress
      let itemStatus = "Pending";

      if (item.progress === 100) {
        itemStatus = "Completed";
      } else if (item.progress > 0) {
        itemStatus = "Active";
      }

      // Status filter
      const matchesStatus =
        status === "All" || itemStatus === status;

      return (
        matchesSearch &&
        matchesProject &&
        matchesStatus
      );
    });
  }, [reports.projectProgress, search, project, status]);

  return (
    <div
      id="reports-content"
      className="min-h-screen bg-[#F7F3D7] p-6 animate-in fade-in duration-300"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B1B1B]">
            Analytics & Reports
          </h1>

          <p className="text-gray-500 mt-1">
            View real-time project insights and generate reports.
          </p>
        </div>

        <ExportButtons
          onExportPDF={exportPDF}
          onExportExcel={exportExcel}
        />
      </div>

      {/* Filters */}
      <div className="mb-6">
        <ReportFilters
          search={search}
          setSearch={setSearch}
          project={project}
          setProject={setProject}
          status={status}
          setStatus={setStatus}
          availableProjects={availableProjects}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <ReportCard
          title="Total Projects"
          value={reports.summary.totalProjects}
        />

        <ReportCard
          title="Completed"
          value={reports.summary.completedProjects}
          color="#D9E7C4"
        />

        <ReportCard
          title="Active"
          value={reports.summary.activeProjects}
          color="#F5D9A8"
        />

        <ReportCard
          title="Pending"
          value={reports.summary.pendingProjects}
          color="#F5C8C8"
        />
      </div>

      {/* Charts */}
      <ReportCharts data={reports.monthlyReports} />

      {/* Project Progress Table */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">
            Project Progress
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredProjects.length} of{" "}
            {reports.projectProgress.length} projects
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">
                  Project
                </th>

                <th className="text-left p-4">
                  Progress
                </th>

                <th className="text-left p-4">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.length > 0 ? (
                filteredProjects.map((item) => {
                  let itemStatus = "Pending";

                  if (item.progress === 100) {
                    itemStatus = "Completed";
                  } else if (item.progress > 0) {
                    itemStatus = "Active";
                  }

                  return (
                    <tr
                      key={item.name}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="p-4 font-medium">
                        {item.name}
                      </td>

                      <td className="p-4">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[#355E3B] h-3 rounded-full transition-all duration-300"
                            style={{
                              width: `${item.progress}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm text-gray-500">
                          {item.progress}%
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            itemStatus === "Completed"
                              ? "bg-[#D9E7C4] text-[#355E3B]"
                              : itemStatus === "Active"
                              ? "bg-[#F5D9A8] text-[#7A551F]"
                              : "bg-[#F5C8C8] text-[#8B3030]"
                          }`}
                        >
                          {itemStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="p-10 text-center text-gray-500"
                  >
                    No projects found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;