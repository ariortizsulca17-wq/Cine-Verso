// src/Componentes/DetalleCompra.jsx
import React from 'react';
import { X, Calendar, Clock, Mail, CheckCircle, Film, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../Context/ThemeContext'; // <-- Importamos ThemeContext

export default function DetalleCompra({ compra, onClose }) {
  const { theme } = useTheme(); // <-- Extraemos theme
  if (!compra) return null;

  const purchaseDate = compra.fecha?.toDate ? compra.fecha.toDate() : null;
  const itemCount = compra.itemCount || (Array.isArray(compra.items) ? compra.items.length : 0);
  const totalSimulado = itemCount * 9.99; // Simulación de precio total

  // --- Clases dinámicas según theme ---
  const containerBg = theme === 'dark' ? 'bg-black/80' : 'bg-white/80';
  const backdropBlur = 'backdrop-blur-sm';
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const borderColor = theme === 'dark' ? 'border-cyan-600/50' : 'border-cyan-500/50';
  const headerBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200';
  const headerText = theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const lineBorder = theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50';
  const itemText = theme === 'dark' ? 'text-gray-300' : 'text-gray-800';
  const itemCountText = theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600';
  const totalText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const totalLabel = theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600';
  const closeBtnBg = theme === 'dark' ? 'bg-gray-700 hover:bg-red-500' : 'bg-gray-200 hover:bg-red-500';

  const detailLabelClass = `text-xs font-semibold uppercase tracking-wider ${subTextColor}`;
  const detailValueClass = `text-sm font-medium ${textColor}`;
  const detailLineClass = `flex justify-between items-center py-1 border-b ${lineBorder}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${containerBg} ${backdropBlur} p-4`}
      onClick={onClose}
    >
      <div
        className={`rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border-4 ${borderColor} relative ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de Cerrar */}
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1 rounded-full ${closeBtnBg} text-white transition z-10`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <header className={`${headerBg} text-center p-6 border-b ${borderColor}`}>
          <h2 className={`text-xl font-extrabold uppercase tracking-widest ${headerText} mb-1`}>
            BOLETA DE COMPRA
          </h2>
          <p className={`text-sm font-mono ${subTextColor}`}>
            Transacción ID: <span className={`${textColor}`}>{compra.id.slice(-10)}</span>
          </p>
        </header>

        {/* Detalles Generales */}
        <div className="p-6 space-y-4">
          <h3 className={`text-lg font-bold ${textColor} border-b ${lineBorder} pb-2 flex items-center gap-2`}>
            <Calendar className="w-4 h-4 text-cyan-500" />
            Información de la Transacción
          </h3>

          <div className="space-y-2">
            {/* Fecha */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <Calendar className="w-3 h-3 inline mr-1" /> Día
              </span>
              <span className={detailValueClass}>
                {purchaseDate
                  ? format(purchaseDate, "EEEE, dd 'de' MMMM yyyy", { locale: es })
                  : 'N/A'}
              </span>
            </div>

            {/* Hora */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <Clock className="w-3 h-3 inline mr-1" /> Hora
              </span>
              <span className={detailValueClass}>
                {purchaseDate ? format(purchaseDate, "HH:mm:ss", { locale: es }) : 'N/A'}
              </span>
            </div>

            {/* Correo */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <Mail className="w-3 h-3 inline mr-1" /> Enviado a
              </span>
              <span className={`text-sm font-medium truncate max-w-[60%] text-right ${textColor}`}>
                {compra.email || compra.correo || compra.userEmail || 'N/A'}
              </span>
            </div>

            {/* Estado */}
            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <CheckCircle className="w-3 h-3 inline mr-1" /> Estado
              </span>
              <span className="text-sm font-bold text-green-400 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" /> Enviado Correctamente
              </span>
            </div>
          </div>

          {/* Artículos */}
          <h3 className={`text-lg font-bold ${textColor} border-b ${lineBorder} pb-2 pt-4 flex items-center gap-2`}>
            <Film className="w-4 h-4 text-cyan-500" /> Artículos Comprados ({itemCount})
          </h3>

          <div className="space-y-1">
            {(Array.isArray(compra.items) ? compra.items : []).map((item, index) => {
              const itemTitle = typeof item === 'string' ? item : item?.titulo || 'Película Desconocida';
              return (
                <div key={index} className="flex justify-between text-sm py-1 border-b border-gray-800">
                  <span className={`${itemText} ml-4`}>· {itemTitle}</span>
                  <span className={itemCountText}>x1</span>
                </div>
              );
            })}
          </div>

          {/* Resumen Final */}
          <div className="pt-4 border-t-4 border-double border-gray-700">
            <div className="flex justify-between items-center text-xl font-extrabold">
              <span className={`flex items-center ${totalLabel}`}>
                <DollarSign className="w-5 h-5 mr-1" />TOTAL
              </span>
              <span className={totalText}>${totalSimulado.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
