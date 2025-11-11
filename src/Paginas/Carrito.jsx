import React, { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../Context/AuthContext";

export default function Carrito() {
  const [carrito, setCarrito] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(carritoGuardado);
  }, []);

  const eliminar = (id) => {
    const nuevoCarrito = carrito.filter((p) => p.id !== id);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    setCarrito(nuevoCarrito);
  };

  const totalItems = carrito.length;

  // Calcula total si tus items tienen price, si no quedará 0
  const totalAmount = carrito.reduce((acc, it) => acc + (it.price || 0), 0);

  const finalizarCompra = async () => {
    if (!user) {
      alert("Debes iniciar sesión para realizar una compra.");
      return;
    }

    if (carrito.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    setIsSaving(true);

    try {
      // Guardamos título e imagen de cada película
const itemsConImagen = carrito.map((p) => ({
  titulo: p.titulo || p.title || "Sin título",
  imagen: p.imagen || "https://via.placeholder.com/150x220/1f2937/67e8f9?text=🎬"
}));

const compra = {
  uid: user.uid,
  email: user.email || null,
  items: itemsConImagen, // 👈 guardamos objetos con imagen y título
  cantidad: carrito.length,
  total: totalAmount,
  fecha: serverTimestamp(),
};

      await addDoc(collection(db, "compras"), compra);

      alert("✅ ¡Compra realizada con éxito!");
      localStorage.removeItem("carrito");
      setCarrito([]);
    } catch (error) {
      console.error("Error al guardar la compra:", error);
      alert("❌ Ocurrió un error al guardar la compra.");
    } finally {
      setIsSaving(false);
    }
  };

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
                <img
                  src={p.imagen}
                  alt={p.titulo}
                  className="w-16 h-20 object-cover rounded-md mr-4 border border-cyan-500/50"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/100x120/4a5568/99f6e4?text=🎥";
                  }}
                />
                <span className="flex-grow text-lg font-semibold text-white">
                  {p.titulo}
                </span>
                <button
                  onClick={() => eliminar(p.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition duration-200 ml-4 shadow-md"
                >
                  Eliminar
                </button>
              </div>
            ))}

            {/* Info opcional de total */}
            {totalAmount > 0 && (
              <div className="text-right text-gray-300 font-semibold">
                Total: S/ {totalAmount.toFixed(2)}
              </div>
            )}

            <div className="pt-6 border-t border-gray-700 mt-6">
              <button
                onClick={finalizarCompra}
                disabled={isSaving}
                className={`w-full py-3 rounded-lg font-bold uppercase text-lg tracking-widest shadow-xl transition
                  ${isSaving ? "bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-cyan-600 text-gray-900 hover:bg-cyan-500"}`}
              >
                {isSaving ? "Procesando..." : "Finalizar Compra"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
