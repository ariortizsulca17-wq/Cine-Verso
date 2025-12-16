// src/Componentes/DashboardAdmi/WidgetCliente.jsx
import React from 'react';
import { ShoppingBag, Landmark } from 'lucide-react';
import { useTheme } from "../../Context/ThemeContext";

export default function WidgetCliente({ cliente, index }) {
    const { theme } = useTheme(); // <-- Usamos ThemeContext

    const { nombre, totalCompras, totalGastado } = cliente;

    // Colores dinámicos según el tema
    const bgCard = theme === "dark" ? "bg-gray-700/50 hover:bg-gray-700" : "bg-gray-100/50 hover:bg-gray-200";
    const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
    const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
    const borderColor = theme === "dark" ? "border-green-500" : "border-green-600";
    const indexColor = theme === "dark" ? "text-green-400" : "text-green-600";

    return (
        <div className={`flex items-center p-3 rounded-lg transition duration-200 border-l-4 ${borderColor} ${bgCard}`}>

            <span className={`text-2xl font-bold mr-4 w-8 text-center ${indexColor}`}>{index}</span>

            <div className="flex-1 min-w-0">
                <p className={`text-base font-semibold truncate ${textPrimary}`} title={nombre}>
                    {nombre}
                </p>
                <div className={`flex items-center text-xs mt-0.5 space-x-3 ${textSecondary}`}>
                    <span className="flex items-center">
                        <ShoppingBag className="w-3 h-3 mr-1" />
                        {totalCompras} Compras
                    </span>
                    <span className="flex items-center">
                        <Landmark className="w-3 h-3 mr-1" />
                        Gastado: ${parseFloat(totalGastado).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    );
}
