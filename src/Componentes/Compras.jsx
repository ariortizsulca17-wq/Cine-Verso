// src/Componentes/Compras.jsx
import React, { useEffect, useState } from "react";
import { ShoppingBag, Filter, Calendar, XCircle, Film, MousePointer } from "lucide-react"; // Añadido MousePointer
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "../Context/AuthContext";

// Importar el nuevo componente DetalleCompra
import DetalleCompra from "./DetalleCompra"; 

const dashedBorderClass = "border-t border-dashed border-gray-600 my-3 pt-3";

export default function Compras() {
  const { user } = useAuth();
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState(""); 
  
  // 💡 ESTADOS DEL MODAL
  const [selectedCompra, setSelectedCompra] = useState(null); // Almacena la compra para el modal

  // 💡 Lógica para abrir/cerrar el modal
  const openModal = (compra) => {
    setSelectedCompra(compra);
  };

  const closeModal = () => {
    setSelectedCompra(null);
  };
  
  // ... (El resto del useEffect es igual)
  useEffect(() => {
    let unsubscribe = null;
    setError(null);
    setLoading(true);

    if (!user || !user.uid) {
      setLoading(false); 
      return () => {};
    }

    let qBase = [
      where("uid", "==", user.uid),
      orderBy("fecha", "desc")
    ];

    if (filterDate) {
      // CORRECCIÓN DE TIME ZONE (Se mantiene la lógica anterior)
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
          // Recuento correcto
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

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, filterDate]);

  const handleClearFilter = () => {
    setFilterDate("");
  };
  // ... (Fin del useEffect)

  // --- Renderizado de estados: Cargando, Error ---
  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <p className="text-sm text-gray-400 italic">Cargando tus compras...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-6">
        <ShoppingBag className="text-red-400 w-12 h-12 mb-3" />
        <p className="text-base text-red-400 mb-1">Error al cargar compras.</p>
        <p className="text-xs text-gray-400 italic">{error.message || "Revisa la consola."}</p>
      </div>
    );
  }

  // --- Renderizado principal ---
  return (
    <div className="space-y-6">
      {/* ... (Controles de filtro y títulos - sin cambios) ... */}
      <h1 className="text-2xl font-bold uppercase tracking-wider text-white border-b border-cyan-600 pb-2 inline-block">
        HISTORIAL DE COMPRAS
      </h1>

      {/* 📅 Sección de Filtro por Fecha (Compacta) */}
      <div className="bg-gray-800 rounded-lg p-3 shadow-md border border-gray-700/50 flex flex-col sm:flex-row gap-3 items-center">
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          <label htmlFor="filterDate" className="text-sm font-medium text-gray-300 whitespace-nowrap">
            Filtrar por Fecha:
          </label>
        </div>

        <div className="flex-1 w-full sm:w-auto flex gap-2">
          <input
            type="date"
            id="filterDate"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm rounded-md bg-gray-700 border border-gray-600 text-white focus:border-cyan-500 transition-colors cursor-pointer"
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

      {/* 🚨 Mensaje de no resultados */}
      {(!compras || compras.length === 0) && (
        <div className="flex flex-col items-center justify-center text-center py-6">
          <Calendar className="text-gray-600 w-12 h-12 mb-3" />
          <p className="text-base text-gray-400 mb-1">
            {filterDate ? 
              `No hay compras el ${filterDate}.` : 
              "Aún no tienes compras registradas."
            }
          </p>
          {!filterDate && (
            <p className="text-sm text-gray-500 italic">
              Tus tickets aparecerán aquí.
            </p>
          )}
        </div>
      )}

      {/* 🧾 Listado de Compras (Ahora son clickeables) */}
      <div className="space-y-6">
        {compras.map((compra) => {
          const itemCount = compra.itemCount || 0; 
          
          return (
            <div
              key={compra.id}
              onClick={() => openModal(compra)} // 💡 ABRIR MODAL AL CLIC
              className="bg-gray-900/90 rounded-xl shadow-2xl border border-gray-700/80 p-5 
                         transition duration-300 ease-in-out hover:border-cyan-600/50 relative overflow-hidden
                         cursor-pointer hover:bg-gray-800/80" // 💡 Estilos de clickeable
            >
              {/* 🔶 Panel Superior (Resumen y Metadatos) */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                      <ShoppingBag className="w-4 h-4 text-cyan-500" />
                      <span className="text-sm font-semibold text-white uppercase tracking-widest">
                          TICKET #{compra.id.slice(-6)}
                      </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                      Fecha:{" "}
                      <span className="font-medium text-gray-200">
                          {compra.fecha?.toDate
                          ? format(compra.fecha.toDate(), "dd MMMM yyyy, HH:mm", { locale: es })
                          : "Desconocida"}
                      </span>
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-cyan-400 font-bold uppercase">
                      Total de artículos
                  </p>
                  <p className="text-xl font-extrabold text-cyan-300">
                      {itemCount}
                  </p>
                </div>
              </div>

              {/* Línea de Corte (perforación simulada) */}
              <div className={dashedBorderClass}></div>

              {/* 🎬 Panel Inferior (Lista de Películas) */}
              <h3 className="text-base text-gray-300 font-semibold mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 text-gray-500" />
                  Detalle de Películas
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                {(Array.isArray(compra.items) ? compra.items : []).slice(0, 6).map((item, idx) => { // Mostrar solo las primeras 6 para vista previa
                  const titulo = typeof item === "string" ? item : item?.titulo || "Película";
                  const imagen =
                    typeof item === "object" && item?.imagen
                      ? item.imagen
                      : "https://via.placeholder.com/150/1f2937/67e8f9?text=🎬";

                  return (
                    <div
                      key={idx}
                      className="relative group rounded-md overflow-hidden shadow-xl border border-gray-700/50 bg-gray-900/90 transition duration-300 transform hover:scale-[1.05] hover:shadow-cyan-600/50"
                    >
                      <img
                        src={imagen}
                        alt={titulo}
                        className="w-full h-36 object-cover" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150/1f2937/67e8f9?text=🎬";
                        }}
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
              <div className="absolute bottom-1 right-2 text-xs text-gray-600 flex items-center gap-1">
                 Click para ver detalle <MousePointer className="w-3 h-3"/>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* 💡 RENDERIZAR EL MODAL */}
      <DetalleCompra 
        compra={selectedCompra} 
        onClose={closeModal} 
      />
    </div>
  );
}