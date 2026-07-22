import { Menu, User } from 'lucide-react';

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-5 py-4">
      {/* Hamburger Menu */}
      <button className="p-1 text-forest-700 hover:text-forest-900 transition-colors">
        <Menu className="w-6 h-6" strokeWidth={2.5} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-1.5">
        <span className="text-xl font-bold text-forest-700 tracking-tight">✉ CREWPAL</span>
        <span className="text-xs text-forest-500 block -mt-0.5">for BrainMint Intern</span>
      </div>

      {/* Profile Icon */}
      <button className="w-10 h-10 rounded-full bg-forest-700 text-cream-100 flex items-center justify-center hover:bg-forest-800 transition-colors">
        <User className="w-5 h-5" />
      </button>
    </header>
  );
};
