import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Search } from "lucide-react";

import { Sidebar } from "./Sidebar";
import { GlobalSearch } from "../modals/GlobalSearch";
import { ToastContainer } from "../ui/Toast";

export const MainLayout = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  return (
    <div className="min-h-screen flex bg-Beige">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      <ToastContainer />

      <GlobalSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-rose-300 hover:scale-105 border border-rose-400 text-forest-900 hover:shadow-lg transition-all duration-200 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
        title="Global Search (Ctrl+K)"
      >
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
};