// src/components/DetallePelicula.jsx (CON ESTILO MEJORADO)
import React from "react";
import { useParams, Link } from "react-router-dom";
import peliculas from "../Componentes/PeliculasData";
import ComentariosPelicula from "../Componentes/Comentarios";
// 💡 Importa iconos para usarlos en el diseño
import { FaShoppingCart, FaCalendarAlt, FaStar, FaMask } from "react-icons/fa";
import { IoIosTimer } from "react-icons/io";

function DetallePelicula() {
  const { id } = useParams();
  const pelicula = peliculas.find((p) => p.id === parseInt(id));

  if (!pelicula) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8 text-white">
        <h2 className="text-3xl font-bold">
          ¡Error! Película no encontrada 😟
        </h2>
      </div>
    );
  }

  // FUNCIÓN: Añade la película a localStorage (carrito)
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
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-gray-100">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-12 border border-gray-700/50">
        <Link
          to="/"
          className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-semibold mb-8 text-lg group"
        >
          <svg
            className="w-5 h-5 mr-2 transform transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Volver al Catálogo
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Imagen y Ficha Rápida (Columna Izquierda) */}
          <div className="flex-shrink-0 w-full md:w-1/3 space-y-6">
            <img
              src={pelicula.imagen}
              alt={`Portada de ${pelicula.titulo}`}
              className="w-full h-auto rounded-xl shadow-2xl object-cover border-4 border-cyan-500/80 transform hover:scale-[1.02] transition duration-500 ease-in-out"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x600/1f2937/99f6e4?text=PORTADA+NO+DISPONIBLE";
              }}
            />

            {/* Botón Añadir a Carrito */}
            <div className="flex justify-center">
              <button
                onClick={handleAddToCart}
                className="w-full md:w-11/12 flex items-center justify-center bg-cyan-600 text-gray-900 py-3 px-6 rounded-xl font-extrabold hover:bg-cyan-500 transition duration-300 shadow-xl text-lg uppercase space-x-2 transform hover:scale-[1.01]"
              >
                <FaShoppingCart className="mr-2" />
                Añadir al Carrito
              </button>
            </div>
          </div>

          {/* Información Principal (Columna Derecha) */}
          <div className="flex-grow">
            <h1 className="text-6xl font-black text-white mb-4 leading-tight border-b-4 border-cyan-600/50 pb-2">
              {pelicula.titulo}
            </h1>

            {/* MEJORA 1: Etiquetas clave más estilizadas */}
            <div className="flex flex-wrap items-center space-x-3 mb-8">
              {/* Año */}
              <span className="flex items-center text-lg text-cyan-400 font-medium bg-gray-700/50 px-3 py-1 rounded-full">
                <FaCalendarAlt className="mr-1.5 text-cyan-500" />
                {pelicula.anio}
              </span>
              <span className="text-3xl text-gray-500">•</span>
              
              {/* Género (Destacado) */}
              <span className="bg-fuchsia-600 text-white px-4 py-1.5 rounded-full text-base font-bold shadow-lg transform hover:scale-[1.05] transition duration-200">
                {pelicula.genero}
              </span>
              <span className="text-3xl text-gray-500">•</span>

              {/* Rango de Edad (Destacado con Ícono) */}
              <span className="flex items-center bg-yellow-500 text-gray-900 px-4 py-1.5 rounded-full font-extrabold text-base shadow-lg transform hover:scale-[1.05] transition duration-200">
                <FaMask className="mr-1.5" />
                {pelicula.rangoEdad}
              </span>
            </div>

            {/* Sinopsis */}
            <div className="mb-8 p-6 bg-gray-700 rounded-xl shadow-inner border border-gray-600/50">
              <h2 className="text-2xl font-bold text-cyan-300 mb-3 border-b-2 border-cyan-500/50 pb-2 flex items-center">
                <FaStar className="mr-2 text-yellow-400" />
                Sinopsis
              </h2>
              <p className="text-gray-200 leading-relaxed text-lg">
                {pelicula.descripcion}
              </p>
            </div>

            {/* Detalles */}
            <div className="space-y-4 mb-8 border-l-4 border-fuchsia-500 pl-4 bg-gray-700/30 p-4 rounded-lg">
              <div>
                <strong className="block text-fuchsia-400 font-bold text-lg">
                  Autor de la Obra Original:
                </strong>
                <p className="text-gray-300">{pelicula.autor}</p>
              </div>
              <div>
                <strong className="block text-fuchsia-400 font-bold text-lg">
                  Detalles de Producción:
                </strong>
                <p className="text-gray-300">{pelicula.detalles}</p>
              </div>
              <div>
                <strong className="block text-fuchsia-400 font-bold text-lg">
                  Duración:
                </strong>
                <p className="text-gray-300 flex items-center">
                  <IoIosTimer className="mr-2 text-cyan-400" />
                  {pelicula.duracion}
                </p>
              </div>
            </div>

            {/* SECCIÓN DE COMENTARIOS */}
            <div className="mt-12 pt-8 border-t border-gray-700">
              <ComentariosPelicula peliculaId={pelicula.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePelicula;