import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext";
import { ShoppingCart, User, LogOut } from "lucide-react";

export function ZonaUsuario({ onAbrirLogin }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const getAvatarUrl = () => user?.photoURL || user?.avatar;

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (user) {
    const displayUsername =
      user.username || user.displayName || user.email?.split("@")[0];

    /* 🎨 Clases adaptadas a tema + responsive */
    const menuClasses = `
      absolute right-0 mt-3 w-[92vw] max-w-xs sm:w-72
      rounded-xl shadow-2xl z-50 transition-all duration-300
      ${theme === "dark"
        ? "bg-gray-800 text-white"
        : "bg-white text-gray-900 border border-gray-300"}
    `;

    const itemClasses = `
      flex items-center gap-3 px-4 py-3
      text-sm sm:text-base font-medium cursor-pointer
      transition-colors duration-200 rounded-lg
      ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}
    `;

    const iconClasses = "w-5 h-5 shrink-0";

    return (
      <div className="relative" ref={menuRef}>
        {/* 🟢 AVATAR BUTTON */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`
            w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden
            border-2 border-transparent hover:border-cyan-400
            transition-all flex items-center justify-center
            ${theme === "dark" ? "" : "bg-gray-200"}
          `}
          aria-label="Zona usuario"
        >
          {getAvatarUrl() ? (
            <img
              src={getAvatarUrl()}
              alt="avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`
                w-full h-full flex items-center justify-center
                font-semibold text-lg
                ${theme === "dark"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-400 text-gray-900"}
              `}
            >
              {displayUsername.charAt(0).toUpperCase()}
            </div>
          )}
        </button>

        {/* 🟣 MENÚ */}
        {isMenuOpen && (
          <div className={menuClasses}>
            {/* HEADER */}
            <div
              className={`
                p-4 border-b flex flex-col items-center text-center
                ${theme === "dark" ? "border-gray-700" : "border-gray-300"}
              `}
            >
              <h3 className="text-lg sm:text-xl font-extrabold uppercase mb-2">
                Hola, {displayUsername}
              </h3>

              {/* AVATAR GRANDE */}
              <div className="relative w-20 h-20 mb-2">
                <div
                  className={`
                    w-full h-full rounded-full overflow-hidden
                    flex items-center justify-center
                    ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}
                  `}
                >
                  {getAvatarUrl() ? (
                    <img
                      src={getAvatarUrl()}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      className={`w-12 h-12 ${
                        theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    />
                  )}
                </div>

                <div className="absolute bottom-0 right-0 p-1.5 bg-cyan-600 rounded-full border-2 border-gray-900 shadow-md">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>

            {/* ITEMS */}
            <div className="p-2 space-y-1">
              <div
                className={itemClasses}
                onClick={() => {
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                }}
              >
                <User className={iconClasses} />
                Mi cuenta
              </div>

              <div
                className={itemClasses}
                onClick={() => {
                  navigate("/dashboard");
                  setIsMenuOpen(false);
                }}
              >
                <ShoppingCart className={iconClasses} />
                Mis compras
              </div>

              <div
                className={`mt-1 pt-1 border-t ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <div
                  className={`${itemClasses} text-red-400 hover:bg-red-900/40`}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate("/");
                  }}
                >
                  <LogOut className={iconClasses} />
                  Cerrar sesión
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* 🔵 BOTÓN LOGIN (mobile friendly) */
  return (
    <button
      onClick={onAbrirLogin}
      className={`
        text-sm sm:text-base px-4 sm:px-5 py-2.5
        rounded-xl font-semibold transition active:scale-95
        ${theme === "dark"
          ? "bg-cyan-600 text-white hover:bg-cyan-700"
          : "bg-cyan-500 text-gray-900 hover:bg-cyan-600"}
      `}
    >
      Iniciar sesión
    </button>
  );
}
