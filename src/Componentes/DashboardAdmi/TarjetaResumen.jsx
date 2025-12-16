import React from 'react';
import { useTheme } from "../../Context/ThemeContext";

/**
 * Tarjeta simple para mostrar una métrica clave en el Dashboard.
 * @param {object} props - Propiedades del componente.
 * @param {string} props.title - Título de la métrica (ej. "Total de Usuarios").
 * @param {(string|number)} props.value - El valor de la métrica (ej. 1500).
 * @param {React.Component} props.icon - Icono de lucide-react (ej. Users).
 * @param {string} props.color - Color principal para el icono y el texto de énfasis (ej. 'cyan', 'yellow').
 */
export default function TarjetaResumen({ title, value, icon: Icon, color = 'cyan' }) {
    const { theme } = useTheme(); // <-- Usamos ThemeContext

    // Colores dinámicos según el tema
    const bgCard = theme === "dark" ? "bg-gray-800 border-l-4 border-" + color + "-500/50 hover:shadow-" + color + "-900/50" 
                                    : "bg-gray-100 border-l-4 border-" + color + "-400/50 hover:shadow-" + color + "-300/50";
    const iconClasses = `text-${color}-400 bg-${color}-600/20 p-3 rounded-full`;
    const valueClasses = `text-3xl font-bold text-${color}-400`;

    // Texto del título según tema
    const titleClasses = theme === "dark" ? "text-sm font-medium text-gray-400 uppercase tracking-wider mb-1" 
                                          : "text-sm font-medium text-gray-600 uppercase tracking-wider mb-1";

    return (
        <div className={`flex items-center justify-between p-5 rounded-xl shadow-lg transition-shadow duration-300 ${bgCard}`}>
            {/* Contenido de la métrica */}
            <div className="flex flex-col">
                <p className={titleClasses}>
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
