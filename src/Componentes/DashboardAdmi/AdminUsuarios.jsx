import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Dialog } from "@headlessui/react";
import { Check, X, Trash2, UserCog } from "lucide-react";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState("");

  const [modal, setModal] = useState({
    abierto: false,
    usuario: null,
    nuevoRol: null,
    eliminar: false,
  });

  const [confirmando, setConfirmando] = useState(false);

  // ===========================
  //   Cargar Usuarios
  // ===========================
  useEffect(() => {
    async function cargarUsuarios() {
      const snap = await getDocs(collection(db, "usuarios"));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsuarios(lista);
      setFiltrados(lista);
      setCargando(false);
    }
    cargarUsuarios();
  }, []);

  // ===========================
  //   Filtro de búsqueda
  // ===========================
  useEffect(() => {
    const texto = buscar.toLowerCase();
    setFiltrados(
      usuarios.filter(
        (u) =>
          u.username?.toLowerCase().includes(texto) ||
          u.email?.toLowerCase().includes(texto)
      )
    );
  }, [buscar, usuarios]);

  // ===========================
  //   Abrir Modal
  // ===========================
  const abrirModal = (usuario, nuevoRol = null, eliminar = false) => {
    setModal({ abierto: true, usuario, nuevoRol, eliminar });
  };

  const cerrarModal = () =>
    setModal({ abierto: false, usuario: null, nuevoRol: null, eliminar: false });

  // ===========================
  //  Confirmar acción
  // ===========================
  const confirmarAccion = async () => {
    setConfirmando(true);
    const { usuario, nuevoRol, eliminar } = modal;

    try {
      if (eliminar) {
        // Eliminar usuario
        await deleteDoc(doc(db, "usuarios", usuario.id));
        setUsuarios((prev) => prev.filter((u) => u.id !== usuario.id));
      } else {
        // Cambiar rol
        await updateDoc(doc(db, "usuarios", usuario.id), { rol: nuevoRol });

        setUsuarios((prev) =>
          prev.map((u) => (u.id === usuario.id ? { ...u, rol: nuevoRol } : u))
        );
      }
    } catch (error) {
      console.error("Error en operación:", error);
    }

    setConfirmando(false);
    cerrarModal();
  };

  // ===========================
  //           UI
  // ===========================
  if (cargando)
    return (
      <p className="p-5 text-white text-center text-xl animate-pulse">
        Cargando usuarios...
      </p>
    );

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      {/* Título */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-cyan-400 drop-shadow-lg">
          Administrar Usuarios
        </h1>

        {/* Buscar */}
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="bg-black/40 px-4 py-2 rounded-xl border border-cyan-500 focus:ring-2 focus:ring-cyan-300"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl shadow-2xl border border-cyan-700/40 bg-black/40 backdrop-blur-xl">
        <table className="w-full">
          <thead className="bg-cyan-900/40">
            <tr>
              <th className="p-4 text-left">Avatar</th>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Rol</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtrados.map((u) => (
              <tr
                key={u.id}
                className="border-b border-cyan-700/20 hover:bg-cyan-900/20 transition"
              >
                {/* Avatar */}
                <td className="p-4">
                  <img
                    src={
                      u.avatar ||
                      "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                  />
                </td>

                {/* Nombre */}
                <td className="p-4 font-semibold">{u.username || "Sin nombre"}</td>

                {/* Email */}
                <td className="p-4 text-gray-300">{u.email}</td>

                {/* Rol */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold
                      ${
                        u.rol === "admin"
                          ? "bg-red-700/40 text-red-300"
                          : u.rol === "editor"
                          ? "bg-yellow-700/40 text-yellow-300"
                          : "bg-green-700/40 text-green-300"
                      }`}
                  >
                    {u.rol}
                  </span>
                </td>

                {/* Acciones */}
                <td className="p-4 flex gap-3 items-center">

                  {/* Cambiar rol */}
                  <button
                    onClick={() => abrirModal(u, "admin")}
                    className="p-2 bg-cyan-700 rounded-lg hover:bg-cyan-600"
                  >
                    <UserCog size={18} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => abrirModal(u, null, true)}
                    className="p-2 bg-red-700 rounded-lg hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {filtrados.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No hay usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===========================
          MODAL
      ============================ */}
      <Dialog open={modal.abierto} onClose={cerrarModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-black/90 p-8 rounded-2xl w-full max-w-md border border-cyan-600 shadow-2xl">

            <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
              {modal.eliminar ? "Eliminar Usuario" : "Cambiar Rol"}
            </h2>

            <p className="mb-6 text-gray-300 text-center leading-relaxed">
              {modal.eliminar
                ? `¿Seguro que deseas eliminar al usuario ${modal.usuario?.username}?`
                : `¿Confirmas cambiar el rol de ${modal.usuario?.username} a ${modal.nuevoRol}?`}
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={18} /> Cancelar
              </button>

              <button
                onClick={confirmarAccion}
                disabled={confirmando}
                className={`px-4 py-2 rounded-xl flex items-center gap-2
                  ${
                    modal.eliminar
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-cyan-600 hover:bg-cyan-500"
                  }
                  disabled:opacity-50
                `}
              >
                <Check size={18} />
                {confirmando ? "Procesando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
