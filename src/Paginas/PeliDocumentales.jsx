import { useState, useMemo } from "react"; // 👈 Importamos useMemo
import { Link } from "react-router-dom"; // 👈 Importamos Link para la navegación
import { useTheme } from "../Context/ThemeContext";
import peliculas from "../Componentes/PeliculasData";

export default function PeliDocumentales() {
  const { theme } = useTheme();
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");

  // 1. Filtramos la lista base de documentales (usamos useMemo para optimizar)
  const peliculasDocumentales = useMemo(() => peliculas.filter(
    (p) => p.categoria.toLowerCase() === "documentales"
  ), []);

  // 2. Obtenemos géneros únicos para el desplegable (usamos useMemo)
  const generos = useMemo(() =>
    ["Todos", ...new Set(peliculasDocumentales.map((p) => p.genero))]
    , [peliculasDocumentales]);

  // 3. Filtramos según el género seleccionado (usamos useMemo)
  const peliculasFiltradas = useMemo(() => {
    return generoSeleccionado === "Todos"
      ? peliculasDocumentales
      : peliculasDocumentales.filter((p) => p.genero === generoSeleccionado);
  }, [generoSeleccionado, peliculasDocumentales]);

  return (
    <div
      className={`flex flex-col p-6 min-h-screen transition-colors duration-500 ${theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
        }`}
    >
      {/* --- FILTRO DESPLEGABLE DE GÉNEROS --- */}
      <div
        className={`w-full mb-6 p-4 rounded-xl shadow-md ${theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
          }`}
      >
        <div className="flex-1 max-w-lg mx-auto">
          <label
            htmlFor="genero-select"
            className="block text-sm font-medium mb-1 text-[#00C8D7] text-center"
          >
            Filtrar por Sub-Género Documental
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

      {/* --- LISTA DE PELÍCULAS DOCUMENTALES --- */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-[#00C8D7] mb-4 text-center sm:text-left">
          🎥 Documentales
        </h1>
        <p
          className={`mb-6 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
        >
          Aprende y explora con los mejores documentales.
        </p>

        {peliculasFiltradas.length === 0 ? (
          <p
            className={`text-center ${theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
          >
            No hay películas disponibles en este género.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {peliculasFiltradas.map((p, i) => (
              // 💡 Envuelve toda la tarjeta en un Link para ir a DetallePelicula
              <div
                key={p.id || i}
                className={`rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 ${theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
                  }`}
              >
                <Link to={`/detalle/${p.id}`}>
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                  <div className="p-3">
                    {/* Título clickeable */}
                    <h2 className="text-lg font-semibold mb-1 truncate hover:text-[#00C8D7] transition-colors">
                      {p.titulo}
                    </h2>
                    </div>
                </Link> {/* Cierre del Link para el título/imagen */}

                <p
                  className={`text-sm mb-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                >
                  {p.genero} • {p.anio}
                </p>
                {/* Botón "Ver más" actualizado a Link */}
                <Link to={`/detalle/${p.id}`} className="block w-full text-center bg-[#00C8D7] text-black py-1 rounded-md hover:bg-[#00E0FF] font-bold transition-colors text-sm">
                  Ver detalle
                </Link>
              </div>
              
        ))}
    </div>
  )
}
      </main >
    </div >
  );
}