// src/Componentes/DashboardAdmi/WidgetPelicula.jsx
import { Film, Star, Calendar } from 'lucide-react';
import { useTheme } from "../../Context/ThemeContext";

const WidgetPelicula = ({ movie, type }) => {
    const { theme } = useTheme();

    // Colores dinámicos según el tema
    const bgCard = theme === "dark" ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200";
    const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
    const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
    const iconAdded = theme === "dark" ? "bg-cyan-600/20 text-cyan-400" : "bg-cyan-200/30 text-cyan-600";
    const iconEdited = theme === "dark" ? "bg-yellow-600/20 text-yellow-400" : "bg-yellow-200/30 text-yellow-600";
    const starColor = theme === "dark" ? "fill-yellow-400 text-yellow-400" : "fill-yellow-500 text-yellow-500";
    const buttonColor = theme === "dark" ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-500";

    return (
        <div className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${bgCard}`}>
            
            {/* Icono de tipo */}
            <div className={`p-2 rounded-full ${type === 'added' ? iconAdded : iconEdited}`}>
                 <Film className="w-5 h-5" />
            </div>

            {/* Información */}
            <div className="flex-1">
                <h3 className={`text-sm font-semibold truncate ${textPrimary}`}>{movie.titulo}</h3>
                <div className={`flex items-center text-xs mt-1 gap-3 ${textSecondary}`}>
                    {movie.rating && (
                        <span className="flex items-center gap-1">
                            <Star className={`w-3 h-3 ${starColor}`} /> {movie.rating.toFixed(1)}
                        </span>
                    )}
                    {(movie.added || movie.edited) && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> 
                            {type === 'added' ? `Agregada: ${movie.added}` : `Editada: ${movie.edited}`}
                        </span>
                    )}
                </div>
            </div>
            
            {/* Botón de acción (opcional) */}
            <button className={`text-xs font-medium ${buttonColor}`}>
                Ver Detalles
            </button>
        </div>
    );
};

export default WidgetPelicula;
