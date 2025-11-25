import { useState, useEffect, useRef } from "react"; // 💡 Importamos useRef
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext.jsx";
import { ZonaUsuario } from "./ZonaUsuario";
import PeliculasData from "../Componentes/PeliculasData.jsx";

import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSun,
  FaMoon,
  FaUserCircle,
} from "react-icons/fa";
import { ChevronDown, Search } from "lucide-react"; 

export default function Navbar({ onAbrirLogin }) {
  // 👉 Estados
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false); 
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [carritoCount, setCarritoCount] = useState(0); 
  
  // 💡 Ref para manejar el timer del dropdown
  const categoryTimerRef = useRef(null); 

  // 👉 Hooks
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  // 👉 Funciones del Menú
  const toggleMenu = () => {
      setIsOpen(!isOpen);
      setIsCategoryOpen(false); 
  };
  const closeMenu = () => {
    setIsOpen(false);
    setIsCategoryOpen(false);
  };
  const handleNavClick = () => {
    closeMenu();
  };
  const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  // ⭐ NUEVAS FUNCIONES PARA EL HOVER DEL DROPDOWN
  const handleMouseEnter = () => {
    // Si hay un timer activo (el mouse ha salido recientemente), lo cancelamos
    if (categoryTimerRef.current) {
      clearTimeout(categoryTimerRef.current);
    }
    setIsCategoryOpen(true);
  };

  const handleMouseLeave = () => {
    // Establecemos un timer para cerrar el menú después de 300ms
    categoryTimerRef.current = setTimeout(() => {
      setIsCategoryOpen(false);
    }, 300); // 300ms de gracia para hacer click
  };
  // ⭐ FIN NUEVAS FUNCIONES

  // 👉 Efecto para el Tema
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  // 🛒 Efecto para Carrito (Mantenido)
  useEffect(() => {
    const cargarCarrito = () => {
      const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarritoCount(carritoGuardado.length);
    };

    cargarCarrito();
    window.addEventListener("carritoActualizado", cargarCarrito);

    return () => {
      window.removeEventListener("carritoActualizado", cargarCarrito);
    };
  }, []);

  // 📋 Links del Dropdown de Categorías
  const categoryItems = [
    { path: "/PeliculasTops", label: "Top 10" },
    { path: "/PeliculasKids", label: "Kids / Familiar" },
    { path: "/PeliAsiaticas", label: "Asiáticas / Anime" },
    { path: "/PeliDocumentales", label: "Documentales" },
    { path: "/PeliLibros", label: "Basadas en Libros" },
  ];

  // 🎨 Clases CSS (Mantenidas)
  const iconBtn = "text-2xl hover:text-cyan-400 transition focus:outline-none";
  const navbarClasses =
    theme === "dark"
      ? "bg-gray-900 text-white shadow-lg sticky top-0 z-50 border-b border-cyan-700" 
      : "bg-white text-gray-900 shadow-md sticky top-0 z-50 border-b border-cyan-200";
  const navLinkBaseClasses = "font-medium hover:text-cyan-400 transition-colors py-4"; 
  const navLinkActiveClasses = "text-cyan-400 border-b-2 border-cyan-400"; 

  // 👉 Funciones de Búsqueda (Mantenidas)
  const manejarSubmitBusqueda = (e) => {
    e.preventDefault();
    if (busqueda.trim() !== "") {
      navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`);
      setBusqueda("");
      closeMenu();
    }
  };

  const manejarCambioBusqueda = (e) => {
    const value = e.target.value;
    setBusqueda(value);

    if (value.trim() === "") {
      setSugerencias([]);
      return;
    }

    const filtradas = PeliculasData.filter((peli) =>
      peli.titulo.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 6);

    setSugerencias(filtradas);
  };

  const seleccionarSugerencia = (titulo) => {
    setBusqueda("");
    setSugerencias([]);
    navigate(`/buscar?q=${encodeURIComponent(titulo)}`); 
  };


  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* 🎬 LOGO */}
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <span className="text-4xl text-cyan-400">🎬</span>
          <span className="font-extrabold text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
            Cineverso
          </span>
        </Link>

        {/* 🖥️ MENÚ ESCRITORIO */}
        <div className="hidden md:flex gap-10 items-center h-full"> 
          
          {/* 1. Inicio */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
                `${navLinkBaseClasses} ${
                  isActive
                    ? navLinkActiveClasses
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`
            }
          >
            Inicio
          </NavLink>


          {/* 2. ⭐ CATEGORÍAS DROPDOWN (ESCRITORIO) */}
          <div 
            className="relative h-full flex items-center" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave} // Usamos la nueva función con retraso
          >
            <span 
              className={`${navLinkBaseClasses} flex items-center cursor-pointer ${
                isCategoryOpen ? navLinkActiveClasses : 
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Categorías
              <ChevronDown 
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                  isCategoryOpen ? 'transform rotate-180 text-cyan-400' : ''
                }`} 
              />
            </span>

            {isCategoryOpen && (
              <div 
                className={`absolute top-full mt-2 w-56 p-2 rounded-lg shadow-xl z-[60] ${ 
                  theme === "dark" ? "bg-gray-800 border border-cyan-700" : "bg-white border border-gray-300"
                }`}
              >
                {categoryItems.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-cyan-600 text-black font-bold"
                          : theme === "dark"
                          ? "text-gray-200 hover:bg-gray-700"
                          : "text-gray-800 hover:bg-gray-100"
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
          {/* FIN CATEGORÍAS DROPDOWN */}
          
          {/* 3. Estrenos */}
          <NavLink
            to="/Estrenos"
            end
            className={({ isActive }) =>
                `${navLinkBaseClasses} ${
                  isActive
                    ? navLinkActiveClasses
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`
            }
          >
            Estrenos
          </NavLink>
          
          {/* 4. Contacto */}
          <NavLink
            to="/Contacto"
            end
            className={({ isActive }) =>
                `${navLinkBaseClasses} ${
                  isActive
                    ? navLinkActiveClasses
                    : theme === "dark"
                    ? "text-gray-300"
                    : "text-gray-700"
                }`
            }
          >
            Contacto
          </NavLink>


          {/* ⭐ ADMIN (solo escritorio) - Mantenido */}
          {user?.rol === "admin" && (
            <NavLink
              to="/admin"
              className="font-medium text-red-400 border-b-2 border-red-400 pb-1 hover:text-red-300 transition"
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* ⚙️ ACCIONES */}
        <div className="flex items-center gap-4">
          {/* 🔍 BUSCADOR ESCRITORIO */}
          <div className="hidden md:block relative">
            <form
              onSubmit={manejarSubmitBusqueda}
              className={`flex items-center rounded-lg px-3 py-1 ${
                theme === "dark" ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <input
                type="text"
                value={busqueda}
                onChange={manejarCambioBusqueda}
                placeholder="Buscar..."
                className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 w-32"
              />
              <button type="submit" className="text-cyan-500 text-lg ml-2">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {sugerencias.length > 0 && (
              <ul className={`absolute left-0 right-0 rounded-lg mt-2 shadow-xl z-[60] max-h-64 overflow-y-auto ${
                theme === "dark" ? "bg-gray-800 border border-cyan-700" : "bg-white border border-gray-300"
              }`}>
                {sugerencias.map((peli) => (
                  <li
                    key={peli.id}
                    onClick={() => seleccionarSugerencia(peli.titulo)}
                    className={`px-3 py-2 cursor-pointer text-sm ${
                        theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"
                    }`}
                  >
                    {peli.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🌓 TEMA */}
          <button
            onClick={toggleTheme}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* 🛒 CARRITO */}
          <button
            onClick={() => navigate("/carrito")}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            <div className="relative">
              <FaShoppingCart />
              {carritoCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-cyan-500 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                  {carritoCount}
                </span>
              )}
            </div>
          </button>

          {/* 👤 USUARIO */}
          <div className="hidden md:block">
            {!loading && <ZonaUsuario onAbrirLogin={onAbrirLogin} />}
          </div>

          {/* 📱 MENÚ MÓVIL */}
          <button className={`md:hidden ${iconBtn}`} onClick={toggleMenu}>
            {isOpen ? <FaTimes className="text-cyan-400" /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* 📱 MENÚ MÓVIL DESPLEGABLE */}
      {isOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-sm flex flex-col items-center space-y-4 py-5 text-lg font-medium border-t border-cyan-800">
          
          {/* 🔍 BUSCADOR MÓVIL */}
          <div className="w-11/12 relative">
            <form
              onSubmit={manejarSubmitBusqueda}
              className="flex items-center bg-gray-700 rounded-lg px-3 py-2"
            >
              <input
                type="text"
                value={busqueda}
                onChange={manejarCambioBusqueda}
                placeholder="Buscar película..."
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400"
              />
              <button type="submit" className="text-cyan-400 text-xl ml-2">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {sugerencias.length > 0 && (
              <ul className="absolute left-0 right-0 bg-gray-800 rounded-lg mt-2 shadow-xl z-40 max-h-64 overflow-y-auto">
                {sugerencias.map((peli) => (
                  <li
                    key={peli.id}
                    onClick={() => {
                      seleccionarSugerencia(peli.titulo);
                      closeMenu();
                    }}
                    className="px-3 py-2 hover:bg-gray-700 text-gray-200 cursor-pointer text-sm"
                  >
                    {peli.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 1. Inicio */}
          <NavLink
            to="/"
            onClick={handleNavClick}
            className={({ isActive }) =>
                `w-full text-center py-2 transition-colors ${
                isActive ? "bg-cyan-900 text-cyan-400" : "text-white hover:bg-gray-700"
                }`
            }
          >
            Inicio
          </NavLink>
          
          {/* 2. ⭐ CATEGORÍAS ACORDEÓN (MÓVIL) */}
          <div className="w-full">
            <button
                onClick={toggleCategory}
                className={`w-full flex justify-between items-center px-5 py-2 transition-colors font-medium text-white hover:bg-gray-700 border-b border-t border-gray-700 ${
                    isCategoryOpen ? "bg-gray-700" : ""
                }`}
            >
                Categorías
                <ChevronDown 
                    className={`w-4 h-4 transition-transform duration-200 ${
                    isCategoryOpen ? 'transform rotate-180 text-cyan-400' : ''
                    }`} 
                />
            </button>
            
            {isCategoryOpen && (
                <div className="flex flex-col border-b border-gray-700">
                    {categoryItems.map(({ path, label }) => (
                        <NavLink
                            key={path}
                            to={path}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `block w-full text-left pl-10 py-2 text-sm transition-colors ${
                                    isActive
                                        ? "bg-cyan-800 text-cyan-300 font-semibold"
                                        : "text-gray-300 hover:bg-gray-700"
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </div>
            )}
          </div>
          {/* FIN CATEGORÍAS MÓVIL */}

          {/* 3. Estrenos */}
          <NavLink
            to="/Estrenos"
            onClick={handleNavClick}
            className={({ isActive }) =>
                `w-full text-center py-2 transition-colors ${
                isActive ? "bg-cyan-900 text-cyan-400" : "text-white hover:bg-gray-700"
                }`
            }
          >
            Estrenos
          </NavLink>

          {/* 4. Contacto */}
          <NavLink
            to="/Contacto"
            onClick={handleNavClick}
            className={({ isActive }) =>
                `w-full text-center py-2 transition-colors ${
                isActive ? "bg-cyan-900 text-cyan-400" : "text-white hover:bg-gray-700"
                }`
            }
          >
            Contacto
          </NavLink>


          {/* ⭐ ADMIN (SOLO MÓVIL) - Mantenido */}
          {user?.rol === "admin" && (
            <NavLink
              to="/admin"
              onClick={handleNavClick}
              className="w-full text-center py-2 bg-red-900 text-red-300 hover:bg-red-700 transition"
            >
              Admin Panel
            </NavLink>
          )}

          {/* LOGIN / REGISTRO (Mantenido) */}
          <div className="w-11/12 pt-3 space-y-3 border-t border-cyan-800 mt-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    navigate("/login");
                    closeMenu(); 
                  }}
                  className="w-full text-center py-2 px-4 rounded-lg font-semibold bg-cyan-600 text-gray-900 hover:bg-cyan-500 shadow-lg"
                >
                  <FaUserCircle className="inline mr-2" /> Iniciar sesión
                </button>
                <button
                  onClick={() => {
                    navigate("/registro");
                    closeMenu(); 
                  }}
                  className="w-full text-center py-2 px-4 rounded-lg font-semibold bg-gray-800 text-cyan-400 hover:bg-gray-700"
                >
                  Registrarse
                </button>
              </>
            ) : (
              // En móvil, mostramos el componente ZonaUsuario si está autenticado
              <div className="w-full">
                <ZonaUsuario onAbrirLogin={onAbrirLogin} isMobile={true} />
              </div>
            )}

            <button
              onClick={() => {
                navigate("/carrito");
                closeMenu(); 
              }}
              className="w-full text-center py-2 px-4 rounded-lg font-semibold bg-gray-800 text-cyan-400 hover:bg-gray-700 flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Ver carrito ({carritoCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}