// src/Paginas/PeliAsiaticas.jsx
import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import peliculas from "../Componentes/PeliculasData";

export default function PeliAsiaticas() {
  const { theme } = useTheme();
  
  // 1. Estados para los dos niveles de filtro
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");

  // 2. Filtramos solo películas asiáticas/anime (la base)
  const peliculasAsiaticasBase = useMemo(() => peliculas.filter(
    (p) =>
      p.categoria === "Asiaticas" ||
      p.categoria === "Asiáticas" ||
      p.categoria === "Animes"
  ), []);

  // 3. Obtenemos categorías únicas y géneros únicos para los desplegables
  const categoriasUnicas = useMemo(() => [
    "Todas", 
    ...new Set(peliculasAsiaticasBase.map((p) => p.categoria.replace(/s$/, '')))] // Normalizamos el nombre
  , [peliculasAsiaticasBase]);
    
  // 4. Películas filtradas por la categoría principal
  const peliculasPorCategoria = useMemo(() => {
    if (categoriaSeleccionada === "Todas") {
      return peliculasAsiaticasBase;
    }
    return peliculasAsiaticasBase.filter(
      (p) => p.categoria.replace(/s$/, '') === categoriaSeleccionada
    );
  }, [categoriaSeleccionada, peliculasAsiaticasBase]);
  
  // 5. Géneros disponibles basados en la categoría actual
  const generosDisponibles = useMemo(() => [
    "Todos", 
    ...new Set(peliculasPorCategoria.map((p) => p.genero))
  ], [peliculasPorCategoria]);

  // 6. Filtro final
  const peliculasFiltradas = useMemo(() => {
    if (generoSeleccionado === "Todos") {
      return peliculasPorCategoria;
    }
    return peliculasPorCategoria.filter((p) => p.genero === generoSeleccionado);
  }, [generoSeleccionado, peliculasPorCategoria]);

  // Manejar el cambio de categoría y resetear el género
  const handleCategoriaChange = (nuevaCategoria) => {
    setCategoriaSeleccionada(nuevaCategoria);
    setGeneroSeleccionado("Todos"); // Resetear género al cambiar de categoría
  };

  return (
    <div
      className={`flex flex-col p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
      }`}
    >
      {/* 🎭 Contenedor de Desplegables de Filtro (Reemplaza el Aside) */}
      <div 
        className={`w-full mb-6 p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4 ${
          theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
        }`}
      >
        {/* Desplegable de Categoría */}
        <div className="flex-1">
          <label 
            htmlFor="categoria-select" 
            className="block text-sm font-medium mb-1 text-[#00C8D7]"
          >
            Seleccionar Categoría
          </label>
          <select
            id="categoria-select"
            value={categoriaSeleccionada}
            onChange={(e) => handleCategoriaChange(e.target.value)}
            className={`w-full p-2 rounded-lg border-2 appearance-none cursor-pointer 
              ${theme === "dark" 
                ? "bg-[#0B1014] border-[#00C8D7] text-white" 
                : "bg-white border-gray-300 text-black"
              }`}
          >
            {categoriasUnicas.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Desplegable de Género (Dependiente de la Categoría) */}
        <div className="flex-1">
          <label 
            htmlFor="genero-select" 
            className="block text-sm font-medium mb-1 text-[#00C8D7]"
          >
            Seleccionar Género
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
            disabled={categoriaSeleccionada === "Todas" && generosDisponibles.length <= 1}
          >
            {generosDisponibles.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🎥 Listado principal */}
      <main className="flex-1">
        <h1 className="text-3xl font-bold text-[#00C8D7] mb-4">
          🎥 {categoriaSeleccionada}
        </h1>
        <p
          className={`mb-6 ${
            theme === "dark" ? "text-gray-300" : "text-gray-600"
          }`}
        >
          Explora lo mejor del cine asiático y de animación oriental 🌸.
        </p>

        {/* 📭 Si no hay películas */}
        {peliculasFiltradas.length === 0 ? (
          <p
            className={`text-center ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No hay películas disponibles en este género 😢
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {peliculasFiltradas.map((p, i) => (
              <div
                key={p.id || i}
                className={`rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform ${
                  theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
                }`}
              >
                <Link to={`/detalle/${p.id}`}>
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    className="w-full h-48 object-cover cursor-pointer"
                  />
                  <div className="p-3">
                    <h2 className="text-lg font-semibold mb-1 truncate hover:text-[#00C8D7] transition-colors">{p.titulo}</h2>
            </div>
                </Link>

                    <p
                      className={`text-sm mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {p.genero} • {p.anio}
                    </p>
                    <Link to={`/detalle/${p.id}`} className="block w-full text-center bg-[#00C8D7] text-black py-1 rounded-md hover:bg-[#00E0FF] font-bold transition-colors text-sm">
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