// src/Componentes/DashboardAdmi/DashboardLayout.jsx
import { Outlet } from "react-router-dom"; // 👈 Nueva importación
import DashboardNav from "./DashboardNav";
// import DashboardContent from "./DashboardContent"; // 🚫 Ya no es necesario importar esto

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* 📌 NAV LATERAL */}
      <DashboardNav />

      {/* 📌 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* 💡 SOLUCIÓN: Outlet renderiza el contenido de la ruta anidada */}
        <Outlet /> 
      </main>
    </div>
  );
}