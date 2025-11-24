import { NavLink } from "react-router-dom";
import { FaUsers, FaFilm, FaPlusCircle, FaEdit, FaHome } from "react-icons/fa";

export default function DashboardNav() {
  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors";

  const linkInactive = "text-gray-300 hover:bg-gray-800 hover:text-cyan-400";
  const linkActive = "bg-cyan-600 text-black shadow-md";

  return (
    <aside className="w-64 bg-gray-950 border-r border-cyan-800/40 p-6 hidden md:block">
      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-cyan-400 mb-8 text-center">
        Admin Panel
      </h2>

      {/* NAV */}
      <nav className="flex flex-col gap-3">

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <FaHome /> Inicio Admin
        </NavLink>

        <NavLink
          to="/admin/usuarios"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <FaUsers /> Usuarios
        </NavLink>

        <NavLink
          to="/admin/peliculas"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <FaFilm /> Películas
        </NavLink>

        <NavLink
          to="/admin/peliculas/agregar"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <FaPlusCircle /> Agregar película
        </NavLink>

        <NavLink
          to="/admin/peliculas/editar"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          <FaEdit /> Editar / Eliminar
        </NavLink>
      </nav>
    </aside>
  );
}
