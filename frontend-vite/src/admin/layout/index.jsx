import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useState } from 'react';

const AdminLayout = () => {
  const [isCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className={`flex-1 transition-all duration-300 
        ${isCollapsed ? 'ml-[4.5rem]' : 'ml-[20rem]'}`}
      >
        <main className="p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
