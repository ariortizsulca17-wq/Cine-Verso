// src/components/DetallePelicula.jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

import ComentariosPelicula from "../Componentes/Comentarios";
import { useTheme } from "../Context/ThemeContext";

import Toast from "../Componentes/Toast";

function DetallePelicula() {
  const { id } = useParams(); // 🔑 ID del documento Firestore
  const { theme } = useTheme();

  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [promedioEstrellas, setPromedioEstrellas] = useState(0);

  const getTrailerEmbedUrl = (url) => {
    if (!url) return null;

    // https://www.youtube.com/watch?v=XXXX
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // https://youtu.be/XXXX
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Ya es embed
    if (url.includes("youtube.com/embed")) {
      return url;
    }

    return null;
  };


  // 🔥 OBTENER PELÍCULA DESDE FIRESTORE
  useEffect(() => {
    const obtenerPelicula = async () => {
      try {
        const ref = doc(db, "peliculas", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setPelicula({ id: snap.id, ...snap.data() });
        } else {
          setPelicula(null);
        }
      } catch (error) {
        console.error("Error al obtener la película:", error);
        setPelicula(null);
      } finally {
        setLoading(false);
      }
    };

    obtenerPelicula();
  }, [id]);

  // ⏳ CARGANDO
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B1014] text-white">
        <p className="text-xl animate-pulse">Cargando película...</p>
      </div>
    );
  }

  // ❌ NO ENCONTRADA
  if (!pelicula) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen p-8 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
          }`}
      >
        <h2 className="text-3xl font-bold">
          ¡Error! Película no encontrada
        </h2>
      </div>
    );
  }

  // 🛒 AÑADIR AL CARRITO
  const handleAddToCart = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const existe = carritoActual.some((p) => p.id === pelicula.id);

    if (!existe) {
      const nuevoCarrito = [
        ...carritoActual,
        {
          id: pelicula.id,
          titulo: pelicula.titulo,
          imagen: pelicula.imagen,
        },
      ];

      localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
      window.dispatchEvent(new Event("carritoActualizado"));
      setShowToast(true);
    } else {
      setShowToast(true);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 ${theme === "dark" ? "bg-[#0B1014] text-white" : "bg-[#f2f5f7] text-black"
        }`}
    >
      <div
        className={`max-w-6xl mx-auto rounded-xl shadow-2xl p-6 md:p-10 ${theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
          }`}
      >
        <Link
          to="/"
          className={`font-semibold mb-6 inline-block text-lg ${theme === "dark"
            ? "text-[#00C8D7] hover:text-[#00E0FF]"
            : "text-[#007A8A] hover:text-[#00C8D7]"
            }`}
        >
          ← Volver al Catálogo
        </Link>

        <div className="flex flex-col md:flex-row gap-10">
          {/* IMAGEN */}
          <div className="w-full md:w-1/3 space-y-6">
            <img
              src={pelicula.imagen}
              alt={pelicula.titulo}
              className="rounded-xl shadow-2xl border-4 border-[#00C8D7]/50"
            />

            <button
              onClick={handleAddToCart}
              className="w-full bg-[#00C8D7] text-gray-900 py-3 rounded-lg font-bold hover:bg-[#00E0FF] transition"
            >
              Añadir al carrito
            </button>
          </div>

          {/* INFO */}
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold mb-4">
              {pelicula.titulo}
            </h1>

            {/* ⭐ Estrellas */}
            <div className="flex items-center mb-6">
              <span className="text-[#00C8D7] font-bold text-xl mr-2">
                {promedioEstrellas.toFixed(1)}
              </span>

              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-2xl ${i < Math.round(promedioEstrellas)
                      ? "text-yellow-400"
                      : "text-gray-500"
                      }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* TAGS */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="text-[#00C8D7] font-medium">{pelicula.anio}</span>
              <span className="px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                {pelicula.genero}
              </span>
              <span className="bg-[#00C8D7] text-gray-900 px-3 py-1 rounded-full font-bold">
                {pelicula.rangoEdad}
              </span>
            </div>

            {/* SINOPSIS */}
            <div className="mb-8 p-5 rounded-lg bg-[#0B1014]">
              <h2 className="text-2xl font-bold text-[#00C8D7] mb-3">
                Sinopsis
              </h2>
              <p className="text-gray-300">{pelicula.descripcion}</p>
            </div>

            {/* DETALLES */}
            <div className="space-y-3 mb-8 border-l-4 border-[#00C8D7] pl-4">
              <p><strong>Autor:</strong> {pelicula.autor}</p>
              <p><strong>Producción:</strong> {pelicula.detalles}</p>
              <p><strong>Duración:</strong> {pelicula.duracion}</p>
            </div>

            {/* 🎬 TRAILER */}
            {getTrailerEmbedUrl(pelicula.trailer) && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-[#00C8D7] mb-4">
                  Trailer Oficial
                </h2>
                <iframe
                  className="w-full aspect-video rounded-xl border border-[#00C8D7]/40 shadow-xl"
                  src={getTrailerEmbedUrl(pelicula.trailer)}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}


            <ComentariosPelicula
              peliculaId={pelicula.id}
              onPromedioChange={setPromedioEstrellas}
            />

            <Toast
              show={showToast}
              message={`"${pelicula.titulo}" añadida al carrito`}
              onClose={() => setShowToast(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePelicula;
