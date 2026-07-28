import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { GlobalSearch } from './components/modals/GlobalSearch';
import { Search } from 'lucide-react';

export const App = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Floating Search Trigger (Ctrl+K shortcut indicator) */}
      <button
        onClick={() => setIsSearchOpen(true)}
        className="fixed bottom-24 right-6 z-40 bg-rose-300 hover:scale-105 border border-rose-400 text-forest-900 hover:shadow-lg transition-all duration-200 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer"
        title="Global Search (Ctrl+K)"
      >
        <Search className="w-5 h-5" />
      </button>
    </>
  );
};

export default App;
