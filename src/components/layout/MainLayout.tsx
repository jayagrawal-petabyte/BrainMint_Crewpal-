import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex bg-Beige">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};