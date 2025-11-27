// src/DashboardAdmin/AdminEditarPelicula.jsx

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Loader2, Pencil, ArrowLeft, Save, AlertTriangle, X, Film, Info } from "lucide-react"; 
import { useParams, useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react"; // Importar Dialog para el modal

export default function AdminEditarPelicula() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(true); 
  const [guardando, setGuardando] = useState(false); 
  const [modalGuardarAbierto, setModalGuardarAbierto] = useState(false);

  const [form, setForm] = useState({
    titulo: "", autor: "", categoria: "", descripcion: "", detalles: "", 
    duracion: "", genero: "", imagen: "", rangoEdad: "", recomendacion: "", 
    reseña: "", anio: "",
  });

  // --- Carga de Datos Iniciales ---
  useEffect(() => {
    async function fetchPelicula() {
      if (!id) {
        toast.error("ID de película no encontrado.");
        setCargando(false);
        return;
      }
      try {
        const docRef = doc(db, "peliculas", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({ ...data, anio: data.anio?.toString() || "" }); 
        } else {
          toast.error("La película no existe.");
          navigate("/admin/peliculas");
        }
      } catch (error) {
        console.error("Error al cargar datos para edición:", error);
        toast.error("Error al cargar los datos.");
      } finally {
        setCargando(false);
      }
    }
    fetchPelicula();
  }, [id, navigate]);


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  
  // --- Manejo del Modal y Guardado ---
  const confirmarActualizacion = (e) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.imagen.trim()) {
      toast.error("Título e imagen son obligatorios");
      return;
    }
    setModalGuardarAbierto(true);
  };
  
  const actualizarPelicula = async () => {
    setGuardando(true);
    setModalGuardarAbierto(false); 

    try {
      const docRef = doc(db, "peliculas", id);
      const dataToUpdate = {
        ...form,
        anio: form.anio ? Number(form.anio) : null,
        actualizadoEn: new Date(), 
      };

      await updateDoc(docRef, dataToUpdate);

      // Notificación de éxito
      toast.success(`'${form.titulo}' actualizado correctamente.`); 
      navigate("/admin/peliculas"); 
      
    } catch (error) {
      console.error("Error al actualizar la película:", error);
      toast.error("Error al guardar los cambios.");
      setGuardando(false);
    }
  };

  // --- Estado de Carga Inicial ---
  if (cargando)
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
        <p className="mt-4 text-white text-xl font-medium">Cargando datos de la película...</p>
      </div>
    );
    
  return (
    <div className="p-4 sm:p-8 text-white max-w-4xl mx-auto font-sans">
      
      {/* HEADER con Botón Volver */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-4">
        <button
          onClick={() => navigate("/admin/peliculas")}
          className="p-3 bg-gray-700/50 rounded-full hover:bg-gray-600 transition shadow-md"
          title="Volver a la lista de películas"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <h1 className="text-3xl font-extrabold text-indigo-400 flex items-center gap-2">
          <Pencil size={28} /> Editando: <span className="text-white truncate">{form.titulo}</span>
        </h1>
      </div>

      <form
        onSubmit={confirmarActualizacion} 
        className="bg-gray-900/60 p-6 sm:p-8 rounded-xl shadow-2xl shadow-indigo-900/30 border border-gray-700 backdrop-blur-md"
      >
        
        {/* SECCIÓN 1: Información Principal */}
        <h2 className="text-xl font-bold text-indigo-400 mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
            <Film size={20} /> Detalles de la Película
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Título */}
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Título <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
              required
            />
          </div>
          
          {/* URL de Imagen */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-gray-300 text-sm font-medium">URL de Póster/Imagen <span className="text-red-500">*</span></label>
            <input
              type="url"
              name="imagen"
              value={form.imagen}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full p-3 rounded-lg bg-gray-800 border border-indigo-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
              required
            />
          </div>

          {/* Fila 2 */}
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Género</label>
            <input
              type="text"
              name="genero"
              value={form.genero}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
            />
          </div>
          
          {/* Fila 3 */}
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Duración (Ej: 2h 15min)</label>
            <input
              type="text"
              name="duracion"
              value={form.duracion}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-gray-300 text-sm font-medium">Año</label>
            <input
              type="number"
              name="anio"
              value={form.anio}
              onChange={handleChange}
              placeholder="2023"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
            />
          </div>
          
        </div>

        {/* SECCIÓN 2: Descripción y Detalles */}
        <h2 className="text-xl font-bold text-indigo-400 mb-4 pb-2 border-b border-gray-700 flex items-center gap-2">
            <Info size={20} /> Contenido Extendido
        </h2>
        <div className="space-y-6">
            
            {/* Descripción */}
            <div>
              <label className="block mb-1 text-gray-300 text-sm font-medium">Descripción</label>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
              />
            </div>

            {/* Detalles */}
            <div>
              <label className="block mb-1 text-gray-300 text-sm font-medium">Detalles</label>
              <textarea
                name="detalles"
                value={form.detalles}
                onChange={handleChange}
                rows={3}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
              />
            </div>
            
            {/* Recomendación y Reseña en una fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block mb-1 text-gray-300 text-sm font-medium">Recomendación</label>
                    <textarea
                        name="recomendacion"
                        value={form.recomendacion}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-300 text-sm font-medium">Reseña</label>
                    <textarea
                        name="reseña"
                        value={form.reseña}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
                    />
                </div>
            </div>
          
            {/* Campos adicionales más abajo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                <div>
                    <label className="block mb-1 text-gray-300 text-sm font-medium">Autor</label>
                    <input
                      type="text"
                      name="autor"
                      value={form.autor}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-300 text-sm font-medium">Rango de edad</label>
                    <input
                      type="text"
                      name="rangoEdad"
                      value={form.rangoEdad}
                      onChange={handleChange}
                      placeholder="+7, +13, etc"
                      className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition text-sm"
                    />
                </div>
            </div>

        </div>


        {/* BOTÓN - Llama a la confirmación */}
        <button
          type="submit"
          disabled={guardando}
          className="mt-10 w-full flex justify-center items-center gap-3 bg-indigo-600 px-6 py-3 rounded-full font-extrabold text-white uppercase tracking-wider disabled:opacity-50 transition-all hover:bg-indigo-500 shadow-xl shadow-indigo-900/50"
        >
          {guardando ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {guardando ? "Guardando cambios..." : "Guardar Cambios"}
        </button>
      </form>
      
      {/* --- MODAL DE CONFIRMACIÓN DE GUARDADO (Estilo Índigo) --- */}
      <Dialog open={modalGuardarAbierto} onClose={() => setModalGuardarAbierto(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm border border-indigo-700 shadow-2xl shadow-indigo-900/50">

            <div className="text-center mb-4 text-indigo-400">
                <AlertTriangle size={32} className="mx-auto mb-2" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 text-center">
              Confirmar Actualización
            </h2>

            <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
              Estás a punto de Guardar los Cambios en la película: 
              <span className="font-extrabold text-indigo-300 block mt-1">
                "{form.titulo}"
              </span>
              . ¿Deseas proceder?
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={() => setModalGuardarAbierto(false)}
                disabled={guardando}
                className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <X size={18} /> Cancelar
              </button>

              <button
                onClick={actualizarPelicula}
                disabled={guardando}
                className="flex-1 px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-indigo-500/30"
              >
                {guardando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Guardar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
      {/* ------------------------------------------ */}
    </div>
  );
}