// Carrito.jsx (MEJORADO con useState y useEffect)
import React, { useState, useEffect } from "react";

export default function Carrito() {
  // 💡 USAR ESTADO LOCAL para almacenar el carrito y forzar la re-renderización
  const [carrito, setCarrito] = useState([]);

  // 💡 USAR useEffect para cargar el carrito al montar el componente
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []); // Se ejecuta solo una vez al cargar

  // 💡 FUNCIÓN MEJORADA: Ya no usa window.location.reload()
  const eliminar = (id) => {
    // 1. Filtrar el array
    const nuevoCarrito = carrito.filter((p) => p.id !== id);

    // 2. Actualizar localStorage
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

    // 3. Actualizar el estado para re-renderizar
    setCarrito(nuevoCarrito);
  };

  const totalItems = carrito.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-gray-100">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-8">
        <h1 className="text-4xl font-extrabold text-cyan-400 mb-6 text-center border-b border-gray-700 pb-3">
          🛒 Tu Carrito de Películas ({totalItems})
        </h1>

        {totalItems === 0 ? (
          <p className="text-gray-400 text-center py-10 text-lg italic">
            No hay películas en el carrito. ¡Agrega algo del catálogo! 🎬
          </p>
        ) : (
          <div className="space-y-4">
            {carrito.map((p) => (
              <div
                key={p.id}
                className="bg-gray-700 p-4 rounded-lg flex items-center shadow-md transition-shadow hover:shadow-cyan-500/20"
              >
                {/* Miniatura de la imagen (si está disponible) */}
                <img
                  src={p.imagen}
                  alt={p.titulo}
                  className="w-16 h-20 object-cover rounded-md mr-4 border border-cyan-500/50"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/100x120/4a5568/99f6e4?text=🎥";
                  }}
                />

                {/* Título */}
                <span className="flex-grow text-lg font-semibold text-white">
                  {p.titulo}
                </span>

                {/* Botón Eliminar */}
                <button
                  onClick={() => eliminar(p.id)} // 💡 Usar el ID para eliminar, más seguro que el título
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-200 ml-4 shadow-md"
                >
                  Eliminar
                </button>
              </div>
            ))}

            {/* Botón de Pago (Ejemplo) */}
            <div className="pt-6 border-t border-gray-700 mt-6">
              <button
                className="w-full bg-cyan-600 text-gray-900 py-3 rounded-lg font-bold hover:bg-cyan-500 transition duration-300 shadow-xl shadow-cyan-500/50 uppercase text-lg tracking-widest"
                onClick={() => alert(`Procediendo al pago de ${totalItems} películas...`)}
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}