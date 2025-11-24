import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";

export default function AdminAgregarPelicula() {
  const navigate = useNavigate();

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
    imagen: "",
    autor: ""
  });

  const [guardando, setGuardando] = useState(false);

  const cambiar = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // == VALIDACIÓN =======================
  const camposObligatorios = ["titulo", "descripcion", "genero", "categoria", "anio", "imagen"];

  const validar = () => {
    for (let campo of camposObligatorios) {
      if (!data[campo] || data[campo].trim() === "") {
        return false;
      }
    }
    return true;
  };

  // == SUBMIT ===========================
  const agregarPelicula = async (e) => {
    e.preventDefault();
    if (!validar()) {
      alert("Completa los campos obligatorios ✦");
      return;
    }

    setGuardando(true);

    try {
      await addDoc(collection(db, "peliculas"), data);
      navigate("/dashboard/peliculas"); // Ajusta si tu ruta es distinta
    } catch (error) {
      console.error("Error guardando película:", error);
      alert("Error al guardar");
    }

    setGuardando(false);
  };

  // =====================================

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/dashboard/peliculas")}
          className="p-2 bg-gray-800 rounded-xl hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
        </button>

        <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-lg">
          Agregar Película
        </h1>
      </div>

      {/* FORMULARIO */}
      <form
        onSubmit={agregarPelicula}
        className="bg-black/40 border border-cyan-700/40 rounded-2xl p-8 shadow-2xl backdrop-blur-xl space-y-6"
      >
        {/* Título */}
        <div>
          <label className="block text-lg mb-1">Título *</label>
          <input
            name="titulo"
            value={data.titulo}
            onChange={cambiar}
            className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
            placeholder="Ej: Harry Potter"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-lg mb-1">Descripción *</label>
          <textarea
            name="descripcion"
            value={data.descripcion}
            onChange={cambiar}
            className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
            rows={3}
          />
        </div>

        {/* Detalles */}
        <div>
          <label className="block text-lg mb-1">Detalles</label>
          <textarea
            name="detalles"
            value={data.detalles}
            onChange={cambiar}
            className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
            rows={2}
            placeholder="Información adicional..."
          />
        </div>

        {/* 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <label className="block text-lg mb-1">Género *</label>
            <input
              name="genero"
              value={data.genero}
              onChange={cambiar}
              className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
              placeholder="Ej: Fantasía / Aventura"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Categoría *</label>
            <input
              name="categoria"
              value={data.categoria}
              onChange={cambiar}
              className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
              placeholder="Ej: Basadas en libros"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Año *</label>
            <input
              name="anio"
              type="number"
              value={data.anio}
              onChange={cambiar}
              className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
              placeholder="2023"
            />
          </div>

        </div>

        {/* 3 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <label className="block text-lg mb-1">Duración</label>
            <input
              name="duracion"
              value={data.duracion}
              onChange={cambiar}
              className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
              placeholder="Ej: 2h 30m"
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Rango de Edad</label>
            <input
              name="rangoEdad"
              value={data.rangoEdad}
              onChange={cambiar}
              className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
              placeholder="+7, +13, +18..."
            />
          </div>

          <div>
            <label className="block text-lg mb-1">Autor del libro</label>
            <input
              name="autor"
              value={data.autor}
              onChange={cambiar}
              className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
              placeholder="Ej: J.K. Rowling"
            />
          </div>

        </div>

        {/* Recomendación */}
        <div>
          <label className="block text-lg mb-1">Recomendación</label>
          <textarea
            name="recomendacion"
            value={data.recomendacion}
            onChange={cambiar}
            className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
            rows={2}
            placeholder="Opinión o recomendación sobre la película..."
          />
        </div>

        {/* Reseña */}
        <div>
          <label className="block text-lg mb-1">Reseña</label>
          <textarea
            name="reseña"
            value={data.reseña}
            onChange={cambiar}
            className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
            rows={2}
            placeholder="Breve reseña..."
          />
        </div>

        {/* Imagen */}
        <div>
          <label className="block text-lg mb-1">URL de la imagen *</label>
          <input
            name="imagen"
            value={data.imagen}
            onChange={cambiar}
            className="w-full p-3 bg-black/60 border border-cyan-600 rounded-xl"
            placeholder="https://imagen.com/poster.jpg"
            required
          />

          {/* Previsualización automática */}
          {data.imagen && (
            <img
              src={data.imagen}
              alt="preview"
              className="mt-4 w-40 h-60 object-cover rounded-xl border-2 border-cyan-500 shadow-lg"
            />
          )}
        </div>

        {/* BOTÓN GUARDAR */}
        <button
          type="submit"
          disabled={guardando}
          className="mt-6 w-full bg-cyan-600 hover:bg-cyan-500 p-3 rounded-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50"
        >
          <Check size={20} />
          {guardando ? "Guardando..." : "Guardar Película"}
        </button>
      </form>
    </div>
  );
}
