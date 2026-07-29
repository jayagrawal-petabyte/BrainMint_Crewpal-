import { Bell, Search, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-cream-100 border-b border-cream-200 h-16 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search Input */}
      <div className="flex items-center gap-2 bg-cream-50 border border-cream-200 rounded-full px-4 py-2 w-72">
        <Search className="w-4 h-4 text-forest-400 shrink-0" />
        <input
          type="text"
          placeholder="Global Search..."
          className="bg-transparent text-xs text-forest-800 placeholder:text-forest-400 outline-none w-full"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full text-forest-600 hover:bg-cream-200 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-cream-200">
          <div className="w-8 h-8 rounded-full bg-forest-700 text-white flex items-center justify-center">
            <User className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-forest-800">BrainMint Workspace</span>
        </div>
      </div>
    </header>
  );
};
