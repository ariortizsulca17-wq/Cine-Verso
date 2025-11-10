// ✅ src/Componentes/ZonaUsuario.jsx (REVISIÓN FINAL)

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../Context/AuthContext.jsx";
import { ShoppingCart, User, LogOut } from 'lucide-react'; // Iconos

export function ZonaUsuario({ onAbrirLogin }){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    // Estado y Referencia para el menú desplegable (Mantiene su lógica)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null); 
    
    // Función para obtener la URL del avatar
    const getAvatarUrl = () => {
        // user.avatar vendría de Firestore. user.photoURL de Google Auth.
        return user?.photoURL || user?.avatar;
    };

    // Lógica para cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Maneja la navegación y cierra el menú
    const handleMenuItemClick = (path) => {
        setIsMenuOpen(false); // Cierra el menú siempre
        navigate(path);
    };

    // Estilos (Sin cambios)
    const menuClasses = "absolute right-0 mt-3 w-64 bg-gray-800 text-white rounded-lg shadow-2xl z-50 transition-all duration-300";
    const itemClasses = "flex items-center p-3 text-sm font-medium hover:bg-gray-700 cursor-pointer transition-colors duration-200";
    const iconClasses = "w-5 h-5 mr-3";

    // 🔹 Usuario autenticado
    if (user) {
        const displayUsername = user.username || user.displayName || user.email?.split('@')[0];

        return (
            <div className="relative" ref={menuRef}>
                {/* 🎯 Botón/Avatar que abre el menú */}
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-cyan-400 transition-all focus:outline-none"
                    aria-label="Menú de perfil"
                >
                    {getAvatarUrl() ? (
                        <img 
                            src={getAvatarUrl()} 
                            alt="avatar" 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-blue-600 text-white flex items-center justify-center font-semibold text-lg">
                            {displayUsername?.charAt(0).toUpperCase() || "U"}
                        </div>
                    )}
                </button>

                {/* 📋 Menú Desplegable */}
                {isMenuOpen && (
                    <div className={menuClasses}>
                        
                        {/* Cabecera del perfil (Nombre y Foto) */}
                        <div className="p-4 border-b border-gray-700 flex flex-col items-center">
                            <h3 className="text-xl font-extrabold uppercase mb-2 text-center">
                                HOLA, {displayUsername}
                            </h3>
                            
                            <div className="relative w-20 h-20 mb-2">
                                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                                    {getAvatarUrl() ? (
                                        <img src={getAvatarUrl()} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-12 h-12 text-gray-500" />
                                    )}
                                </div>
                                {/* Ícono de edición (Lo mantenemos visual, la acción es el item "MI CUENTA") */}
                                <div className="absolute bottom-0 right-0 p-1 bg-gray-600 rounded-full border-2 border-gray-800">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.794.793-2.828-2.828.794-.793zm-4 4L10.586 6l4-4 1.414 1.414-4 4z"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Opciones */}
                        <div className="py-1">
                            <div 
                                className={itemClasses} 
                                onClick={() => handleMenuItemClick('/mis-compras')}
                            >
                                <ShoppingCart className={iconClasses} />
                                MIS COMPRAS
                            </div>
                            
                            {/* ✅ MI CUENTA: Navega a la ruta de página completa */}
                            <div 
                                className={itemClasses} 
                                onClick={() => handleMenuItemClick('/dashboard')}
                            >
                                <User className={iconClasses} />
                                **MI CUENTA**
                            </div>
                            
                            {/* Botón de Cerrar Sesión */}
                            <div 
                                className="border-t border-gray-700 mt-1"
                                onClick={() => { logout(); setIsMenuOpen(false); navigate('/') }} 
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

    // 🔹 Invitado (no autenticado)
    return (
        <button
            onClick={ onAbrirLogin }
            className="text-sm px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 transition"
        >
            Iniciar sesión
        </button>
    );
}