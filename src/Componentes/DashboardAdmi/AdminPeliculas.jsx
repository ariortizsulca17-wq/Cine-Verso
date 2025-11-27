import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Dialog } from "@headlessui/react";
import { Pencil, Trash2, Plus, Film, Search, Loader2, X, AlertTriangle, Image } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

export default function AdminPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState("");
  const [error, setError] = useState(null); 

  const [modal, setModal] = useState({
    abierto: false,
    pelicula: null,
  });

  const [procesando, setProcesando] = useState(false);

  const navigate = useNavigate();


  useEffect(() => {
    async function cargarPeliculas() {
      setCargando(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "peliculas"));
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setPeliculas(lista);
        setFiltradas(lista);
      } catch (e) {
        console.error("Error al cargar películas:", e);
        setError("Error al cargar la lista de películas. ¿Firebase conectado?");
      } finally {
        setCargando(false);
      }
    }

    cargarPeliculas();
  }, []);


  useEffect(() => {
    const text = buscar.toLowerCase();
    setFiltradas(
      peliculas.filter(
        (p) =>
          p.titulo?.toLowerCase().includes(text) ||
          p.genero?.toLowerCase().includes(text) ||
          p.categoria?.toLowerCase().includes(text) ||
          p.anio?.toString().includes(text) 
      )
    );
  }, [buscar, peliculas]);


  const abrirModalEliminar = (pelicula) => {
    setModal({ abierto: true, pelicula });
  };

  const cerrarModal = () => {
    setModal({ abierto: false, pelicula: null });
  };

  const eliminarPelicula = async () => {
    setProcesando(true);
    setError(null);

    try {
      await deleteDoc(doc(db, "peliculas", modal.pelicula.id));

      // Actualizar el estado para reflejar la eliminación
      setPeliculas((prev) =>
        prev.filter((p) => p.id !== modal.pelicula.id)
      );
    } catch (e) {
      console.error("Error eliminando película:", e);
      setError(`Fallo al eliminar la película: ${e.message}.`);
    }

    setProcesando(false);
    cerrarModal();
  };
  
  // Función de navegación a Agregar
  const handleNavigateAdd = () => {
    navigate("/admin/peliculas/agregar"); 
  };
  
  // Función de navegación a Editar
  const handleNavigateEdit = (id) => {
    navigate(`/admin/peliculas/editar/${id}`);
  };



  if (cargando)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        <p className="ml-3 text-white text-xl font-medium">Cargando catálogo de películas...</p>
      </div>
    );
    
  // --- Función auxiliar para el badge de categoría/género ---
  const getBadgeStyle = (text) => {
    // Genera un hash simple para un color consistente basado en el texto
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        'bg-purple-700/30 text-purple-300 ring-purple-500/50',
        'bg-orange-700/30 text-orange-300 ring-orange-500/50',
        'bg-teal-700/30 text-teal-300 ring-teal-500/50',
        'bg-indigo-700/30 text-indigo-300 ring-indigo-500/50',
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="p-6 text-white max-w-7xl mx-auto font-sans">
      
      {/* HEADER, TÍTULO Y BOTÓN DE AGREGAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-700">
        <div className="flex items-center">
          <Film className="w-8 h-8 text-cyan-400 mr-3" />
          <h1 className="text-3xl font-extrabold uppercase tracking-wider text-white">
            Gestión de Películas
          </h1>
        </div>

        <button
          onClick={handleNavigateAdd}
          className="flex items-center gap-2 bg-cyan-600 px-5 py-2 mt-4 sm:mt-0 rounded-full font-bold 
                      hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/50"
        >
          <Plus size={20} />
          Agregar Película
        </button>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="bg-red-900/40 border border-red-500 text-red-300 p-4 rounded-lg mb-6 flex items-center shadow-lg">
          <AlertTriangle className="w-5 h-5 mr-3" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* BUSCADOR - MODIFICADO CON BOTÓN DE LIMPIEZA */}
      <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Buscar por título, género, categoría o año..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            // AUMENTAMOS PR (right padding) a pr-10 para hacer espacio al botón X
            className="w-full bg-gray-800/80 pl-10 pr-10 py-2 rounded-full border border-gray-600 
                        focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm shadow-inner"
          />
          
          {/* Botón de limpieza (solo se muestra si hay texto) */}
          {buscar.length > 0 && (
            <button
              onClick={() => setBuscar("")}
              title="Limpiar búsqueda"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
      </div>

      {/* TABLA OPTIMIZADA */}
      <div className="overflow-x-auto rounded-xl shadow-2xl shadow-cyan-900/30 border border-cyan-800/50 bg-gray-900/60 backdrop-blur-md">
        <table className="min-w-full divide-y divide-cyan-700/50">
          <thead className="bg-cyan-900/20 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 text-left font-semibold text-cyan-400">Portada</th>
              <th className="p-4 text-left font-semibold text-cyan-400">Título</th>
              <th className="p-4 text-left font-semibold text-cyan-400 hidden sm:table-cell">Categoría</th>
              <th className="p-4 text-left font-semibold text-cyan-400 hidden md:table-cell">Género / Año</th>
              <th className="p-4 text-left font-semibold text-cyan-400">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700/50">
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500 text-lg">
                  No se encontraron películas.
                </td>
              </tr>
            ) : (
              filtradas.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-gray-800/50 transition duration-150"
                >
                  {/* Póster */}
                  <td className="p-4">
                    {p.imagen ? (
                        <img
                            src={p.imagen}
                            alt={p.titulo}
                            className="w-16 h-24 object-cover rounded-lg border-2 border-cyan-500/70 shadow-lg"
                        />
                    ) : (
                        <div className="w-16 h-24 flex items-center justify-center bg-gray-700 rounded-lg text-gray-400 border border-gray-600">
                            <Image size={24} />
                        </div>
                    )}
                  </td>

                  {/* Título */}
                  <td className="p-4 font-bold text-white text-sm">
                    {p.titulo || "Título Desconocido"}
                  </td>

                  {/* Categoría (Badge) */}
                  <td className="p-4 hidden sm:table-cell">
                    <span 
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ring-1 ${getBadgeStyle(p.categoria || 'Otro')}`}
                    >
                        {p.categoria?.toUpperCase() || "SIN CAT."}
                    </span>
                  </td>

                  {/* Género / Año */}
                  <td className="p-4 text-sm hidden md:table-cell">
                    <p className="text-gray-300 font-semibold">{p.genero || 'N/A'}</p>
                    <p className="text-gray-500 text-xs">({p.anio || '????'})</p>
                  </td>

                  {/* Acciones */}
                  <td className="p-4 flex gap-3 items-center">
                    {/* Botón Editar */}
                    <button
                      onClick={() => handleNavigateEdit(p.id)}
                      title="Editar película"
                      className="p-2 bg-yellow-600/70 rounded-full hover:bg-yellow-500 transition shadow-md hover:shadow-yellow-500/50"
                    >
                      <Pencil size={16} />
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => abrirModalEliminar(p)}
                      title="Eliminar película"
                      className="p-2 bg-red-600/70 rounded-full hover:bg-red-500 transition shadow-md hover:shadow-red-500/50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>


      <Dialog open={modal.abierto} onClose={cerrarModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm border border-red-700 shadow-2xl shadow-red-900/50">

            <div className="text-center mb-4 text-red-400">
                <Trash2 size={32} className="mx-auto mb-2" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 text-center">
              Confirmar Eliminación
            </h2>

            <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
              ¿Estás completamente seguro de eliminar la película: 
              <span className="font-extrabold text-red-300 block mt-1">
                "{modal.pelicula?.titulo}"
              </span>
              ? Esta acción es irreversible.
            </p>

            <div className="flex justify-between gap-4">
              <button
                onClick={cerrarModal}
                disabled={procesando}
                className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <X size={18} /> Cancelar
              </button>

              <button
                onClick={eliminarPelicula}
                disabled={procesando}
                className="flex-1 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md shadow-red-500/30"
              >
                {procesando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} /> Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}