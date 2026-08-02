import { DashboardData } from "../types/dashboard";

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    return {
      stats: [
        {
          id: "1",
          title: "Active Projects",
          value: 4,
        },
        {
          id: "2",
          title: "Task Completed",
          value: 2,
        },
        {
          id: "3",
          title: "Active Interns",
          value: 60,
        },
        {
          id: "4",
          title: "Scheduled Meetings",
          value: 3,
        },
      ],

      projects: [
        {
          id: "1",
          name: "Management Project",
          frontend: 80,
          backend: 60,
          cyberChecks: 30,
        },
        {
          id: "2",
          name: "School App Project",
          frontend: 80,
          backend: 60,
          cyberChecks: 30,
        },
        {
          id: "3",
          name: "School ERP Project",
          frontend: 80,
          backend: 60,
          cyberChecks: 30,
        },
        {
          id: "4",
          name: "Intern Project",
          frontend: 80,
          backend: 60,
          cyberChecks: 30,
        },
      ],

      schedule: [
        {
          id: "1",
          time: "10:30 AM",
          title: "Peer review and design discussion",
          completed: false,
        },
        {
          id: "2",
          time: "11:00 AM - 12:30 PM",
          title: "Read the case study and user interview report",
          completed: false,
        },
        {
          id: "3",
          time: "1:30 PM",
          title: "Stand-up and get ready for the designs",
          completed: false,
        },
        {
          id: "4",
          time: "2:30 PM",
          title: "Stakeholder meeting with PM",
          completed: false,
        },
        {
          id: "5",
          time: "3:15 PM",
          title: "User flow presentation",
          completed: false,
        },
      ],
    };
  },
};