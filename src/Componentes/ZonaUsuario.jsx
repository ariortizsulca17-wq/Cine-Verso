import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext"; // <-- Importamos ThemeContext
import { ShoppingCart, User, LogOut } from 'lucide-react';

export function ZonaUsuario({ onAbrirLogin }) {
    const { user, logout } = useAuth();
    const { theme } = useTheme(); // <-- Extraemos el theme
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

        // Clases adaptadas al tema
        const menuClasses = `absolute right-0 mt-3 w-64 rounded-lg shadow-2xl z-50 transition-all duration-300
            ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 border border-gray-300"}`;
        const itemClasses = `flex items-center p-3 text-sm font-medium cursor-pointer transition-colors duration-200
            ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-100"}`;
        const iconClasses = "w-5 h-5 mr-3";

        return (
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-all
                        ${theme === "dark" ? "" : "bg-gray-200"}`}
                >
                    {getAvatarUrl() ? (
                        <img
                            src={getAvatarUrl()}
                            alt="avatar"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className={`w-full h-full flex items-center justify-center font-semibold text-lg
                            ${theme === "dark" ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-900"}`}>
                            {displayUsername.charAt(0).toUpperCase()}
                        </div>
                    )}
                </button>

                {isMenuOpen && (
                    <div className={menuClasses}>
                        <div className={`p-4 border-b ${theme === "dark" ? "border-gray-700" : "border-gray-300"} flex flex-col items-center`}>
                            <h3 className={`text-xl font-extrabold uppercase mb-2 text-center
                                ${theme === "dark" ? "" : "text-gray-900"}`}>
                                HOLA, {displayUsername}
                            </h3>

                            <div className="relative w-20 h-20 mb-2">
                                <div className={`w-full h-full rounded-full flex items-center justify-center overflow-hidden
                                    ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}>
                                    {getAvatarUrl() ? (
                                        <img
                                            src={getAvatarUrl()}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"} w-12 h-12`} />
                                    )}
                                </div>

                                <div className="absolute bottom-0 right-0 p-1.5 bg-cyan-600 rounded-full border-2 border-gray-900 shadow-md">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="py-1">
                            <div
                                className={itemClasses}
                                onClick={() => {
                                    navigate('/dashboard');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <User className={iconClasses} />
                                MI CUENTA
                            </div>

                            <div
                                className={itemClasses}
                                onClick={() => {
                                    navigate('/dashboard');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <ShoppingCart className={iconClasses} />
                                MIS COMPRAS
                            </div>

                            <div
                                className={`border-t mt-1 ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}
                                onClick={() => {
                                    logout();
                                    setIsMenuOpen(false);
                                    navigate('/');
                                }}
                            >
                                <div className={`${itemClasses} text-red-400 hover:bg-red-900/50`}>
                                    <LogOut className={iconClasses} />
                                    CERRAR SESIÓN
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={onAbrirLogin}
            className={`text-sm px-4 py-2 rounded-lg font-medium transition
                ${theme === "dark" ? "bg-cyan-600 text-white hover:bg-cyan-700" : "bg-cyan-500 text-gray-900 hover:bg-cyan-600"}`}
        >
            Iniciar sesión
        </button>
    );
}
