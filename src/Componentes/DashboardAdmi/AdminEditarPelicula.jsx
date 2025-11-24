import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Loader2, PlusCircle } from "lucide-react";

export default function AdminAgregarPelicula() {
  const [cargando, setCargando] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    autor: "",
    categoria: "",
    descripcion: "",
    detalles: "",
    duracion: "",
    genero: "",
    imagen: "",
    rangoEdad: "",
    recomendacion: "",
    reseña: "",
    anio: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const guardarPelicula = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!form.titulo.trim() || !form.imagen.trim()) {
      toast.error("Título e imagen son obligatorios");
      return;
    }

    setCargando(true);

    try {
      await addDoc(collection(db, "peliculas"), {
        ...form,
        anio: Number(form.anio),
        creadoEn: new Date(),
      });

      toast.success("Película agregada correctamente");

      // Reiniciar formulario
      setForm({
        titulo: "",
        autor: "",
        categoria: "",
        descripcion: "",
        detalles: "",
        duracion: "",
        genero: "",
        imagen: "",
        rangoEdad: "",
        recomendacion: "",
        reseña: "",
        anio: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la película");
    }

    setCargando(false);
  };

  return (
    <div className="p-8 text-white max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
        <PlusCircle /> Agregar nueva película
      </h1>

      <form
        onSubmit={guardarPelicula}
        className="bg-black/40 p-6 rounded-2xl shadow-xl border border-cyan-700/30 backdrop-blur-md"
      >
        {/* INPUTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 text-gray-300">Título</label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Autor</label>
            <input
              type="text"
              name="autor"
              value={form.autor}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Género</label>
            <input
              type="text"
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Duración</label>
            <input
              type="text"
              name="duracion"
              value={form.duracion}
              onChange={handleChange}
              placeholder="Ej: 2h 15min"
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Rango de edad</label>
            <input
              type="text"
              name="rangoEdad"
              value={form.rangoEdad}
              onChange={handleChange}
              placeholder="+7, +13, etc"
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Año</label>
            <input
              type="number"
              name="anio"
              value={form.anio}
              onChange={handleChange}
              placeholder="2023"
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-gray-300">URL de Imagen</label>
            <input
              type="text"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full p-2 rounded bg-black/60 border border-cyan-600"
              required
            />
          </div>
        </div>

        {/* TEXTAREAS */}
        <div className="mt-5 space-y-5">
          <div>
            <label className="block mb-1 text-gray-300">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Detalles</label>
            <textarea
              name="detalles"
              value={form.detalles}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Recomendación</label>
            <textarea
              name="recomendacion"
              value={form.recomendacion}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded bg-black/60 border border-cyan-600"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-300">Reseña</label>
            <textarea
              name="reseña"
              value={form.reseña}
              onChange={handleChange}
              rows={3}
              className="w-full p-3 rounded bg-black/60 border border-cyan-600"
            />
          </div>
        </div>

        {/* BOTÓN */}
        <button
          type="submit"
          disabled={cargando}
          className="mt-6 w-full flex justify-center items-center gap-2 bg-cyan-600 hover:bg-cyan-500 py-3 rounded-xl font-bold text-black disabled:opacity-50"
        >
          {cargando ? <Loader2 className="animate-spin" /> : <PlusCircle />}
          {cargando ? "Guardando..." : "Agregar Película"}
        </button>
      </form>
    </div>
  );
}
