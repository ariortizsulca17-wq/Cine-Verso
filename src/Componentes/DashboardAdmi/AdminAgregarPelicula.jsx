import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Film, Loader2, Image, AlertTriangle } from "lucide-react";

const CATEGORIAS = [
  "Top 10",
  "Kids/Familiar",
  "Asiáticas/Anime",
  "Documentales",
  "Basadas en Libros",
];

const GENEROS_POR_CATEGORIA = {
  "Kids/Familiar": [
    "Animación / Aventura",
    "Animación / Familiar",
    "Animación / Comedia",
    "Musical",
    "Animación / Superhéroes",
    "Animación / Fantasía",
    "Animación / Emocional",
    "Animación / Amistad",
    "Musical / Fantasía",
  ],

  "Top 10": [
    "Animación / Aventura / Fantasía",
    "Acción / Superhéroes / Ciencia Ficción",
    "Suspenso / Misterio / Drama",
    "Acción / Crimen / Thriller",
    "Acción / Superhéroes / Marvel",
    "Superhéroes / Ciencia Ficción / Aventura",
    "Acción / Espionaje / Aventura",
    "Acción / Terror / Fantasía Oscura",
    "Acción / Deporte / Drama",
  ],

  "Asiáticas/Anime": [
    "Thriller / Drama",
    "Terror / Acción",
    "Acción / Drama",
    "Drama / Venganza",
    "Romance / Fantasía",
    "Drama / Romance",
    "Fantasía / Aventura",
    "Acción / Suspenso",
    "Terror / Escolar",
    "Anime / Romance",
    "Anime / Drama",
    "Anime / Fantasía",
    "Anime / Acción",
    "Anime / Épico",
    "Anime / Fantasía / Drama",
    "Anime / Fantasía / Aventura / Drama",
    "Anime / Sobrenatural",
    "Anime / Musical",
    "Anime / Acción / Fantasía",
  ],

  "Documentales": [
    "Naturaleza / Ciencia",
    "Animales / Denuncia",
    "Océanos / Ecología",
    "Naturaleza / Reflexión",
    "Naturaleza / Vida Marina",
    "Aventura / Océano",
    "Ciencia / Espacio",
    "Naturaleza / Mundo",
    "Tecnología / Sociedad",
    "Crimen / Real",
    "Sociedad / Política",
    "Trabajo / Sociedad",
    "Derechos Humanos / Historia",
    "Economía / Política",
    "Tecnología / Privacidad",
    "Religión / Misterio",
    "Deporte / Biografía",
    "Biografía / Superación",
    "Música / Juventud",
    "Música / Inspiración",
    "Desastre / Testimonio",
  ],

  "Basadas en Libros": [
    "Fantasía / Aventura",
    "Romance / Drama",
    "Fantasía / Épico",
    "Romance / Fantasía",
    "Crimen / Drama",
    "Ciencia Ficción / Acción",
    "Drama / Romance",
    "Terror / Suspenso",
    "Misterio / Thriller",
    "Drama / Adolescente",
  ],
};


