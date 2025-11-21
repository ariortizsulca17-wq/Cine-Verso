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

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;

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

  // 👉 Submit búsqueda
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

  // 👉 Abrir modal login
  const handleAbrirLogin = () => {
    onAbrirLogin && onAbrirLogin();
  };

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">

        {/* 🌟 Logo */}
        <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="text-3xl text-cyan-400">🎬</span>
          <span className="font-extrabold text-2xl tracking-wide">
            Cineverso
          </span>
        </Link>

        {/* 🔹 Menú escritorio */}
        <div className="hidden md:flex gap-7">
          {menuItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
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
              {label}
            </NavLink>
          ))}
        </div>

        {/* ⚙️ Acciones */}
        <div className="flex items-center gap-4">

          {/* 🔍 Buscador escritorio */}
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
              <button type="submit" className="text-cyan-500 text-lg ml-2">🔍</button>
            </form>

            {sugerencias.length > 0 && (
              <ul className="absolute left-0 right-0 bg-gray-900 text-white rounded-lg mt-2 shadow-xl z-40 max-h-64 overflow-y-auto">
                {sugerencias.map((peli) => (
                  <li
                    key={peli.id}
                    onClick={() => seleccionarSugerencia(peli.titulo)}
                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-sm"
                  >
                    {peli.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 🌓 Tema */}
          <button
            onClick={toggleTheme}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* 🛒 Carrito */}
          <button
            onClick={() => navigate("/carrito")}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
          >
            <FaShoppingCart />
          </button>

          {/* 👤 Usuario */}
          <div className="hidden md:block">
            {!loading && <ZonaUsuario onAbrirLogin={handleAbrirLogin} />}
          </div>

          {/* 📱 Botón menú */}
          <button className={`md:hidden ${iconBtn}`} onClick={toggleMenu}>
            {isOpen ? <FaTimes className="text-cyan-400" /> : <FaBars />}
          </button>

        </div>
      </div>

      {/* 📱 MENÚ MÓVIL — REPARADO */}
      {isOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-gray-900 text-white border-t border-cyan-700 py-5 z-40 flex flex-col items-center space-y-5">

          {/* 🔍 Buscador móvil */}
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
                    className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    {peli.titulo}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ⭐ LINKS */}
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

          {/* 👤 Login/Register */}
          <div className="w-11/12 pt-3 border-t border-cyan-700 space-y-3">

            {!isAuthenticated ? (
              <>
                <button
                  onClick={handleAbrirLogin}
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

            {/* 🛒 Carrito móvil */}
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
