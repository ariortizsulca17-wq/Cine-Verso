// src/Componentes/DetalleCompra.jsx
import React from 'react';
import { X, Calendar, Clock, Mail, CheckCircle, Film, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Clases de estilo compartidas
const detailLabelClass = "text-xs font-semibold text-gray-400 uppercase tracking-wider";
const detailValueClass = "text-sm text-white font-medium";
const detailLineClass = "flex justify-between items-center py-1 border-b border-gray-700/50";

export default function DetalleCompra({ compra, onClose }) {
  if (!compra) return null;

  // Extraer y formatear datos
  const purchaseDate = compra.fecha?.toDate ? compra.fecha.toDate() : null;
  const itemCount = compra.itemCount || (Array.isArray(compra.items) ? compra.items.length : 0);
  const totalSimulado = itemCount * 9.99; // Simulación de precio total

  /* // 🚫 ELIMINADO: Este bloque de código no se utiliza en el renderizado y causaba advertencias/errores
  const primerItem = Array.isArray(compra.items) && compra.items.length > 0 
    ? (typeof compra.items[0] === 'string' ? { titulo: compra.items[0] } : compra.items[0])
    : {};
  const tituloPelicula = primerItem.titulo || "Múltiples Películas"; 
  */

  return (
    // Contenedor principal del Modal (Overlay)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      
      {/* Contenido del Modal (La Boleta) */}
      <div 
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto 
                   border-4 border-cyan-600/50 relative"
        onClick={e => e.stopPropagation()} // Evita que el clic dentro cierre el modal
      >
        {/* Botón de Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-1 rounded-full bg-gray-700 hover:bg-red-500 text-white transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* --- Encabezado de la Boleta --- */}
        <header className="bg-gray-900 text-center p-6 border-b border-cyan-600">
          <h2 className="text-xl font-extrabold uppercase tracking-widest text-cyan-400 mb-1">
            BOLETA DE COMPRA
          </h2>
          <p className="text-sm text-gray-500 font-mono">
            Transacción ID: <span className="text-white">{compra.id.slice(-10)}</span>
          </p>
        </header>

        {/* --- Cuerpo de la Boleta (Detalles Generales) --- */}
        <div className="p-6 space-y-4">
          
          <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-500" />
            Información de la Transacción
          </h3>

          <div className="space-y-2">
            
            {/* Fecha */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}><Calendar className="w-3 h-3 inline mr-1"/> Día</span>
              <span className={detailValueClass}>
                {purchaseDate ? format(purchaseDate, "EEEE, dd 'de' MMMM yyyy", { locale: es }) : 'N/A'}
              </span>
            </div>

            {/* Hora */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}><Clock className="w-3 h-3 inline mr-1"/> Hora</span>
              <span className={detailValueClass}>
                {purchaseDate ? format(purchaseDate, "HH:mm:ss", { locale: es }) : 'N/A'}
              </span>
            </div>
            
            {/* Correo */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}><Mail className="w-3 h-3 inline mr-1"/> Enviado a</span>
              <span className="text-sm text-white font-medium truncate max-w-[60%] text-right">{compra.email || compra.correo || compra.userEmail || 'N/A'}</span>
            </div>

            {/* Estado */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}><CheckCircle className="w-3 h-3 inline mr-1"/> Estado</span>
              <span className="text-sm font-bold text-green-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1"/> Enviado Correctamente
              </span>
            </div>
            
          </div>
          
          {/* --- Detalles de Artículos --- */}
          <h3 className="text-lg font-bold text-white border-b border-gray-700 pb-2 pt-4 flex items-center gap-2">
            <Film className="w-4 h-4 text-cyan-500" />
            Artículos Comprados ({itemCount})
          </h3>

          <div className="space-y-1">
            {/* Lista de títulos */}
            {(Array.isArray(compra.items) ? compra.items : []).map((item, index) => {
              const itemTitle = typeof item === 'string' ? item : item?.titulo || 'Película Desconocida';
              return (
                <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-800">
                  <span className="text-gray-300 ml-4">· {itemTitle}</span>
                  <span className="text-cyan-300">x1</span>
                </div>
              );
            })}
          </div>

          {/* --- Resumen Final (Simulado) --- */}
          <div className="pt-4 border-t-4 border-double border-gray-700">
             <div className="flex justify-between items-center text-xl font-extrabold">
                <span className="text-cyan-400 flex items-center"><DollarSign className="w-5 h-5 mr-1"/>TOTAL</span>
                <span className="text-white">${totalSimulado.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}