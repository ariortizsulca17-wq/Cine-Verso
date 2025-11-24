import { Outlet } from "react-router-dom";
import DashboardNav from "../Componentes/Dashboard/DashboardNav";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      
      {/* 📌 MENÚ LATERAL */}
      <DashboardNav />

      {/* 📌 CONTENIDO CAMBIANTE */}
      <div className="flex-1 p-10">
        <Outlet /> 
      </div>

    </div>
  );
}
