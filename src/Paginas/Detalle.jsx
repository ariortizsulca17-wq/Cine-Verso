// src/components/DetallePelicula.jsx (CON CARRITO FUNCIONAL)
import React from "react";
import { useParams, Link } from "react-router-dom";
import peliculas from "../Componentes/PeliculasData";
import ComentariosPelicula from "../Componentes/Comentarios";

function DetallePelicula() {
  const { id } = useParams();
  const pelicula = peliculas.find((p) => p.id === parseInt(id));

  if (!pelicula) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-8 text-white">
        <h2 className="text-3xl font-bold">¡Error! Película no encontrada 😟</h2>
      </div>
    );
  }

  // 💡 FUNCIÓN MEJORADA: Añade la película a localStorage (carrito)
  const handleAddToCart = () => {
    // 1. Recuperar el carrito actual del localStorage
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    // 2. Usar el ID para verificar si la película ya existe
    const existe = carritoActual.some(p => p.id === pelicula.id);

    if (!existe) {
      // 3. Crear el objeto del item para el carrito
      const itemNuevo = {
        id: pelicula.id,
        titulo: pelicula.titulo,
        imagen: pelicula.imagen,
      };

      // 4. Añadir el item y guardar en localStorage
      const nuevoCarrito = [...carritoActual, itemNuevo];
      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));

      alert(`¡"${pelicula.titulo}" ha sido añadido al carrito! 🛒`);
    } else {
      alert(`¡"${pelicula.titulo}" ya está en tu carrito!`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-gray-100">
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-6 md:p-10">
        <Link
          to="/"
          className="text-cyan-400 hover:text-cyan-200 transition-colors font-semibold mb-6 inline-block text-lg"
        >
          &larr; Volver al Catálogo
        </Link>

        <div className="flex flex-col md:flex-row gap-10">

          {/* Imagen y Ficha Rápida (Columna Izquierda) */}
          <div className="flex-shrink-0 w-full md:w-1/3 space-y-6">
            <img
              src={pelicula.imagen}
              alt={`Portada de ${pelicula.titulo}`}
              className="w-full h-auto rounded-xl shadow-2xl object-cover border-4 border-cyan-500/50"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x600/1f2937/99f6e4?text=PORTADA+NO+DISPONIBLE";
              }}
            />

            {/* Botón Centrado y de Ancho Moderado */}
            <div className="flex justify-center">
              <button
                onClick={handleAddToCart} // 💡 Esta es la función modificada
                className="w-full md:w-3/4 flex items-center justify-center bg-cyan-600 text-gray-900 py-3 px-6 rounded-lg font-bold hover:bg-cyan-500 transition duration-300 shadow-md text-base uppercase"
              >
                🛒 Añadir al Carrito
              </button>
            </div>

          </div>

          {/* Información Principal (Columna Derecha) */}
          <div className="flex-grow">

            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              {pelicula.titulo}
            </h1>

            {/* Etiquetas clave */}
            <div className="flex flex-wrap items-center space-x-3 mb-6">
              <span className="text-lg text-cyan-400 font-medium">{pelicula.anio}</span>
              <span className="text-2xl text-gray-500">•</span>
              <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-semibold">{pelicula.genero}</span>
              <span className="bg-cyan-700 text-cyan-100 px-3 py-1 rounded-full font-bold text-sm shadow-md">
                {pelicula.rangoEdad}
              </span>
            </div>

            {/* Sinopsis */}
            <div className="mb-8 p-5 bg-gray-700 rounded-lg shadow-inner">
              <h2 className="text-2xl font-bold text-cyan-300 mb-3 border-b border-gray-600 pb-2">
                Sinopsis
              </h2>
              <p className="text-gray-200 leading-relaxed">
                {pelicula.descripcion}
              </p>
            </div>

            {/* Detalles */}
            <div className="space-y-3 mb-8 border-l-4 border-cyan-500 pl-4">
              <div>
                <strong className="block text-cyan-400 font-semibold">Autor de la Obra Original:</strong>
                <p className="text-gray-300">{pelicula.autor}</p>
              </div>
              <div>
                <strong className="block text-cyan-400 font-semibold">Detalles de Producción:</strong>
                <p className="text-gray-300">{pelicula.detalles}</p>
              </div>
              <div>
                <strong className="block text-cyan-400 font-semibold">Duración:</strong>
                <p className="text-gray-300">{pelicula.duracion}</p>
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