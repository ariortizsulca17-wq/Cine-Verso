import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { useUser } from "../Context/UserContext";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaSun,
  FaMoon,
  FaUserCircle,
} from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();

  // 🌈 NUEVO: aplica la clase global del tema al <body>
  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
  }, [theme]);

  // 📝 Ajuste de estilos del navbar según el tema
  const navbarClasses =
    theme === "dark"
      ? "bg-gray-900 text-white shadow-lg sticky top-0 z-50 border-b border-cyan-700"
      : "bg-white text-gray-900 shadow-md sticky top-0 z-50 border-b border-cyan-200";

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

  const actionBtn =
    "inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-gray-900 " +
    "hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition shadow-lg";

  const mobileActionBtn =
    "w-full text-center py-2 px-4 rounded-lg font-semibold transition " +
    "bg-gray-800 text-cyan-400 hover:bg-gray-700";

  const iconBtn = "text-2xl hover:text-cyan-400 transition focus:outline-none";

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        {/* 🌟 Logo Cineverso */}
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

        {/* ⚙️ Acciones (Tema, Carrito, Usuario, Menú móvil) */}
        <div className="flex items-center gap-4">
          {/* 🌓 Cambiar tema (Sol/Luna) */}
          <button
            onClick={toggleTheme}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            title="Cambiar tema"
          >
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>

          {/* 🛒 Carrito */}
          <button
            onClick={() => navigate("/carrito")}
            className={`${iconBtn} ${theme === "dark" ? "text-white" : "text-gray-800"}`}
            title="Ver carrito"
          >
            <FaShoppingCart />
          </button>

          {/* 👤 Usuario / Login */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.nombre ?? "Usuario"}
                  referrerPolicy="no-referrer"
                  className="h-9 w-9 rounded-full object-cover border-2 border-cyan-600"
                  title={user?.nombre}
                />
              ) : (
                <FaUserCircle
                  className="h-9 w-9 text-cyan-600"
                  title={user?.nombre ?? "Usuario"}
                />
              )}
              <div className="hidden lg:block leading-4 text-left">
                <p className="text-sm font-semibold">
                  {user?.nombre}
                </p>
                <p className="text-xs text-cyan-400">{user?.cargo}</p>
              </div>
              <button
                onClick={logout}
                className={`${actionBtn} hidden md:inline-flex px-3 py-1.5`}
              >
                Cerrar
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => navigate("/login")} className={actionBtn}>
                <FaUserCircle className="text-lg" /> Iniciar sesión
              </button>
            </div>
          )}

          {/* 📱 Botón de menú móvil */}
          <button className={`md:hidden ${iconBtn}`} onClick={toggleMenu}>
            {isOpen ? (
              <FaTimes className="text-cyan-400" />
            ) : (
              <FaBars />
            )}
          </button>
        </div>
      </div>

      {/* 📱 Menú móvil desplegable */}
      {isOpen && (
        <div className="md:hidden bg-gray-800/95 backdrop-blur-sm flex flex-col items-center space-y-4 py-5 text-lg font-medium border-t border-cyan-800">
          {menuItems.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMenu}
              className={({ isActive }) =>
                `w-full text-center py-2 transition-colors ${
                  isActive
                    ? "bg-cyan-900 text-cyan-400"
                    : "text-white hover:bg-gray-700"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <div className="w-11/12 pt-3 space-y-3 border-t border-cyan-800 mt-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/login");
                  }}
                  className={actionBtn}
                >
                  <FaUserCircle /> Iniciar sesión
                </button>
                <button
                  onClick={() => {
                    closeMenu();
                    navigate("/register");
                  }}
                  className={mobileActionBtn}
                >
                  Registrarse
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className={actionBtn}
              >
                Cerrar sesión
              </button>
            )}

            <button
              onClick={() => {
                closeMenu();
                navigate("/carrito");
              }}
              className={`${mobileActionBtn} flex items-center justify-center gap-2`}
            >
              <FaShoppingCart /> Ver carrito
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
