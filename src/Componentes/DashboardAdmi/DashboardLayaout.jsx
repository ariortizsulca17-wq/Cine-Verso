// src/Componentes/DashboardAdmi/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import DashboardNav from "./DashboardNav";
import { useTheme } from "../../Context/ThemeContext"; // Importamos ThemeContext

export default function DashboardLayout() {
  const { theme } = useTheme(); // Extraemos el theme

  const bgClass = theme === "dark" ? "bg-[#0B1014] text-white" : "bg-gray-100 text-gray-900";

  return (
    <div className={`flex min-h-screen ${bgClass}`}>
      {/* 📌 NAV LATERAL */}
      <DashboardNav theme={theme} />

      {/* 📌 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* 💡 Outlet renderiza el contenido de la ruta anidada */}
        <Outlet />
      </main>
    </div>
  );
}
