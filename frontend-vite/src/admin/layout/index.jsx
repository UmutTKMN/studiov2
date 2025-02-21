import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

const AdminLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
        <Sidebar />
        <Header />
      <main className="lg:pl-72 py-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
