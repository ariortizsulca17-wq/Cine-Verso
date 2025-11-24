import DashboardNav from "./DashboardNav";
import DashboardContent from "./DashboardContent";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">

      {/* 📌 NAV LATERAL */}
      <DashboardNav />

      {/* 📌 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 overflow-y-auto">
        <DashboardContent />
      </main>
    </div>
  );
}
