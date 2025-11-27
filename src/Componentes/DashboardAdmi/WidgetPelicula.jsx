// Ejemplo de WidgetPelicula.jsx
import { Film, Star, Calendar } from 'lucide-react';

const WidgetPelicula = ({ movie, type }) => {
    return (
        <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
            
            {/* Icono de tipo */}
            <div className={`p-2 rounded-full ${type === 'added' ? 'bg-cyan-600/20 text-cyan-400' : 'bg-yellow-600/20 text-yellow-400'}`}>
                 <Film className="w-5 h-5" />
            </div>

            {/* Información */}
            <div className="flex-1">
                <h3 className="text-sm font-semibold text-white truncate">{movie.titulo}</h3>
                <div className="flex items-center text-xs text-gray-400 mt-1 gap-3">
                    {movie.rating && (
                        <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {movie.rating.toFixed(1)}
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
            <button className="text-cyan-400 text-xs font-medium hover:text-cyan-300">
                Ver Detalles
            </button>
        </div>
    );
};

export default WidgetPelicula;