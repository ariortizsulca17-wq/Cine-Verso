import { NavLink } from "react-router-dom";
import { Users, Film, PlusCircle, Edit, Home, Monitor, ChevronDown, ChevronUp, Ticket } from "lucide-react"; // ✨ AGREGADO: Ticket
import { useState } from "react"; // Importar useState para el menú desplegable

// Componente para manejar el estado desplegable del grupo "Películas"
const NavDropdown = ({ children, title, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors 
text-gray-300 hover:bg-gray-800 hover:text-cyan-400 focus:outline-none"
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
    // Definición de estilos mejorados
    const linkBase =
        "flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all text-sm";

    // Estilos inactivo: Más énfasis en el hover
    const linkInactive = "text-gray-400 hover:bg-gray-800 hover:text-cyan-400";

    // Estilos activo: Usa un color cian semitransparente como fondo y un borde izquierdo
    const linkActive = "bg-cyan-900/40 text-cyan-300 border-l-4 border-cyan-500 shadow-lg shadow-cyan-900/50";

    const getLinkClass = ({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`;

    return (
        <aside className="w-64 bg-gray-950/95 border-r border-gray-800 p-6 hidden md:block shadow-2xl shadow-black/50 font-sans">

            {/* 🖥️ LOGO / TÍTULO */}
            <div className="mb-10 pt-2 border-b border-cyan-500/30 pb-4">
                <div className="flex items-center justify-center gap-2">
                    <Monitor className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <h2 className="text-2xl font-extrabold text-white tracking-widest">
                        ADMIN
                    </h2>
                </div>
                <p className="text-xs text-gray-500 text-center mt-1">Control Total</p>
            </div>

            {/* 🧭 NAV PRINCIPAL */}
            <nav className="flex flex-col gap-2">

                {/* Inicio Admin */}
                <NavLink to="/admin" end className={getLinkClass}>
                    <Home className="w-5 h-5" /> Inicio
                </NavLink>

                {/* Usuarios */}
                <NavLink to="/admin/usuarios" className={getLinkClass}>
                    <Users className="w-5 h-5" /> Gestión de Usuarios
                </NavLink>

                {/* --- SEPARADOR (Mejora la jerarquía) --- */}
                <hr className="my-3 border-gray-800" />
                <span className="text-xs uppercase text-gray-500 font-bold ml-4 mb-1 tracking-wider">
                    Contenido
                </span>

                {/* Grupo de Películas (Desplegable) */}
                <NavDropdown title="Películas" icon={Film}>

                    {/* Listar Películas (Base) */}
                    <NavLink to="/admin/peliculas" end className={getLinkClass}>
                        <Film className="w-4 h-4" /> Listar/Buscar
                    </NavLink>

                    {/* Agregar Película */}
                    <NavLink to="/admin/peliculas/agregar" className={getLinkClass}>
                        <PlusCircle className="w-4 h-4" /> Agregar Nueva
                    </NavLink>

                    {/* Editar / Eliminar (General) */}
                    <NavLink to="/admin/peliculas" className={getLinkClass}>
                        <Edit className="w-4 h-4" /> Editar / Eliminar
                    </NavLink>
                </NavDropdown>

                {/* 🎁 NUEVO: Grupo de Cupones (Desplegable) */}
                <NavDropdown title="Cupones" icon={Ticket}>

                    {/* Generar Nuevo Cupón (Usando la ruta /admin/cupones/generar para tu componente) */}
                    <NavLink to="/admin/cupones/generar" className={getLinkClass}>
                        <PlusCircle className="w-4 h-4" /> Generar Nuevo
                    </NavLink>

                    {/* Gestión de Cupones (Ruta base para listado/gestión) */}
                    <NavLink to="/admin/cupones" className={getLinkClass}>
                        <Edit className="w-4 h-4" /> Activar / Desactivar
                    </NavLink>

                </NavDropdown>

            </nav>
        </aside>
    );
}