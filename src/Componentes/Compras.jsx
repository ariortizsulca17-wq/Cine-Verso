// src/Componentes/Compras.jsx
import React, { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../Context/AuthContext";

export default function Compras() {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true); // muestra "Cargando..." hasta tener resultados
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe = null;
    setError(null);
    setLoading(true);

    // Si el user aún no está disponible, esperamos (el effect se volverá a ejecutar cuando cambie)
    if (!user || !user.uid) {
      // No limpiamos compras aquí para evitar parpadeos; solo mostramos carga hasta que user exista.
      return () => {
        // noop cleanup — volverá a ejecutarse cuando user cambie
      };
    }

    // Consulta en tiempo real para las compras del usuario
    const q = query(
      collection(db, "compras"),
      where("uid", "==", user.uid),
      orderBy("fecha", "desc")
    );

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("[Compras] snapshot:", data);
        setCompras(data);
        setLoading(false);
      },
      (err) => {
        // Manejo de errores (p. ej. falta de índice o reglas)
        console.error("[Compras] onSnapshot error:", err);
        setError(err);
        setCompras([]);
        setLoading(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-400 text-lg italic">Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-10">
        <ShoppingBag className="text-cyan-600 w-16 h-16 mb-4" />
        <p className="text-red-400 text-lg mb-2">Error al cargar compras.</p>
        <p className="text-gray-400 italic">{error.message || "Revisa la consola para más detalles."}</p>
      </div>
    );
  }

  if (!compras || compras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-10">
        <ShoppingBag className="text-cyan-600 w-16 h-16 mb-4" />
        <p className="text-gray-400 text-lg mb-2">Aún no tienes compras registradas.</p>
        <p className="text-gray-500 italic">
          Cuando compres, aparecerán aquí tus tickets 🎟️
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white border-b-2 border-cyan-600 pb-3 inline-block">
        MIS COMPRAS
      </h1>

      {compras.map((compra) => (
        <div
          key={compra.id}
          className="bg-gray-800/80 rounded-xl shadow-xl border border-gray-700 p-6 backdrop-blur-md"
        >
          {/* 🕓 Encabezado */}
          <div className="flex justify-between items-center mb-5 border-b border-gray-600 pb-3">
            <div>
              <p className="text-sm text-cyan-400 uppercase tracking-wide font-semibold">
                {compra.fecha?.toDate
                  ? format(compra.fecha.toDate(), "dd 'de' MMMM yyyy, HH:mm", { locale: es })
                  : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Total de películas:{" "}
                <span className="font-semibold text-white">{compra.cantidad}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <ShoppingBag className="w-4 h-4 text-cyan-500" />
              <span>Compra #{compra.id.slice(-5)}</span>
            </div>
          </div>

          {/* 🎬 Películas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {(Array.isArray(compra.items) ? compra.items : []).map((item, idx) => {
              const titulo = typeof item === "string" ? item : item?.titulo || "Película";
              const imagen =
                typeof item === "object" && item?.imagen
                  ? item.imagen
                  : "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬";

              return (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-600/30 border border-gray-700 bg-gray-900/80 transition-transform transform hover:-translate-y-1"
                >
                  <img
                    src={imagen}
                    alt={titulo}
                    className="w-full h-56 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬";
                    }}
                  />
                  <div className="p-3 text-center bg-gray-800/80">
                    <p className="text-gray-100 font-semibold text-sm truncate">
                      {titulo}
                    </p>
                  </div>

                  {/* ✨ Hover Overlay */}
                  <div className="absolute inset-0 bg-cyan-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white text-xs font-semibold uppercase tracking-wide">
                      Ver Detalles
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
