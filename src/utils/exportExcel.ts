import * as XLSX from "xlsx";

interface ProjectProgress {
  name: string;
  progress: number;
}

export const exportReportExcel = (
  projects: ProjectProgress[]
) => {
  if (!projects || projects.length === 0) {
    throw new Error("No report data available to export.");
  }

  const data = projects.map((project) => {
    let status = "Pending";

    if (project.progress === 100) {
      status = "Completed";
    } else if (project.progress > 0) {
      status = "Active";
    }

    return {
      Project: project.name,
      Progress: `${project.progress}%`,
      Status: status,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Project Progress"
  );

  XLSX.writeFile(
    workbook,
    "CrewPal-Reports.xlsx"
  );
};