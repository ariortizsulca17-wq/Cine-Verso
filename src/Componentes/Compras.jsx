// src/Componentes/Compras.jsx
import React, { useEffect, useState } from "react";
import { ShoppingBag, Filter, Calendar, XCircle, Film, MousePointer } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext"; // 🔹 Importamos ThemeContext

import DetalleCompra from "./DetalleCompra"; 

const dashedBorderClass = "border-t border-dashed border-gray-600 my-3 pt-3";

export default function Compras() {
  const { user } = useAuth();
  const { theme } = useTheme(); // 🔹 Obtenemos el tema actual

  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(""); 

  const [selectedCompra, setSelectedCompra] = useState(null);

  const openModal = (compra) => setSelectedCompra(compra);
  const closeModal = () => setSelectedCompra(null);

  useEffect(() => {
    let unsubscribe = null;
    setError(null);
    setLoading(true);

    if (!user?.uid) {
      setLoading(false);
      return () => {};
    }

    let qBase = [
      where("uid", "==", user.uid),
      orderBy("fecha", "desc")
    ];

    if (filterDate) {
      const [year, month, day] = filterDate.split('-').map(Number);
      const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

      if (isValid(startOfDay)) {
        qBase.push(where("fecha", ">=", Timestamp.fromDate(startOfDay)));
        qBase.push(where("fecha", "<=", Timestamp.fromDate(endOfDay)));
      }
    }

    const q = query(collection(db, "compras"), ...qBase);

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          itemCount: Array.isArray(doc.data().items) ? doc.data().items.length : 0,
          ...doc.data(),
        }));
        setCompras(data);
        setLoading(false);
      },
      (err) => {
        console.error("[Compras] onSnapshot error:", err);
        setError(err);
        setCompras([]);
        setLoading(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [user, filterDate]);

  const handleClearFilter = () => setFilterDate("");

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-6 min-h-screen ${theme === "dark" ? "bg-[#0B1014]" : "bg-gray-100"}`}>
        <p className={`text-sm italic ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center text-center py-6 min-h-screen ${theme === "dark" ? "bg-[#0B1014]" : "bg-gray-100"}`}>
        <ShoppingBag className="text-red-400 w-12 h-12 mb-3" />
        <p className="text-base text-red-400 mb-1">Error al cargar compras.</p>
        <p className="text-xs text-gray-400 italic">{error.message || "Revisa la consola."}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-4 sm:p-8 min-h-screen ${theme === "dark" ? "bg-[#0B1014]" : "bg-gray-100"}`}>
      <h1 className={`text-2xl font-bold uppercase tracking-wider border-b pb-2 inline-block ${theme === "dark" ? "text-white border-cyan-600" : "text-gray-900 border-cyan-600"}`}>
        HISTORIAL DE COMPRAS
      </h1>

      {/* Filtro por Fecha */}
      <div className={`rounded-lg p-3 shadow-md border flex flex-col sm:flex-row gap-3 items-center ${theme === "dark" ? "bg-gray-800 border-gray-700/50" : "bg-white border-gray-300"}`}>
        <div className="flex items-center gap-2">
          <Filter className={`w-4 h-4 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
          <label htmlFor="filterDate" className={`text-sm font-medium whitespace-nowrap ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            Filtrar por Fecha:
          </label>
        </div>

        <div className="flex-1 w-full sm:w-auto flex gap-2">
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className={`flex-1 px-3 py-1.5 text-sm rounded-md ${theme === "dark" ? "bg-gray-700 border border-gray-600 text-white focus:border-cyan-500" : "bg-gray-200 border border-gray-400 text-gray-900 focus:border-cyan-600"} transition-colors cursor-pointer`}
          />
          <button
            onClick={handleClearFilter}
            disabled={!filterDate}
            className="px-2 py-1.5 bg-gray-600 hover:bg-gray-700 text-white font-medium text-sm rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            title="Limpiar Filtro"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mensaje no resultados */}
      {(!compras || compras.length === 0) && (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <Calendar className={`w-12 h-12 mb-3 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
          <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-700"} text-base mb-1`}>
            {filterDate ? `No hay compras el ${filterDate}.` : "Aún no tienes compras registradas."}
          </p>
          {!filterDate && <p className="text-sm text-gray-500 italic">Tus tickets aparecerán aquí.</p>}
        </div>
      )}

      {/* Listado de Compras */}
      <div className="space-y-6">
        {compras.map((compra) => {
          const itemCount = compra.itemCount || 0;
          return (
            <div
              key={compra.id}
              onClick={() => openModal(compra)}
              className={`rounded-xl shadow-2xl border p-5 relative overflow-hidden transition duration-300 ease-in-out cursor-pointer hover:scale-[1.01] hover:shadow-cyan-500/50 ${theme === "dark" ? "bg-gray-900/90 border-gray-700/80 hover:bg-gray-800/80" : "bg-white border-gray-300 hover:bg-gray-50"}`}
            >
              {/* Panel superior */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className={`w-4 h-4 ${theme === "dark" ? "text-cyan-500" : "text-cyan-600"}`} />
                    <span className={`${theme === "dark" ? "text-white" : "text-gray-900"} text-sm font-semibold uppercase tracking-widest`}>
                      TICKET #{compra.id.slice(-6)}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                    Fecha:{" "}
                    <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-900"} font-medium`}>
                      {compra.fecha?.toDate
                        ? format(compra.fecha.toDate(), "dd MMMM yyyy, HH:mm", { locale: es })
                        : "Desconocida"}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold uppercase ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>Total de artículos</p>
                  <p className={`text-xl font-extrabold ${theme === "dark" ? "text-cyan-300" : "text-cyan-700"}`}>{itemCount}</p>
                </div>
              </div>

              <div className={dashedBorderClass}></div>

              {/* Panel inferior - Películas */}
              <h3 className={`text-base font-semibold mb-3 flex items-center gap-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                <Film className={`w-4 h-4 ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`} />
                Detalle de Películas
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(Array.isArray(compra.items) ? compra.items : []).slice(0, 6).map((item, idx) => {
                  const titulo = typeof item === "string" ? item : item?.titulo || "Película";
                  const imagen = typeof item === "object" && item?.imagen ? item.imagen : "https://via.placeholder.com/150/1f2937/67e8f9?text=🎬";

                  return (
                    <div key={idx} className="relative group rounded-md overflow-hidden shadow-xl border border-gray-700/50 bg-gray-900/90 transition duration-300 transform hover:scale-[1.05] hover:shadow-cyan-600/50">
                      <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-36 object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150/1f2937/67e8f9?text=🎬"; }}
                      />
                      <div className="absolute inset-0 bg-cyan-900/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white rounded-full">
                          VER
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={`absolute bottom-1 right-2 text-xs flex items-center gap-1 ${theme === "dark" ? "text-gray-600" : "text-gray-500"}`}>
                Click para ver detalle <MousePointer className="w-3 h-3"/>
              </div>
            </div>
          );
        })}
      </div>

      <DetalleCompra compra={selectedCompra} onClose={closeModal} />
    </div>
  );
}
