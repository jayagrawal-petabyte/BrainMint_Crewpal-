import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="w-full min-h-screen bg-cream-100 font-sans">
      <Outlet />
    </div>
  );
};
