import { Outlet } from "react-router-dom";
import DashboardNav from "../Componentes/Dashboard/DashboardNav";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* 📌 MENÚ LATERAL */}
      <div className="hidden md:block md:w-64">
        <DashboardNav />
      </div>

      {/* 📌 CONTENIDO */}
      <div className="flex-1 p-4 sm:p-6 md:p-10 overflow-x-hidden">
        <Outlet />
      </div>

    </div>
  );
}
