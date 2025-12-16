import { useLocation, Link } from "react-router-dom";
import PeliculasData from "../Componentes/PeliculasData.jsx";
import { useTheme } from "../Context/ThemeContext"; 
import { Search, Film, Frown } from "lucide-react"; // 👈 Íconos de Lucide

export default function ResultadosBusqueda() {
  const { theme } = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const termino = queryParams.get("q")?.toLowerCase() || "";
  const normalize = (str) => str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");


  // 🔎 Lógica de Filtrado
 const resultados = PeliculasData.filter((peli) => {
  const t = normalize(peli.titulo);
  const g = normalize(peli.genero);
  const c = normalize(peli.categoria);
  const a = normalize(peli.autor);
  const y = normalize(peli.anio?.toString());

  const terminoNorm = normalize(termino);

  return (
    t.includes(terminoNorm) ||
    g.includes(terminoNorm) ||
    c.includes(terminoNorm) ||
    a.includes(terminoNorm) ||
    y.includes(terminoNorm)
  );
});



  // 🎨 Clases base
  const containerClasses = `min-h-screen p-6 transition-colors duration-500 ${
    theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
  }`;
  const cardClasses = `rounded-xl overflow-hidden shadow-xl hover:scale-[1.03] transition-transform duration-300 relative cursor-pointer ${
    theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
  } transform hover:shadow-cyan-500/50`;
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  
  return (
    <div className={containerClasses}>
      <div className="max-w-6xl mx-auto">
        
        {/* === HEADER DE RESULTADOS === */}
        <header className="mb-10 p-4 border-b-2 border-cyan-500/50">
          <h1 className="flex items-center text-4xl font-extrabold mb-2">
            <Search className={`w-8 h-8 mr-3 text-cyan-400`} />
            <span className={textPrimary}>Resultados de Búsqueda</span>
          </h1>
          <p className="text-xl">
            <span className={textSecondary}>Para: </span> 
            <strong className="text-cyan-400">"{termino}"</strong>
            <span className={`ml-3 text-sm ${textSecondary}`}>
                ({resultados.length} {resultados.length === 1 ? 'película' : 'películas'} encontradas)
            </span>
          </p>
        </header>

        {/* --- */}

        {/* === CONTENIDO DE RESULTADOS === */}
        {resultados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-cyan-700/50 p-6 rounded-xl">
            <Frown className="w-12 h-12 mb-4 text-cyan-500" />
            <p className="text-xl font-semibold text-center">
              No se encontraron coincidencias para: <span className="text-cyan-400">"{termino}"</span>.
            </p>
            <p className={textSecondary}>Intenta con un término diferente o revisa la ortografía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {resultados.map((peli) => (
              <Link
                key={peli.id}
                to={`/detalle/${peli.id}`} 
                className={cardClasses}
              >
                {/* Imagen */}
                <img 
                  src={peli.imagen} 
                  alt={peli.titulo} 
                  className="w-full h-48 object-cover" 
                />
                
                {/* Contenido de la Tarjeta */}
                <div className="p-3">
                  <h3 className={`font-bold text-lg mb-1 truncate ${textPrimary} hover:text-cyan-400 transition-colors`}>
                    {peli.titulo}
                  </h3>
                  <p className={`text-sm ${textSecondary}`}>
                    <Film className="inline w-3 h-3 mr-1 align-sub" /> 
                    {peli.anio}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}