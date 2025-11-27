// src/Componentes/DashboardAdmi/ChartVentasPlaceholder.jsx (FINAL)

import React from 'react';
// Importamos los componentes de Recharts
import {
    ResponsiveContainer,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    LineChart, // <--- Nueva
    Line,      // <--- Nueva
} from 'recharts';

import { BarChart as BarChartIcon } from 'lucide-react'; 

// Recibimos la prop 'data' que contiene las ventas mensuales
export default function ChartVentasPlaceholder({ data }) {

    // Si los datos no están disponibles o están vacíos, mostramos el placeholder
    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center border border-gray-600 border-dashed rounded-lg bg-gray-700/30 p-4">
                <BarChartIcon className="w-10 h-10 text-cyan-500 mb-3" />
                <p className="text-gray-400 text-sm font-semibold">
                    Gráfico de Rendimiento
                </p>
                <p className="text-gray-500 text-xs mt-1">
                    Esperando datos de ventas para visualizar.
                </p>
            </div>
        );
    }

    


    // Renderiza el gráfico real
return (
    <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }} // Asegura margen
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                
                {/* Eje X: Usa 'mes' (DD/MM) directamente */}
                <XAxis 
                    dataKey="mes" 
                    stroke="#9CA3AF"
                    // Eliminamos el tickFormatter para que muestre '27/11'
                />
                
                {/* Eje Y: Formato de moneda para las ventas */}
                <YAxis
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `$${value.toLocaleString('es-CL', { minimumFractionDigits: 0 })}`}
                />
                
                {/* Tooltip: Usamos el nativo, pero le damos estilo */}
                <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#E5E7EB', fontWeight: 'bold' }}
                    formatter={(value) => [`$${value.toLocaleString('es-CL', { minimumFractionDigits: 2 })}`, 'Ventas']}
                />
                
                {/* Línea de Ventas */}
                <Line 
                    type="monotone" // Curva suave
                    dataKey="total" 
                    stroke="#f472b6" // Color fuchsia
                    strokeWidth={2}
                    dot={{ fill: '#f472b6', strokeWidth: 2, r: 4 }} // Puntos de datos visibles
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);
}