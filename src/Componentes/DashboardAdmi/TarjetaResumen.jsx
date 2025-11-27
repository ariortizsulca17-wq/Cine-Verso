// src/Componentes/DashboardAdmi/TarjetaResumen.jsx

import React from 'react';
// Asumimos que los iconos como Users, Film, etc., vienen de lucide-react

/**
 * Tarjeta simple para mostrar una métrica clave en el Dashboard.
 * * @param {object} props - Propiedades del componente.
 * @param {string} props.title - Título de la métrica (ej. "Total de Usuarios").
 * @param {(string|number)} props.value - El valor de la métrica (ej. 1500).
 * @param {React.Component} props.icon - Icono de lucide-react (ej. Users).
 * @param {string} props.color - Color principal para el icono y el texto de énfasis (ej. 'cyan', 'yellow').
 */
export default function TarjetaResumen({ title, value, icon: Icon, color = 'cyan' }) {
    
    // Clases dinámicas de Tailwind basadas en la prop 'color'
    const iconClasses = `text-${color}-400 bg-${color}-600/20 p-3 rounded-full`;
    const valueClasses = `text-3xl font-bold text-${color}-400`;

    return (
        <div className="flex items-center justify-between p-5 bg-gray-800 rounded-xl shadow-lg border-l-4 border-cyan-500/50 hover:shadow-cyan-900/50 transition-shadow duration-300">
            
            {/* Contenido de la métrica */}
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">
                    {title}
                </p>
                <p className={valueClasses}>
                    {value}
                </p>
            </div>

            {/* Icono de la métrica */}
            <div className={iconClasses}>
                {Icon && <Icon className="w-6 h-6" />}
            </div>
        </div>
    );
}