import { NavLink } from "react-router-dom";
import { Users, Film, PlusCircle, Edit, Home, Monitor, ChevronDown, ChevronUp, Ticket } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../Context/ThemeContext"; // <-- Importamos ThemeContext

const NavDropdown = ({ children, title, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors text-gray-300 hover:bg-gray-800 hover:text-cyan-400 focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <div className="pl-4 border-l border-gray-700 ml-5 flex flex-col gap-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function DashboardNav() {
  const { theme } = useTheme(); // <-- Extraemos theme

  // Ajustes de fondo y texto según el tema
  const asideBg = theme === "dark" ? "bg-gray-950/95 border-gray-800 text-gray-300" : "bg-gray-100 border-gray-300 text-gray-800";
  const linkInactive = theme === "dark" ? "text-gray-400 hover:bg-gray-800 hover:text-cyan-400" : "text-gray-700 hover:bg-gray-200 hover:text-cyan-600";
  const linkActive = theme === "dark" ? "bg-cyan-900/40 text-cyan-300 border-l-4 border-cyan-500 shadow-lg shadow-cyan-900/50" : "bg-cyan-200/40 text-cyan-700 border-l-4 border-cyan-500 shadow-md shadow-cyan-200/50";

  const linkBase = "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all text-sm";
  const getLinkClass = ({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`;

  return (
    <aside className={`w-64 p-6 hidden md:block shadow-2xl font-sans ${asideBg}`}>

      {/* LOGO / TÍTULO */}
      <div className="mb-10 pt-2 border-b border-cyan-500/30 pb-4">
        <div className="flex items-center justify-center gap-2">
          <Monitor className={`w-8 h-8 text-cyan-400 animate-pulse`} />
          <h2 className="text-2xl font-extrabold tracking-widest">
            ADMIN
          </h2>
        </div>
        <p className={theme === "dark" ? "text-gray-500 text-xs text-center mt-1" : "text-gray-600 text-xs text-center mt-1"}>Control Total</p>
      </div>

      {/* NAV PRINCIPAL */}
      <nav className="flex flex-col gap-2">
        <NavLink to="/admin" end className={getLinkClass}>
          <Home className="w-5 h-5" /> Inicio
        </NavLink>

        <NavLink to="/admin/usuarios" className={getLinkClass}>
          <Users className="w-5 h-5" /> Gestión de Usuarios
        </NavLink>

        <hr className="my-3 border-gray-700" />
        <span className={theme === "dark" ? "text-xs uppercase text-gray-500 font-bold ml-4 mb-1 tracking-wider" : "text-xs uppercase text-gray-600 font-bold ml-4 mb-1 tracking-wider"}>
          Contenido
        </span>

        {/* Grupo Películas */}
        <NavDropdown title="Películas" icon={Film}>
          <NavLink to="/admin/peliculas" end className={getLinkClass}>
            <Film className="w-4 h-4" /> Listar/Buscar
          </NavLink>
          <NavLink to="/admin/peliculas/agregar" className={getLinkClass}>
            <PlusCircle className="w-4 h-4" /> Agregar Nueva
          </NavLink>
          <NavLink to="/admin/peliculas" className={getLinkClass}>
            <Edit className="w-4 h-4" /> Editar / Eliminar
          </NavLink>
        </NavDropdown>

        {/* Grupo Cupones */}
        <NavDropdown title="Cupones" icon={Ticket}>
          <NavLink to="/admin/cupones/generar" className={getLinkClass}>
            <PlusCircle className="w-4 h-4" /> Generar Nuevo
          </NavLink>
          <NavLink to="/admin/cupones/estados" className={getLinkClass}>
            <Edit className="w-4 h-4" /> Activar / Desactivar
          </NavLink>
        </NavDropdown>
      </nav>
    </aside>
  );
}
