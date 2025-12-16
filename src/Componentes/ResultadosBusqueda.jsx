import { useLocation, Link } from "react-router-dom";
import PeliculasData from "../Componentes/PeliculasData.jsx";
import { useTheme } from "../Context/ThemeContext";
import { Search, Film, Frown } from "lucide-react";

export default function ResultadosBusqueda() {
  const { theme } = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const termino = queryParams.get("q")?.toLowerCase() || "";

  const normalize = (str) =>
    str?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 🔎 FILTRO
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

  // 🎨 CLASES
  const containerClasses = `min-h-screen px-4 py-6 sm:px-6 sm:py-8 transition-colors duration-500 ${
    theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
  }`;

  const cardClasses = `rounded-xl overflow-hidden shadow-xl transform hover:scale-[1.03] transition duration-300 cursor-pointer ${
    theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
  } hover:shadow-cyan-500/40`;

  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";

  return (
    <div className={containerClasses}>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="mb-8 pb-4 border-b border-cyan-500/40">
          <h1 className="flex items-center gap-3 text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
            <Search className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />
            <span className={textPrimary}>Resultados de búsqueda</span>
          </h1>

          <p className="text-sm sm:text-base">
            <span className={textSecondary}>Para:</span>{" "}
            <strong className="text-cyan-400 break-words">"{termino}"</strong>
          </p>

          <p className={`mt-1 text-xs sm:text-sm ${textSecondary}`}>
            {resultados.length}{" "}
            {resultados.length === 1 ? "película encontrada" : "películas encontradas"}
          </p>
        </header>

        {/* CONTENIDO */}
        {resultados.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-64 border-2 border-dashed border-cyan-600/40 p-6 rounded-xl">
            <Frown className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-cyan-500" />
            <p className="text-lg sm:text-xl font-semibold mb-2">
              No se encontraron coincidencias
            </p>
            <p className={`text-sm ${textSecondary}`}>
              Intenta con otro término o revisa la ortografía.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {resultados.map((peli) => (
              <Link
                key={peli.id}
                to={`/detalle/${peli.id}`}
                className={cardClasses}
              >
                {/* IMAGEN */}
                <img
                  src={peli.imagen}
                  alt={peli.titulo}
                  className="w-full h-40 sm:h-48 object-cover"
                />

                {/* INFO */}
                <div className="p-3">
                  <h3
                    className={`font-bold text-sm sm:text-base mb-1 truncate ${textPrimary} hover:text-cyan-400 transition-colors`}
                  >
                    {peli.titulo}
                  </h3>

                  <p className={`text-xs sm:text-sm flex items-center gap-1 ${textSecondary}`}>
                    <Film className="w-3 h-3" />
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
