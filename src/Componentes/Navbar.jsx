// ../Componentes/Navbar.jsx
import { useState, useEffect, useRef } from "react"; // 💡 Importamos useRef
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext.jsx";
import { ZonaUsuario } from "./ZonaUsuario";
import PeliculasData from "../Componentes/PeliculasData.jsx";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../lib/firebase";

import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaRegClock,
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
  // ⭐ Nuevos estados del historial
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const [carritoCount, setCarritoCount] = useState(0);
  const [peliculas, setPeliculas] = useState([]);


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

  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("historialBusqueda")) || [];
    setHistorial(guardado);
  }, []);

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        const snap = await getDocs(collection(db, "peliculas"));
        const lista = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setPeliculas(lista);
      } catch (error) {
        console.error("Error al cargar películas desde Firestore:", error);
      }
    };

    cargarPeliculas();
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

  const manejarSubmitBusqueda = (e) => {
    e.preventDefault();

    if (busqueda.trim() !== "") {
      navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`);

      // Guardar historial sin duplicados
      const nuevo = [
        busqueda.trim(),
        ...historial.filter((h) => h !== busqueda.trim()),
      ];

      setHistorial(nuevo);
      localStorage.setItem("historialBusqueda", JSON.stringify(nuevo));

      setBusqueda("");
      setSugerencias([]);
      setMostrarHistorial(false);
      closeMenu();
    }
  };


  const manejarCambioBusqueda = (e) => {
    const value = e.target.value;
    setBusqueda(value);

    if (value.trim() === "") {
      setSugerencias([]);
      setMostrarHistorial(true);
      return;
    }

    setMostrarHistorial(false);

    const queryLower = value.toLowerCase().trim();

    const filtradas = peliculas.filter((p) => {
      // Convertimos todos los campos a string y minúscula para comparar
      const titulo = p.titulo?.toString().toLowerCase() || "";
      const genero = p.genero?.toString().toLowerCase() || "";
      const categoria = p.categoria?.toString().toLowerCase() || "";
      const autor = p.autor?.toString().toLowerCase() || "";
      const anio = p.anio?.toString() || "";

      return (
        titulo.includes(queryLower) ||
        genero.includes(queryLower) ||
        categoria.includes(queryLower) ||
        autor.includes(queryLower) ||
        anio.includes(queryLower)
      );
    }).slice(0, 6); // Limitar sugerencias a 6

    setSugerencias(filtradas);
  };

  const seleccionarSugerencia = (titulo) => {
    setBusqueda("");
    setSugerencias([]);
    setMostrarHistorial(false);
    navigate(`/buscar?q=${encodeURIComponent(titulo)}`);
  };


  const seleccionarHistorial = (value) => {
    navigate(`/buscar?q=${encodeURIComponent(value)}`);
    setMostrarHistorial(false);
    closeMenu();
  };

  // Eliminar una entrada especifica del historial
  const borrarEntradaHistorial = (value) => {
    const nuevo = historial.filter((h) => h !== value);
    setHistorial(nuevo);
    try {
      localStorage.setItem("historialBusqueda", JSON.stringify(nuevo));
    } catch {
      // noop
    }
    // si ya no hay entradas, ocultar el panel
    if (nuevo.length === 0) setMostrarHistorial(false);
  };

  const borrarHistorial = () => {
    localStorage.removeItem("historialBusqueda");
    setHistorial([]);
    setMostrarHistorial(false);
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
              `${navLinkBaseClasses} ${isActive
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
              className={`${navLinkBaseClasses} flex items-center cursor-pointer ${isCategoryOpen ? navLinkActiveClasses :
                theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
            >
              Categorías
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-200 ${isCategoryOpen ? 'transform rotate-180 text-cyan-400' : ''
                  }`}
              />
            </span>

            {isCategoryOpen && (
              <div
                className={`absolute top-full mt-2 w-56 p-2 rounded-lg shadow-xl z-[60] ${theme === "dark" ? "bg-gray-800 border border-cyan-700" : "bg-white border border-gray-300"
                  }`}
              >
                {categoryItems.map(({ path, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={closeMenu}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm rounded-lg transition-colors ${isActive
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
              `${navLinkBaseClasses} ${isActive
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
              `${navLinkBaseClasses} ${isActive
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
              className="relative flex items-center px-4 py-2 font-bold text-cyan-400 
               bg-gradient-to-r from-cyan-600/20 to-cyan-500/10 
               rounded-lg border border-cyan-400 shadow-lg
               hover:from-cyan-500/30 hover:to-cyan-400/20 hover:scale-105
               transition-transform duration-300"
            >
              Administrador
            </NavLink>
          )}
        </div>

        {/* ⚙️ ACCIONES */}
        <div className="flex items-center gap-4">
          {/* 🔍 BUSCADOR ESCRITORIO */}
          <div className="hidden md:block relative">
            <form
              onSubmit={manejarSubmitBusqueda}
              className={`flex items-center rounded-lg px-3 py-1 ${theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                }`}
            >
              <input
                type="text"
                value={busqueda}
                onChange={manejarCambioBusqueda}
                onFocus={() => {
                  if (historial.length > 0 && busqueda.trim() === "") {
                    setMostrarHistorial(true);
                  }
                }}
                placeholder="Buscar película..."
                className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400"
              />
              <button type="submit" className="text-cyan-500 text-lg ml-2">
                <Search className="w-5 h-5" />
              </button>
            </form>

            {sugerencias.length > 0 && (
              <ul className={`absolute left-0 right-0 rounded-lg mt-2 shadow-xl z-[60] max-h-64 overflow-y-auto ${theme === "dark" ? "bg-gray-800 border border-cyan-700" : "bg-white border border-gray-300"
                }`}>
                {sugerencias.map((peli) => (
                  <li
                    key={peli.id}
                    onClick={() => seleccionarSugerencia(peli.titulo)}
                    className={`px-3 py-2 cursor-pointer text-sm ${theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    {peli.titulo}
                  </li>
                ))}
              </ul>
            )}
            {mostrarHistorial && historial.length > 0 && (
              <div className={`absolute left-0 right-0 mt-2 rounded-lg shadow-xl p-3 z-[60] ${theme === "dark" ? "bg-gray-800 border border-cyan-700" : "bg-white border border-gray-300"
                }`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Historial</span>
                  <button onClick={borrarHistorial} className="text-xs text-red-400 hover:text-red-300">
                    Borrar
                  </button>
                </div>

                {historial.map((h, i) => (
                  <div
                    key={i}
                    className={`px-2 py-1 text-sm rounded ${theme === "dark" ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-200"
                      }`}
                  >
                    <div
                      onClick={() => seleccionarHistorial(h)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{h}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          borrarEntradaHistorial(h);
                        }}
                        className="ml-3 text-xs text-red-400 hover:text-red-300"
                        title="Eliminar"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                onFocus={() => {
                  if (historial.length > 0 && busqueda.trim() === "") {
                    setMostrarHistorial(true);
                  }
                }}
                placeholder="Buscar..."
                className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 w-32"
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

            {mostrarHistorial && historial.length > 0 && (
              <div className="absolute left-0 right-0 bg-gray-800 rounded-lg mt-2 shadow-xl z-40 p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-200">Historial</span>
                  <button onClick={borrarHistorial} className="text-xs text-red-400">
                    Borrar
                  </button>
                </div>

                {historial.map((h, i) => (
                  <div key={i} className="px-3 py-1 text-gray-300 text-sm rounded flex items-center justify-between">
                    <div
                      onClick={() => {
                        seleccionarHistorial(h);
                        closeMenu();
                      }}
                      className="flex-1 pr-2 cursor-pointer"
                    >
                      {h}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        borrarEntradaHistorial(h);
                      }}
                      className="ml-2 text-xs text-red-400 hover:text-red-300"
                      title="Eliminar"
                    >
                      ✖
                    </button>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* 1. Inicio */}
          <NavLink
            to="/"
            onClick={handleNavClick}
            className={({ isActive }) =>
              `w-full text-center py-2 transition-colors ${isActive ? "bg-cyan-900 text-cyan-400" : "text-white hover:bg-gray-700"
              }`
            }
          >
            Inicio
          </NavLink>

          {/* 2. ⭐ CATEGORÍAS ACORDEÓN (MÓVIL) */}
          <div className="w-full">
            <button
              onClick={toggleCategory}
              className={`w-full flex justify-between items-center px-5 py-2 transition-colors font-medium text-white hover:bg-gray-700 border-b border-t border-gray-700 ${isCategoryOpen ? "bg-gray-700" : ""
                }`}
            >
              Categorías
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'transform rotate-180 text-cyan-400' : ''
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
                      `block w-full text-left pl-10 py-2 text-sm transition-colors ${isActive
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
              `w-full text-center py-2 transition-colors ${isActive ? "bg-cyan-900 text-cyan-400" : "text-white hover:bg-gray-700"
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
              `w-full text-center py-2 transition-colors ${isActive ? "bg-cyan-900 text-cyan-400" : "text-white hover:bg-gray-700"
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
              className="w-full text-center py-2 px-4 rounded-lg font-bold 
               bg-cyan-700 text-white hover:bg-cyan-600 shadow-lg flex items-center justify-center gap-2"
            >
              Administrador
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