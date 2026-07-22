import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-Beige w-full overflow-auto">
      <div className="max-w-[1440px] mx-auto w-full">
        <Outlet />
      </div>
    </div>
  );
};
