import AdminUsuarios from "./AdminUsuarios";
import AdminPeliculas from "./AdminPeliculas";
import AdminAgregarPelicula from "./AdminAgregarPelicula";
import AdminEditarPelicula from "./AdminEditarPelicula";

export default function DashboardContent({ section }) {
  return (
    <div className="w-full p-6">
      {section === "usuarios" && <AdminUsuarios />}
      {section === "peliculas" && <AdminPeliculas />}
      {section === "agregar" && <AdminAgregarPelicula />}
      {section === "editar" && <AdminEditarPelicula />}

      {/* Mensaje por defecto */}
      {!section && (
        <div className="text-gray-600 text-center py-10">
          <h2 className="text-xl font-semibold">Panel de Administración</h2>
          <p>Selecciona una sección en el menú</p>
        </div>
      )}
    </div>
  );
}
