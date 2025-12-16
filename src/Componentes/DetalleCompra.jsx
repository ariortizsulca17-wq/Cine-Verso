// src/Componentes/DetalleCompra.jsx
import React from 'react';
import {
  X,
  Calendar,
  Clock,
  Mail,
  CheckCircle,
  Film,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../Context/ThemeContext';

export default function DetalleCompra({ compra, onClose }) {
  const { theme } = useTheme();
  if (!compra) return null;

  const purchaseDate = compra.fecha?.toDate ? compra.fecha.toDate() : null;
  const itemCount =
    compra.itemCount || (Array.isArray(compra.items) ? compra.items.length : 0);
  const totalSimulado = itemCount * 9.99;

  const containerBg = theme === 'dark' ? 'bg-black/80' : 'bg-white/80';
  const modalBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const borderColor =
    theme === 'dark' ? 'border-cyan-600/50' : 'border-cyan-500/50';
  const headerBg = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-200';
  const headerText = theme === 'dark' ? 'text-cyan-400' : 'text-cyan-700';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const lineBorder =
    theme === 'dark' ? 'border-gray-700/50' : 'border-gray-300/50';

  const detailLabelClass = `text-[11px] sm:text-xs font-semibold uppercase tracking-wider ${subTextColor}`;
  const detailValueClass = `text-xs sm:text-sm font-medium ${textColor}`;
  const detailLineClass = `flex justify-between items-start gap-4 py-2 border-b ${lineBorder}`;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${containerBg} backdrop-blur-sm p-3 sm:p-4`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border-4 ${borderColor} ${modalBg}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* HEADER */}
        <header
          className={`${headerBg} text-center px-4 sm:px-6 py-5 border-b ${borderColor}`}
        >
          <h2
            className={`text-lg sm:text-xl font-extrabold uppercase tracking-widest ${headerText}`}
          >
            Boleta de Compra
          </h2>
          <p className={`text-xs sm:text-sm font-mono mt-1 ${subTextColor}`}>
            ID:{' '}
            <span className={`${textColor} break-all`}>
              {compra.id.slice(-10)}
            </span>
          </p>
        </header>

        {/* CONTENIDO */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* INFO */}
          <h3
            className={`text-base sm:text-lg font-bold ${textColor} border-b ${lineBorder} pb-2 flex items-center gap-2`}
          >
            <Calendar className="w-4 h-4 text-cyan-500" />
            Información de la Transacción
          </h3>

          <div className="space-y-2">
            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <Calendar className="w-3 h-3 inline mr-1" /> Día
              </span>
              <span className={`${detailValueClass} text-right`}>
                {purchaseDate
                  ? format(purchaseDate, "dd 'de' MMMM yyyy", { locale: es })
                  : 'N/A'}
              </span>
            </div>

            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <Clock className="w-3 h-3 inline mr-1" /> Hora
              </span>
              <span className={detailValueClass}>
                {purchaseDate
                  ? format(purchaseDate, 'HH:mm:ss', { locale: es })
                  : 'N/A'}
              </span>
            </div>

            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <Mail className="w-3 h-3 inline mr-1" /> Enviado a
              </span>
              <span
                className={`text-xs sm:text-sm font-medium text-right break-all ${textColor}`}
              >
                {compra.email ||
                  compra.correo ||
                  compra.userEmail ||
                  'N/A'}
              </span>
            </div>

            <div className={detailLineClass}>
              <span className={detailLabelClass}>
                <CheckCircle className="w-3 h-3 inline mr-1" /> Estado
              </span>
              <span className="text-xs sm:text-sm font-bold text-green-500 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Enviado
              </span>
            </div>
          </div>

          {/* ITEMS */}
          <h3
            className={`text-base sm:text-lg font-bold ${textColor} border-b ${lineBorder} pb-2 pt-2 flex items-center gap-2`}
          >
            <Film className="w-4 h-4 text-cyan-500" />
            Artículos ({itemCount})
          </h3>

          <div className="space-y-1">
            {(Array.isArray(compra.items) ? compra.items : []).map(
              (item, index) => {
                const title =
                  typeof item === 'string'
                    ? item
                    : item?.titulo || 'Película';
                return (
                  <div
                    key={index}
                    className="flex justify-between gap-4 text-xs sm:text-sm py-1 border-b border-gray-700/30"
                  >
                    <span className="text-gray-400 break-words">
                      · {title}
                    </span>
                    <span className="text-cyan-500 font-semibold">x1</span>
                  </div>
                );
              }
            )}
          </div>

          {/* TOTAL */}
          <div className="pt-4 border-t-4 border-double border-gray-700 flex justify-between items-center">
            <span className="flex items-center gap-1 text-cyan-500 font-extrabold text-lg">
              <DollarSign className="w-5 h-5" />
              TOTAL
            </span>
            <span className="text-lg font-extrabold ${textColor}">
              ${totalSimulado.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
