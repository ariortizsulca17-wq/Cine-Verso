// src/Componentes/DashboardAdmi/WidgetCliente.jsx (NUEVO)

import React from 'react';
import { ShoppingBag, Landmark } from 'lucide-react';

export default function WidgetCliente({ cliente, index }) {

    const { nombre, totalCompras, totalGastado } = cliente;

    return (
        <div className="flex items-center p-3 bg-gray-700/50 rounded-lg transition duration-200 hover:bg-gray-700 border-l-4 border-green-500">

            <span className="text-2xl font-bold mr-4 text-green-400 w-8 text-center">{index}</span>

            <div className="flex-1 min-w-0">
                <p className="text-base font-semibold truncate text-white" title={nombre}>
                    {nombre}
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-0.5 space-x-3">
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