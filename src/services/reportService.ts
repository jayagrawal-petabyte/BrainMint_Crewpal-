export interface ReportSummary {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  pendingProjects: number;
}

export interface ProjectProgress {
  name: string;
  progress: number;
}

export interface MonthlyReport {
  month: string;
  completed: number;
  pending: number;
}

export interface ReportData {
  summary: ReportSummary;
  projectProgress: ProjectProgress[];
  monthlyReports: MonthlyReport[];
}

class ReportService {
  async getReports(): Promise<ReportData> {
    return {
      summary: {
        totalProjects: 12,
        completedProjects: 8,
        activeProjects: 3,
        pendingProjects: 1,
      },
      projectProgress: [
        {
          name: "CrewPal",
          progress: 90,
        },
        {
          name: "School ERP",
          progress: 70,
        },
        {
          name: "BrainMint",
          progress: 55,
        },
      ],
      monthlyReports: [
        {
          month: "Jan",
          completed: 5,
          pending: 2,
        },
        {
          month: "Feb",
          completed: 8,
          pending: 1,
        },
        {
          month: "Mar",
          completed: 7,
          pending: 3,
        },
        {
          month: "Apr",
          completed: 9,
          pending: 2,
        },
      ],
    };
  }
}

const reportService = new ReportService();

export default reportService;