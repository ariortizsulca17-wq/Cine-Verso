import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext.jsx"; // 👈 Importar el contexto
import peliculas from "../Componentes/PeliculasData";

export default function Inicio({ searchQuery = "" }) {
  const categorias = ["Top 10", "Basadas en Libros", "Kids", "Documentales", "Asiáticas"];
  const carruseles = useRef({});
  const { theme } = useTheme(); // 👈 Usamos el contexto del tema

  const scroll = (categoria, direccion) => {
    const contenedor = carruseles.current[categoria];
    if (contenedor) {
      const scrollAmount = direccion === "left" ? -300 : 300;
      contenedor.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      categorias.forEach((categoria) => scroll(categoria, "right"));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const peliculasFiltradas = peliculas.filter((peli) => {
    const query = searchQuery.toLowerCase();
    return (
      peli.titulo?.toLowerCase().includes(query) ||
      peli.genero?.toLowerCase().includes(query) ||
      peli.categoria?.toLowerCase().includes(query) ||
      peli.anio?.toString().includes(query)
    );
  });

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0B1014] text-white"
          : "bg-[#F9F9F9] text-gray-900"
      }`}
    >
      {/* Título principal */}
      <h1
        className={`text-3xl font-bold mb-6 text-center ${
          theme === "dark" ? "text-[#00C8D7]" : "text-[#008A91]"
        }`}
      >
        🎬 Todas las películas
      </h1>

      {/* Mensaje si no hay resultados */}
      {peliculasFiltradas.length === 0 ? (
        <p
          className={`text-center text-lg mt-10 ${
            theme === "dark" ? "text-[#B0B0B0]" : "text-gray-600"
          }`}
        >
          No se encontraron películas con ese nombre 😢
        </p>
      ) : (
        categorias.map((categoria) => {
          const peliculasCategoria = peliculasFiltradas.filter(
            (peli) => peli.categoria.toLowerCase() === categoria.toLowerCase()
          );

          if (peliculasCategoria.length === 0) return null;

          return (
            <div key={categoria} className="mb-12 relative">
              {/* Título de categoría */}
              <h2
                className={`text-2xl font-semibold mb-3 ${
                  theme === "dark" ? "text-[#00C8D7]" : "text-[#007D85]"
                }`}
              >
                {categoria}
              </h2>

              {/* Botones de flechas */}
              <button
                onClick={() => scroll(categoria, "left")}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 transition-all ${
                  theme === "dark"
                    ? "bg-[#0B1014]/70 hover:bg-[#00C8D7] text-white"
                    : "bg-[#E0E0E0]/70 hover:bg-[#00C8D7] text-gray-900"
                }`}
              >
                ◀
              </button>
              <button
                onClick={() => scroll(categoria, "right")}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 transition-all ${
                  theme === "dark"
                    ? "bg-[#0B1014]/70 hover:bg-[#00C8D7] text-white"
                    : "bg-[#E0E0E0]/70 hover:bg-[#00C8D7] text-gray-900"
                }`}
              >
                ▶
              </button>

              {/* Carrusel */}
              <div
                ref={(el) => (carruseles.current[categoria] = el)}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {peliculasCategoria.map((peli, index) => (
                  <div
                    key={peli.id || index}
                    className={`rounded-lg p-3 shadow-md hover:scale-105 transition-transform duration-300 min-w-[180px] ${
                      theme === "dark"
                        ? "bg-[#1A1F25]"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {/* Imagen y título llevan a la página Detalle */}
                    <Link to={`/detalle/${peli.id}`}>
                      <img
                        src={peli.imagen}
                        alt={peli.titulo}
                        className="rounded-lg mb-2 w-full h-48 object-cover cursor-pointer"
                      />
                      <h3
                        className={`text-lg font-semibold truncate transition-colors cursor-pointer ${
                          theme === "dark"
                            ? "text-white hover:text-[#00C8D7]"
                            : "text-gray-900 hover:text-[#007D85]"
                        }`}
                      >
                        {peli.titulo}
                      </h3>
                    </Link>
                    <p
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-[#B0B0B0]"
                          : "text-gray-600"
                      }`}
                    >
                      {peli.anio} • {peli.genero}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
