// src/components/Modal.jsx
export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>

      {/* Contenedor del modal */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        {/* Botón cerrar (X) */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}