export default function AdminAgregarPelicula() {
  const navigate = useNavigate();
  const [errorLocal, setErrorLocal] = useState(null); // Para errores de validación/guardado

  const [data, setData] = useState({
    titulo: "",
    descripcion: "",
    detalles: "",
    genero: "",
    categoria: "",
    anio: "",
    duracion: "",
    rangoEdad: "",
    recomendacion: "",
    reseña: "",
    imagen: "", // URL del póster
    autor: "",
    trailer: "",
  });

  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => {
    const { name, value } = e.target;

    if (name === "categoria") {
      setData({
        ...data,
        categoria: value,
        genero: "", // 👈 resetear género al cambiar categoría
      });
    } else {
      setData({ ...data, [name]: value });
    }
  };


  // == VALIDACIÓN =======================
  const camposObligatorios = ["titulo", "descripcion", "genero", "categoria", "anio", "imagen"];

  const validar = () => {
    setErrorLocal(null);
    const camposFaltantes = camposObligatorios.filter(
      (campo) => !data[campo] || data[campo].trim() === ""
    );

    if (camposFaltantes.length > 0) {
      setErrorLocal(`Completa los campos obligatorios: ${camposFaltantes.join(", ")}.`);
      return false;
    }

    if (data.anio && (isNaN(data.anio) || data.anio.length !== 4)) {
      setErrorLocal("El Año debe ser un valor numérico de 4 dígitos.");
      return false;
    }

    return true;
  };

  // == SUBMIT ===========================
  const agregarPelicula = async (e) => {
    e.preventDefault();
    if (!validar()) {
      return;
    }

    setGuardando(true);
    setErrorLocal(null);

    try {
      // Limpiar campos que pueden ser vacíos antes de guardar
      const dataToSave = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== "")
      );

      await addDoc(collection(db, "peliculas"), dataToSave);
      // Navegar de vuelta al listado de películas
      navigate("/admin/peliculas");
    } catch (error) {
      console.error("Error guardando película:", error);
      setErrorLocal("Error al guardar la película en Firebase. Revisa la consola y las reglas de Firestore.");
    }

    setGuardando(false);
  };

  const getTrailerEmbedUrl = (url) => {
    if (!url) return null;

    // YouTube normal: https://www.youtube.com/watch?v=XXXX
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // YouTube corto: https://youtu.be/XXXX
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Si ya es embed
    if (url.includes("youtube.com/embed")) {
      return url;
    }

    return null;
  };


  // =====================================

  return (
    <div className="p-6 max-w-5xl mx-auto text-white font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/peliculas")}
            title="Volver al listado"
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          >
            <ArrowLeft size={24} className="text-cyan-400" />
          </button>
          <h1 className="text-3xl font-extrabold text-white tracking-wider flex items-center gap-3">
            <Film className="w-7 h-7 text-cyan-400" />
            Nueva Película
          </h1>
        </div>
      </div>

      {/* MENSAJE DE ERROR LOCAL */}
      {errorLocal && (
        <div className="bg-red-900/40 border border-red-500 text-red-300 p-4 rounded-lg mb-6 flex items-center shadow-lg">
          <AlertTriangle className="w-5 h-5 mr-3" />
          <p className="font-semibold">{errorLocal}</p>
        </div>
      )}

      {/* FORMULARIO */}
      <form
        onSubmit={agregarPelicula}
        className="bg-gray-900/60 border border-cyan-800/50 rounded-xl p-8 shadow-2xl shadow-cyan-900/30 backdrop-blur-md space-y-8"
      >

        {/* === SECCIÓN 1: PRINCIPAL === */}
        <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2">
          Información Principal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Título */}
          <div className="col-span-1 md:col-span-3">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Título <span className="text-red-500">*</span></label>
            <input
              name="titulo"
              value={data.titulo}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej: El Origen"
              required
            />
          </div>

          {/* URL de Imagen */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-300">URL del Póster <span className="text-red-500">*</span></label>
            <input
              name="imagen"
              value={data.imagen}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="https://imagen.com/poster.jpg"
              required
            />
          </div>

          {/* Previsualización */}
          <div className="col-span-1 flex justify-center items-center">
            {data.imagen ? (
              <img
                src={data.imagen}
                alt="preview"
                className="w-28 h-40 object-cover rounded-lg border-2 border-cyan-500 shadow-xl"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150/4B5563/FFFFFF?text=ERROR+IMG" }}
              />
            ) : (
              <div className="w-28 h-40 flex flex-col items-center justify-center bg-gray-800 rounded-lg text-gray-500 border border-gray-700">
                <Image size={32} />
                <span className="text-xs mt-1">Póster</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div className="col-span-1 md:col-span-3">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Descripción Completa <span className="text-red-500">*</span></label>
            <textarea
              name="descripcion"
              value={data.descripcion}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              rows={4}
              placeholder="Sinopsis detallada de la trama de la película..."
            />
          </div>
        </div>

        {/* === SECCIÓN 2: METADATA Y CLASIFICACIÓN === */}
        <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 pt-4">
          Clasificación y Metadatos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              name="categoria"
              value={data.categoria}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIAS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              Género <span className="text-red-500">*</span>
            </label>
            <select
              name="genero"
              value={data.genero}
              onChange={cambiar}
              disabled={!data.categoria}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
            >
              <option value="">
                {data.categoria
                  ? "Selecciona un género"
                  : "Primero elige una categoría"}
              </option>

              {data.categoria &&
                GENEROS_POR_CATEGORIA[data.categoria]?.map((gen) => (
                  <option key={gen} value={gen}>
                    {gen}
                  </option>
                ))}
            </select>
          </div>

          {/* Año */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Año <span className="text-red-500">*</span></label>
            <input
              name="anio"
              type="number"
              value={data.anio}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="2023"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          {/* Duración */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Duración</label>
            <input
              name="duracion"
              value={data.duracion}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej: 2h 30m"
            />
          </div>

          {/* Rango de Edad */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Rango de Edad</label>
            <input
              name="rangoEdad"
              value={data.rangoEdad}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="+13"
            />
          </div>

          {/* Autor */}
          <div className="sm:col-span-3">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Autor (Si es adaptación)</label>
            <input
              name="autor"
              value={data.autor}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej: Jane Austen"
            />
          </div>

        </div>

        {/* === SECCIÓN 3: OPINIONES / INFO ADICIONAL === */}
        <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 pt-4">
          Reseñas y Detalles Adicionales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Reseña Corta */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Reseña (Corta)</label>
            <textarea
              name="reseña"
              value={data.reseña}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              rows={2}
              placeholder="Breve opinión para el catálogo."
            />
          </div>

          {/* Recomendación */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">Recomendación (Para quién es)</label>
            <textarea
              name="recomendacion"
              value={data.recomendacion}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              rows={2}
              placeholder="Ideal para amantes del drama..."
            />
          </div>

          {/* Detalles (Genérico) */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2 text-gray-300">Detalles Adicionales</label>
            <textarea
              name="detalles"
              value={data.detalles}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              rows={2}
              placeholder="Información sobre director, reparto clave, premios, etc."
            />
          </div>

        </div>
        {/* === SECCIÓN 4: TRAILER === */}
        <h2 className="text-xl font-bold text-cyan-400 border-b border-gray-700 pb-2 pt-4">
          Trailer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

          {/* Input URL */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              URL del Trailer (YouTube)
            </label>
            <input
              name="trailer"
              value={data.trailer}
              onChange={cambiar}
              className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="https://www.youtube.com/watch?v=XXXX"
            />
            <p className="text-xs text-gray-400 mt-1">
              Pega un enlace de YouTube para previsualizar el trailer.
            </p>
          </div>

          {/* Previsualización */}
          <div className="w-full">
            {getTrailerEmbedUrl(data.trailer) ? (
              <iframe
                src={getTrailerEmbedUrl(data.trailer)}
                title="Trailer preview"
                className="w-full aspect-video rounded-xl border border-cyan-700 shadow-xl"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full aspect-video flex items-center justify-center bg-gray-800/70 rounded-xl border border-gray-700 text-gray-500">
                <span className="text-sm">Previsualización del trailer</span>
              </div>
            )}
          </div>

        </div>





        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          disabled={guardando}
          className="mt-8 w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-xl flex items-center justify-center gap-2 text-lg font-bold transition-all shadow-xl shadow-cyan-900/50 disabled:opacity-50"
        >
          {guardando ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Check size={20} />
              Guardar Película
            </>
          )}
        </button>
      </form>
    </div>
  );
}