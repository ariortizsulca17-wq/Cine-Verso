// src/components/Detalle.jsx
import { useParams, Link } from "react-router-dom";
import peliculas from "../Componentes/PeliculasData";
import ComentariosPelicula from "../Componentes/Comentarios";
import { useTheme } from "../Context/ThemeContext"; // 🌓 Importar el tema
import { comentariosPeliculas } from "../assets/comentariospeli"; // ⭐ IMPORTAR COMENTARIOS

function DetallePelicula() {
  const { id } = useParams();
  const pelicula = peliculas.find((p) => p.id === parseInt(id));
  const { theme } = useTheme(); // 🌓 Obtener el tema actual

  if (!pelicula) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen p-8 transition-colors duration-500 ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
        }`}
      >
        <h2 className="text-3xl font-bold">¡Error! Película no encontrada 😟</h2>
      </div>
    );
  }

  // ⭐ PROMEDIO ESTRELLAS
  const obtenerPromedio = (peliculaId) => {
    const comentarios = comentariosPeliculas.filter(
      (c) => c.peliculaId === peliculaId
    );
    if (comentarios.length === 0) return 0;
    const suma = comentarios.reduce((acc, c) => acc + c.puntuacion, 0);
    return suma / comentarios.length;
  };

  const promedioEstrellas = obtenerPromedio(pelicula.id);

  // 💡 FUNCIÓN: Añade la película al carrito
  const handleAddToCart = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carritoActual.some((p) => p.id === pelicula.id);

    if (!existe) {
      const itemNuevo = {
        id: pelicula.id,
        titulo: pelicula.titulo,
        imagen: pelicula.imagen,
      };
      const nuevoCarrito = [...carritoActual, itemNuevo];
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      alert(`¡"${pelicula.titulo}" ha sido añadido al carrito! 🛒`);
    } else {
      alert(`¡"${pelicula.titulo}" ya está en tu carrito!`);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 transition-colors duration-500 ${
        theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
      }`}
    >
      <div
        className={`max-w-6xl mx-auto rounded-xl shadow-2xl p-6 md:p-10 transition-colors duration-500 ${
          theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
        }`}
      >
        <Link
          to="/"
          className={`font-semibold mb-6 inline-block text-lg transition-colors ${
            theme === "dark"
              ? "text-[#00C8D7] hover:text-[#00E0FF]"
              : "text-[#007A8A] hover:text-[#00C8D7]"
          }`}
        >
          &larr; Volver al Catálogo
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* 🎬 Imagen y botón */}
          <div className="flex-shrink-0 w-full md:w-1/3 space-y-6">
            <img
              src={pelicula.imagen}
              alt={`Portada de ${pelicula.titulo}`}
              className="w-full h-auto rounded-xl shadow-2xl object-cover border-4 border-[#00C8D7]/50"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x600/1f2937/99f6e4?text=PORTADA+NO+DISPONIBLE";
              }}
            />

            <div className="flex justify-center">
              <button
                onClick={handleAddToCart}
                className="w-full md:w-3/4 flex items-center justify-center bg-[#00C8D7] text-gray-900 py-3 px-6 rounded-lg font-bold hover:bg-[#00E0FF] transition duration-300 shadow-md text-base uppercase"
              >
                🛒 Añadir al Carrito
              </button>
            </div>
          </div>

          {/* 📖 Información principal */}
          <div className="flex-grow">
            <h1
              className={`text-5xl font-extrabold mb-4 leading-tight transition-colors ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {pelicula.titulo}
            </h1>

            {/* ⭐ PROMEDIO DE ESTRELLAS */}
            <div className="flex items-center mb-6">
              <span className="text-[#00C8D7] font-bold text-xl mr-2">
                {promedioEstrellas.toFixed(1)}
              </span>

              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${
                      i < Math.round(promedioEstrellas)
                        ? "text-yellow-400"
                        : theme === "dark"
                        ? "text-gray-600"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>

              <span
                className={`ml-3 text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                (
                {
                  comentariosPeliculas.filter(
                    (c) => c.peliculaId === pelicula.id
                  ).length
                }{" "}
                comentarios)
              </span>
            </div>

            {/* Etquetas */}
            <div className="flex flex-wrap items-center space-x-3 mb-6">
              <span className="text-lg text-[#00C8D7] font-medium">
                {pelicula.anio}
              </span>
              <span className="text-2xl text-gray-500">•</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  theme === "dark"
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {pelicula.genero}
              </span>
              <span className="bg-[#00C8D7] text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-md">
                {pelicula.rangoEdad}
              </span>
            </div>

            {/* Sinopsis */}
            <div
              className={`mb-8 p-5 rounded-lg shadow-inner transition-colors ${
                theme === "dark" ? "bg-[#0B1014]" : "bg-gray-100"
              }`}
            >
              <h2 className="text-2xl font-bold text-[#00C8D7] mb-3 border-b border-gray-600 pb-2">
                Sinopsis
              </h2>
              <p
                className={`leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {pelicula.descripcion}
              </p>
            </div>

            {/* Detalles */}
            <div className="space-y-3 mb-8 border-l-4 border-[#00C8D7] pl-4">
              <div>
                <strong className="block text-[#00C8D7] font-semibold">
                  Autor de la Obra Original:
                </strong>
                <p>{pelicula.autor}</p>
              </div>
              <div>
                <strong className="block text-[#00C8D7] font-semibold">
                  Detalles de Producción:
                </strong>
                <p>{pelicula.detalles}</p>
              </div>
              <div>
                <strong className="block text-[#00C8D7] font-semibold">
                  Duración:
                </strong>
                <p>{pelicula.duracion}</p>
              </div>
            </div>

            {/* 🎬 TRAILER AGREGADO AQUÍ SIN BORRAR NADA */}
            {pelicula.trailer && (
              <div
                className={`mb-12 mt-10 rounded-xl overflow-hidden shadow-xl border transition-colors ${
                  theme === "dark" ? "border-gray-700" : "border-gray-300"
                }`}
              >
                <h2 className="text-2xl font-bold mb-4 text-[#00C8D7]">
                  🎬 Trailer Oficial
                </h2>

                <div className="w-full aspect-video rounded-xl overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={pelicula.trailer}
                    title={`Trailer de ${pelicula.titulo}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* 💬 SECCIÓN DE COMENTARIOS */}
            <div
              className={`mt-12 pt-8 border-t transition-colors ${
                theme === "dark" ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <ComentariosPelicula peliculaId={pelicula.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePelicula;
