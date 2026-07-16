import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BottomNav } from './BottomNav';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream-100 w-full">
      {/* Top Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-5 pb-28">
        <Outlet />
      </main>
      
      {/* Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};
