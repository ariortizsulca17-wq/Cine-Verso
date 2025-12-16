// src/Componentes/Modal.jsx
import { useEffect } from "react";
import { useTheme } from "../Context/ThemeContext";

export default function Modal({ isOpen, onClose, children }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayClass =
    theme === "dark" ? "bg-black/60" : "bg-gray-300/60";

  const modalBg =
    theme === "dark"
      ? "bg-gray-900 text-white"
      : "bg-white text-gray-900";

  const btnClose =
    theme === "dark"
      ? "text-gray-300 hover:text-white"
      : "text-gray-600 hover:text-black";

  return (
    <div
      className={`
        fixed inset-0 z-50
        flex items-center justify-center
        px-4
        ${overlayClass}
      `}
      onClick={onClose}
    >
      <div
        className={`
          ${modalBg}
          w-full max-w-md
          max-h-[90vh]
          rounded-2xl
          p-6
          shadow-2xl
          relative
          animate-fadeIn
          overflow-y-auto
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ❌ Cerrar */}
        <button
          className={`
            absolute top-3 right-3
            text-2xl leading-none
            ${btnClose}
          `}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
