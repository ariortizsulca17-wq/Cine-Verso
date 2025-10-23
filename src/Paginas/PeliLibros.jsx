import React, { useState, useMemo } from "react"; // 👈 Importamos useMemo
import { Link } from "react-router-dom"; // 👈 Importamos Link para la navegación
import { useTheme } from "../Context/ThemeContext";
import peliculas from "../Componentes/PeliculasData";

export default function PeliLibros() {
  const { theme } = useTheme();
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");

  // 1. Filtramos la lista base de películas (usamos useMemo para optimizar)
  const peliculasLibros = useMemo(() => peliculas.filter(
    (peli) => peli.categoria.toLowerCase() === "basadas en libros"
  ), []);

  // 2. Obtenemos géneros únicos para el desplegable (usamos useMemo)
  const generos = useMemo(() =>
    ["Todos", ...new Set(peliculasLibros.map((p) => p.genero))]
    , [peliculasLibros]);

  // 3. Filtramos según el género seleccionado (usamos useMemo)
  const peliculasFiltradas = useMemo(() => {
    return generoSeleccionado === "Todos"
      ? peliculasLibros
      : peliculasLibros.filter((p) => p.genero === generoSeleccionado);
  }, [generoSeleccionado, peliculasLibros]);


  return (
    <div
      className={`flex flex-col p-6 gap-6 min-h-screen transition-colors duration-500 ${theme === "dark"
          ? "bg-[#0B1014] text-white"
          : "bg-[#f2f5f7] text-black"
        }`}
    >
      {/* 🛑 Reemplazamos el 'aside' por el FILTRO DESPLEGABLE */}
      <div
        className={`w-full mb-6 p-4 rounded-xl shadow-md ${theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
          }`}
      >
        <div className="flex-1 max-w-lg mx-auto">
          <label
            htmlFor="genero-select"
            className="block text-sm font-medium mb-1 text-[#00C8D7] text-center"
          >
            Filtrar por Género Literario
          </label>
          <select
            id="genero-select"
            value={generoSeleccionado}
            onChange={(e) => setGeneroSeleccionado(e.target.value)}
            className={`w-full p-2 rounded-lg border-2 appearance-none cursor-pointer 
 ${theme === "dark"
                ? "bg-[#0B1014] border-[#00C8D7] text-white"
                : "bg-white border-gray-300 text-black"
              }`}
          >
            {generos.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔹 Catálogo de películas */}
      <main className="flex-1 transition-colors duration-500">
        <h1 className="text-3xl font-bold text-[#00C8D7] mb-6 text-center sm:text-left">
          📚 Películas basadas en libros
        </h1>

        {peliculasFiltradas.length === 0 ? (
          <p
            className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
          >
            No hay películas disponibles en este género 😢
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {peliculasFiltradas.map((peli, index) => (
              <div
                key={peli.id || index}
                className={`p-3 rounded-xl shadow-md hover:scale-105 transition-transform duration-300 ${theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
                  }`}
              >
                {/* 🎯 Envolvemos el contenido clickeable en Link */}
                <Link to={`/detalle/${peli.id}`}>
                  <img
                    src={peli.imagen}
                    alt={peli.titulo}
                    className="rounded-lg mb-2 w-full h-48 object-cover cursor-pointer"
                  />
                  {/* Título clickeable */}
                  <h3 className="text-lg font-semibold truncate hover:text-[#00C8D7] transition-colors">
                    {peli.titulo}
                  </h3>
                </Link> {/* Cierre del Link para el título/imagen */}

                <p
                  className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {peli.genero}
                </p>
                <p
                  className={`text-xs mb-2 ${theme === "dark" ? "text-gray-500" : "text-gray-400"
                    }`}
                >
                  {peli.anio}
                </p>

                {/* 🎯 Agregamos un botón de detalle como Link */}
                <Link to={`/detalle/${peli.id}`} className="block w-full text-center bg-[#00C8D7] text-black py-1 rounded-md hover:bg-[#00E0FF] font-bold transition-colors text-sm">
                  Ver detalle
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}