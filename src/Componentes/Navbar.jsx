// src/Componentes/Navbar.jsx
import { useState, useEffect } from "react";
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

export default function Navbar({ onAbrirLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

  //------------------------------------------------
  // 🔄 CARGAR HISTORIAL AL INICIAR
  //------------------------------------------------
  useEffect(() => {
    const guardado = JSON.parse(localStorage.getItem("historialBusqueda")) || [];
    setHistorial(guardado);
  }, []);

  //------------------------------------------------
  // 🎨 TEMA
  //------------------------------------------------
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  const navbarClasses =
    theme === "dark"
      ? "bg-gray-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-cyan-700"
      : "bg-white text-gray-900 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-cyan-200";

  const navLinkBaseClasses = "font-medium hover:text-cyan-400 transition-colors";
  const navLinkActiveClasses =
    "text-cyan-400 border-b-2 border-cyan-400 pb-1";

  const menuItems = [
    { path: "/", label: "Inicio" },
    { path: "/PeliculasTops", label: "Peli Tops" },
    { path: "/PeliculasKids", label: "Peli Kids" },
    { path: "/PeliAsiaticas", label: "Peli Asiáticas" },
    { path: "/PeliDocumentales", label: "Peli Docs" },
    { path: "/PeliLibros", label: "Peli Libros" },
    { path: "/Contacto", label: "Contacto" },
  ];

  const iconBtn = "text-2xl hover:text-cyan-400 transition focus:outline-none";

  //------------------------------------------------
  // 🔍 SUBMIT BUSQUEDA
  //------------------------------------------------
  const manejarSubmitBusqueda = (e) => {
    e.preventDefault();
    if (busqueda.trim() !== "") {
      navigate(`/buscar?q=${encodeURIComponent(busqueda.trim())}`);

      const nuevoHistorial = [
        busqueda.trim(),
        ...historial.filter((h) => h !== busqueda.trim()),
      ];

      setHistorial(nuevoHistorial);
      localStorage.setItem("historialBusqueda", JSON.stringify(nuevoHistorial));

      setBusqueda("");
      setSugerencias([]);
      closeMenu();
    }
  };

  //------------------------------------------------
  // 🔍 BUSCADOR GLOBAL
  //------------------------------------------------
  const manejarCambioBusqueda = (e) => {
    const value = e.target.value;
    setBusqueda(value);

    if (value.trim() === "") {
      setSugerencias([]);
      return;
    }

    const query = value.toLowerCase();

    const filtradas = PeliculasData.filter((p) =>
      (p.titulo?.toLowerCase().includes(query) ||
        p.genero?.toLowerCase().includes(query) ||
        p.categoria?.toLowerCase().includes(query) ||
        p.autor?.toLowerCase().includes(query) ||
        p.descripcion?.toLowerCase().includes(query) ||
        p.reseña?.toLowerCase().includes(query) ||
        p.recomendacion?.toLowerCase().includes(query) ||
        p.detalles?.toLowerCase().includes(query) ||
        p.anio?.toString().includes(query))
    ).slice(0, 6);

    setSugerencias(filtradas);
  };

  const seleccionarSugerencia = (titulo) => {
    setBusqueda("");
    setSugerencias([]);
    navigate(`/buscar?q=${encodeURIComponent(titulo)}`);
  };

  const seleccionarHistorial = (v) => {
    navigate(`/buscar?q=${encodeURIComponent(v)}`);
    setMostrarHistorial(false);
  };

  //------------------------------------------------
  // 🗑️ BORRAR HISTORIAL
  //------------------------------------------------
  const borrarHistorial = () => {
    localStorage.removeItem("historialBusqueda");
    setHistorial([]);
    setMostrarHistorial(false);
  };

  //------------------------------------------------
  // RENDER PRINCIPAL
  //------------------------------------------------
  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="text-3xl text-cyan-400">🎬</span>
          <span className="font-extrabold text-2xl tracking-wide">
            Cineverso
          </span>
        </Link>

        {/* MENÚ DESKTOP */}
        <div className="hidden md:flex gap-7">
          {menuItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
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
              {label}
            </NavLink>
          ))}
        </div>

        {/* ACCIONES */}
        <div className="flex items-center gap-4">

          {/* BUSCADOR DESKTOP */}
          <div className="hidden md:block relative">
            <form
              onSubmit={manejarSubmitBusqueda}
              className="flex items-center bg-gray-200 dark:bg-gray-800 rounded-lg px-3 py-1"
            >
              <input
                type="text"
                value={busqueda}
                onChange={manejarCambioBusqueda}
                placeholder="Buscar película..."
                className="bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200"
              />

              {/* BOTÓN RELOJ */}
              <button
                type="button"
                onClick={() => setMostrarHistorial(!mostrarHistorial)}
                className="text-gray-500 text-lg mr-2"
              >
                🕘
              </button>

              <button
                type="submit"
                className={`text-cyan-500 text-lg ml-2 transition-transform ${
                  busqueda.length > 0 ? "scale-125 animate-pulse" : ""
                }`}
              >
                🔍
              </button>
            </form>

            {/* HISTORIAL */}
            {mostrarHistorial && historial.length > 0 && (
              <div className="absolute left-0 right-0 bg-gray-900 text-white rounded-lg mt-2 shadow-xl z-40 border border-gray-700">

                {/* BOTÓN BORRAR */}
                <div className="flex justify-between px-3 py-2 text-sm border-b border-gray-700">
                  <span className="text-gray-300">Historial</span>
                  <button
                    onClick={borrarHistorial}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    🗑️ Borrar
                  </button>
                </div>

                {/* LISTA (SOLO 5 A LA VISTA) */}
                <ul className="max-h-56 overflow-y-auto">
                  {historial.map((item, idx) => (
                    <li
                      key={idx}
                      onClick={() => seleccionarHistorial(item)}
                      className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* DROPDOWN SUGERENCIAS */}
            {sugerencias.length > 0 && (
              <ul className="absolute left-0 right-0 bg-gray-900 text-white rounded-lg mt-2 shadow-xl z-40 max-h-72 overflow-y-auto border border-gray-700">
                {sugerencias.map((peli) => (
                  <li
                    key={peli.id}
                    onClick={() => seleccionarSugerencia(peli.titulo)}
                    className="flex gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    <img
                      src={peli.imagen}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-bold">{peli.titulo}</h3>
                      <p className="text-xs text-gray-300">
                        {peli.categoria} • {peli.anio}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* TEMA */}
          <button
            onClick={toggleTheme}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* CARRITO */}
          <button
            onClick={() => navigate("/carrito")}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            <FaShoppingCart />
          </button>

          {/* USUARIO */}
          <div className="hidden md:block">
            {!loading && <ZonaUsuario onAbrirLogin={onAbrirLogin} />}
          </div>

          {/* MENÚ MÓVIL */}
          <button className={`md:hidden ${iconBtn}`} onClick={toggleMenu}>
            {isOpen ? <FaTimes className="text-cyan-400" /> : <FaBars />}
          </button>

        </div>
      </div>

      {/* MENÚ MÓVIL (SIN CAMBIOS) */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-gray-900 text-white border-t border-cyan-700 py-5 z-40 flex flex-col items-center space-y-5">

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
                className="flex-1 bg-transparent outline-none text-gray-200"
              />
              <button type="submit" className="text-cyan-400 text-xl ml-2">🔍</button>
            </form>

            {sugerencias.length > 0 && (
              <ul className="absolute left-0 right-0 bg-gray-800 rounded-lg mt-2 max-h-64 overflow-y-auto z-50">
                {sugerencias.map((peli) => (
                  <li
                    key={peli.id}
                    onClick={() => {
                      seleccionarSugerencia(peli.titulo);
                      closeMenu();
                    }}
                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer flex gap-2"
                  >
                    <img src={peli.imagen} className="w-10 h-14 object-cover rounded" />
                    <span>{peli.titulo}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {menuItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMenu}
              className="w-full text-center py-2 text-lg hover:bg-gray-700"
            >
              {label}
            </NavLink>
          ))}

          <div className="w-11/12 pt-3 border-t border-cyan-700 space-y-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={onAbrirLogin}
                  className="w-full py-2 rounded-lg bg-cyan-600 text-gray-900 font-semibold"
                >
                  <FaUserCircle className="inline mr-2" /> Iniciar sesión
                </button>

                <button
                  onClick={() => navigate("/registro")}
                  className="w-full py-2 rounded-lg bg-gray-800 text-cyan-400"
                >
                  Registrarse
                </button>
              </>
            ) : (
              <div className="text-gray-400 text-sm text-center">
                Sesión iniciada ✔
              </div>
            )}

            <button
              onClick={() => navigate("/carrito")}
              className="w-full py-2 rounded-lg bg-gray-800 text-cyan-400 flex items-center justify-center gap-2"
            >
              <FaShoppingCart /> Ver carrito
            </button>
          </div>

        </div>
      )}

    </nav>
  );
}
