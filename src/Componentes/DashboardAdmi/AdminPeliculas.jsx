import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Dialog } from "@headlessui/react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminPeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [filtradas, setFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState("");

  const [modal, setModal] = useState({
    abierto: false,
    pelicula: null,
  });

  const [procesando, setProcesando] = useState(false);

  const navigate = useNavigate();

  // ===========================
  //   Cargar Películas
  // ===========================
  useEffect(() => {
    async function cargarPeliculas() {
      const snap = await getDocs(collection(db, "peliculas"));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

      setPeliculas(lista);
      setFiltradas(lista);
      setCargando(false);
    }

    cargarPeliculas();
  }, []);

  // ===========================
  //   Filtro de búsqueda
  // ===========================
  useEffect(() => {
    const text = buscar.toLowerCase();
    setFiltradas(
      peliculas.filter(
        (p) =>
          p.titulo?.toLowerCase().includes(text) ||
          p.genero?.toLowerCase().includes(text) ||
          p.categoria?.toLowerCase().includes(text)
      )
    );
  }, [buscar, peliculas]);

  // ===========================
  //   Modal
  // ===========================
  const abrirModalEliminar = (pelicula) => {
    setModal({ abierto: true, pelicula });
  };

  const cerrarModal = () => {
    setModal({ abierto: false, pelicula: null });
  };

  // ===========================
  //   Confirmar eliminación
  // ===========================
  const eliminarPelicula = async () => {
    setProcesando(true);

    try {
      await deleteDoc(doc(db, "peliculas", modal.pelicula.id));

      setPeliculas((prev) =>
        prev.filter((p) => p.id !== modal.pelicula.id)
      );
    } catch (error) {
      console.error("Error eliminando película:", error);
    }

    setProcesando(false);
    cerrarModal();
  };

  // ===========================
  //           UI
  // ===========================

  if (cargando)
    return (
      <p className="p-5 text-white text-center text-xl animate-pulse">
        Cargando películas...
      </p>
    );

  return (
    <div className="p-8 text-white max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-lg">
          Administrar Películas
        </h1>

        <button
          onClick={() => navigate("/dashboard/agregar-pelicula")}
          className="flex items-center gap-2 bg-cyan-600 px-4 py-2 rounded-xl hover:bg-cyan-500"
        >
          <Plus size={20} />
          Agregar Película
        </button>
      </div>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por título, género o categoría..."
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        className="w-full mb-6 px-4 py-3 bg-black/40 border border-cyan-600 rounded-xl focus:ring-2 focus:ring-cyan-300"
      />

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl shadow-xl border border-cyan-700/40 bg-black/40 backdrop-blur-xl">
        <table className="w-full">
          <thead className="bg-cyan-900/40">
            <tr>
              <th className="p-4 text-left">Imagen</th>
              <th className="p-4 text-left">Título</th>
              <th className="p-4 text-left">Género</th>
              <th className="p-4 text-left">Año</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtradas.map((p) => (
              <tr
                key={p.id}
                className="border-b border-cyan-700/20 hover:bg-cyan-900/20 transition"
              >
                {/* Imagen */}
                <td className="p-4">
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    className="w-20 h-28 object-cover rounded-lg border-2 border-cyan-500 shadow"
                  />
                </td>

                {/* Título */}
                <td className="p-4 font-semibold">{p.titulo}</td>

                {/* Género */}
                <td className="p-4 text-gray-300">{p.genero}</td>

                {/* Año */}
                <td className="p-4 text-gray-300">{p.anio}</td>

                {/* Acciones */}
                <td className="p-4 flex gap-3">

                  {/* Editar */}
                  <button
                    onClick={() =>
                      navigate(`/dashboard/editar-pelicula/${p.id}`)
                    }
                    className="p-2 bg-yellow-600 rounded-lg hover:bg-yellow-500"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => abrirModalEliminar(p)}
                    className="p-2 bg-red-700 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtradas.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  No se encontraron películas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===========================
          Modal de eliminación
      ============================ */}
      <Dialog open={modal.abierto} onClose={cerrarModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-black/90 p-8 rounded-2xl border border-red-600 w-full max-w-md">

            <h2 className="text-2xl font-bold text-red-400 text-center mb-4">
              Eliminar película
            </h2>

            <p className="text-gray-300 text-center mb-6">
              ¿Seguro que deseas eliminar <br />
              <span className="font-semibold text-white">
                {modal.pelicula?.titulo}
              </span>
              ?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600"
              >
                Cancelar
              </button>

              <button
                onClick={eliminarPelicula}
                disabled={procesando}
                className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-500 disabled:opacity-50"
              >
                {procesando ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
