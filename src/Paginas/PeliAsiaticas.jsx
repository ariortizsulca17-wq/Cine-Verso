import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import peliculas from "../Componentes/PeliculasData";
// 💡 Importamos íconos de Lucide React
import { Film, Globe, Filter } from "lucide-react"; 

export default function PeliAsiaticas() {
  const { theme } = useTheme();
  
  // Mantenemos solo el estado de Género
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");

  // 1. Filtramos solo películas asiáticas/anime (la base)
  const peliculasAsiaticasBase = useMemo(() => peliculas.filter(
    (p) =>
      p.categoria === "Asiaticas" ||
      p.categoria === "Asiáticas" ||
      p.categoria === "Animes"
  ), []);

  // 2. Obtenemos géneros únicos para el filtro
  const generosDisponibles = useMemo(() => [
    "Todos", 
    ...new Set(peliculasAsiaticasBase.map((p) => p.genero))
  ], [peliculasAsiaticasBase]);
    
  // 3. Filtro final (solo por género)
  const peliculasFiltradas = useMemo(() => {
    if (generoSeleccionado === "Todos") {
      return peliculasAsiaticasBase;
    }
    return peliculasAsiaticasBase.filter((p) => p.genero === generoSeleccionado);
  }, [generoSeleccionado, peliculasAsiaticasBase]);

  // --- ESTILOS DE BOTONES (Consistentes) ---

  const btnBase = "w-full text-left px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-300";
  const btnDefault = theme === "dark" 
    ? "bg-[#1A1F25] text-gray-300 hover:bg-[#00C8D7]/20 hover:text-[#00C8D7] border border-transparent" 
    : "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300";
  const btnSelected = "bg-[#00C8D7] text-black shadow-md shadow-[#00C8D7]/50 font-bold";

  return (
    <div
      className={`flex flex-col p-6 min-h-screen transition-colors duration-500 font-sans ${
        theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
      }`}
    >
      <header className="mb-8 text-center sm:text-left">
        <h1
          className={`flex items-center justify-center sm:justify-start text-4xl font-extrabold mb-2 ${
            theme === "dark" ? "text-[#00C8D7]" : "text-[#007D85]"
          }`}
        >
          <Globe className="w-8 h-8 mr-3" />
          Cine Asiático y Oriental
        </h1>
        <p className={`text-lg ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Explora lo mejor del cine asiático y de animación oriental.
        </p>
      </header>

      {/* ⭐⭐⭐ CONTENEDOR PRINCIPAL: SIDEBAR + PELÍCULAS ⭐⭐⭐ */}
      <div className="md:grid md:grid-cols-4 md:gap-8">
        
        {/* === COLUMNA DE FILTRO (SIDEBAR VERTICAL - UN SOLO NIVEL) === */}
        <aside
          className={`col-span-1 mb-8 md:mb-0 p-4 rounded-xl shadow-xl sticky top-4 self-start ${
            theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
          }`}
        >
          <h2 className={`text-xl font-bold flex items-center mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}>
            <Filter className="w-5 h-5 mr-2" />
            Filtrar por Género
          </h2>
          
          {/* Contenedor de Píldoras Verticales */}
          <div className="flex flex-col gap-3">
            {generosDisponibles.map((g, i) => (
              <button
                key={i}
                onClick={() => setGeneroSeleccionado(g)}
                className={`${btnBase} ${
                  generoSeleccionado === g ? btnSelected : btnDefault
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </aside>

        {/* === CONTENIDO PRINCIPAL (3/4 de la pantalla) === */}
        <main className="md:col-span-3">
          <h2 className={`text-3xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
            Contenido Seleccionado
          </h2>

          {peliculasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-500/50 rounded-xl">
              <p
                className={`text-xl font-semibold ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No hay películas disponibles de "{generoSeleccionado}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {peliculasFiltradas.map((p, i) => (
                <div
                  key={p.id || i}
                  className={`rounded-xl overflow-hidden shadow-2xl hover:scale-[1.03] transition-transform duration-300 relative ${
                    theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
                  } transform hover:shadow-cyan-500/50`}
                >
                  <Link to={`/detalle/${p.id}`}>
                    <img
                      src={p.imagen}
                      alt={p.titulo}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                    />
                    <div className="p-3">
                      <h2 
                        className="text-lg font-bold mb-1 truncate hover:text-[#00C8D7] transition-colors"
                        title={p.titulo}
                      >
                        {p.titulo}
                      </h2>
                      <p
                        className={`text-sm mb-3 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {p.genero} • {p.anio}
                      </p>
                    </div>
                  </Link>

                  <Link
                    to={`/detalle/${p.id}`}
                    className="block w-full text-center bg-[#00C8D7] text-black py-2 hover:bg-[#00E0FF] font-bold transition-colors text-sm uppercase tracking-wider"
                  >
                    Ver Detalle
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}