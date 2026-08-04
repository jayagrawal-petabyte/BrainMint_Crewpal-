import { useEffect, useState } from "react";
import ReportCard from "./ReportCard";import  ReportFilters  from "./ReportFilters";
import  ReportCharts  from "./ReportCharts";
import  ExportButtons  from "./ExportButtons";
import reportService, { ReportData } from "../../services/reportService";

const Reports = () => {  const [reports, setReports] = useState<ReportData | null>(null);

  const [search, setSearch] = useState("");
  const [project, setProject] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
  void loadReports();
}, []);

  const loadReports = async () => {
    const data = await reportService.getReports();
    setReports(data);
  };

  const exportPDF = () => {
    alert("PDF Export will be integrated.");
  };

  const exportExcel = () => {
    alert("Excel Export will be integrated.");
  };

  if (!reports) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex h-[70vh] items-center justify-center">
  <p className="text-lg text-gray-500">
    Loading reports...
  </p>
</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3D7] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1B1B1B]">
            Analytics & Reports
          </h1>

          <p className="text-gray-500 mt-1">
            View project insights and generate reports.
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

      <ReportCharts
        data={reports.monthlyReports}
      />

      {/* Progress Table */}

      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg">
            Project Progress
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Project</th>
              <th className="text-left p-4">Progress</th>
            </tr>
          </thead>

          <tbody>
            {reports.projectProgress.map((project) => (
              <tr
                key={project.name}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-4">
                  {project.name}
                </td>

                <td className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-[#355E3B] h-3 rounded-full"
                      style={{
                        width: `${project.progress}%`,
                      }}
                    />
                  </div>

                  <span className="text-sm text-gray-500">
                    {project.progress}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;