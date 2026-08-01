import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { DashboardData } from "../types/dashboard";

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await dashboardService.getDashboard();

      setDashboard(data);
    } catch (err) {
      setError("Failed to load dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    dashboard,
    loading,
    error,
  };
};