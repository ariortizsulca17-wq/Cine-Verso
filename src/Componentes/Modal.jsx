// ✅ src/Componentes/Modal.jsx
import { useEffect } from "react";
import { useTheme } from "../Context/ThemeContext";

export default function Modal({ isOpen, onClose, children }) {
    const { theme } = useTheme(); // <-- Extraemos theme

    // Bloquear scroll cuando el modal esté abierto
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    if (!isOpen) return null;

    // Clases dinámicas según tema
    const overlayClass = theme === 'dark' ? 'bg-black/40' : 'bg-gray-200/40';
    const modalBg = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
    const btnClose = theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-black';

    return (
        <div 
            className={`fixed inset-0 flex justify-center items-center z-999 ${overlayClass}`}
            onClick={onClose}
        >
            <div 
                className={`${modalBg} rounded-xl p-6 w-full max-w-md shadow-xl relative animate-fadeIn`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Botón de cerrar */}
                <button 
                    className={`absolute top-3 right-3 text-xl ${btnClose}`}
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}
