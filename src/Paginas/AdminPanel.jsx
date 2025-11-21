import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { Dialog } from "@headlessui/react";
import { Check, X } from "lucide-react";

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modal, setModal] = useState({
    abierto: false,
    usuario: null,
    nuevoRol: null,
  });

  const [confirmando, setConfirmando] = useState(false);

  useEffect(() => {
    async function cargarUsuarios() {
      const snap = await getDocs(collection(db, "usuarios"));
      const lista = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setUsuarios(lista);
      setCargando(false);
    }
    cargarUsuarios();
  }, []);

  const abrirModal = (usuario, nuevoRol) => {
    setModal({ abierto: true, usuario, nuevoRol });
  };

  const cerrarModal = () => {
    setModal({ abierto: false, usuario: null, nuevoRol: null });
  };

  const confirmarCambio = async () => {
    setConfirmando(true);

    const { usuario, nuevoRol } = modal;

    await updateDoc(doc(db, "usuarios", usuario.id), { rol: nuevoRol });

    setUsuarios((prev) =>
      prev.map((u) => (u.id === usuario.id ? { ...u, rol: nuevoRol } : u))
    );

    setConfirmando(false);
    cerrarModal();
  };

  if (cargando)
    return (
      <p className="p-5 text-white text-center text-xl animate-pulse">
        Cargando usuarios...
      </p>
    );

  return (
    <div className="p-10 text-white max-w-5xl mx-auto">

      {/* Título */}
      <h1 className="text-4xl font-bold mb-8 text-center text-cyan-400 drop-shadow-lg">
        Panel de Administración
      </h1>

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
            {usuarios.map((u) => (
              <tr
                key={u.id}
                className="border-b border-cyan-700/20 hover:bg-cyan-900/20 transition"
              >
                {/* Avatar */}
                <td className="p-4">
                  <img
                    src={u.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                  />
                </td>

                {/* Nombre */}
                <td className="p-4">{u.username || "Sin nombre"}</td>

                {/* Email */}
                <td className="p-4">{u.email}</td>

                {/* Rol */}
                <td className="p-4 font-semibold text-cyan-300">{u.rol}</td>

                {/* Acciones */}
                <td className="p-4">
                  <select
                    defaultValue={u.rol}
                    onChange={(e) => abrirModal(u, e.target.value)}
                    className="bg-black/60 p-2 rounded-lg border border-cyan-600 text-white focus:ring-2 focus:ring-cyan-400"
                  >
                    <option value="usuario">Usuario</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      <Dialog open={modal.abierto} onClose={cerrarModal} className="relative z-50">

        {/* Fondo */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />

        {/* Contenido centrado */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-black/90 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-cyan-600">

            <h2 className="text-2xl font-bold text-cyan-400 mb-4 text-center">
              Confirmar cambio de rol
            </h2>

            <p className="mb-6 text-gray-300 text-center">
              ¿Estás seguro de cambiar el rol de  
              <span className="font-semibold text-white"> {modal.usuario?.username}</span>
              <br />
              por  
              <span className="font-semibold text-cyan-400"> {modal.nuevoRol}</span>?
            </p>

            <div className="flex justify-center gap-4 mt-6">
              {/* Cancelar */}
              <button
                onClick={cerrarModal}
                className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600 flex items-center gap-2"
              >
                <X size={18} /> Cancelar
              </button>

              {/* Confirmar */}
              <button
                onClick={confirmarCambio}
                disabled={confirmando}
                className="px-4 py-2 bg-cyan-600 rounded-xl hover:bg-cyan-500 flex items-center gap-2 disabled:opacity-50"
              >
                <Check size={18} />
                {confirmando ? "Guardando..." : "Confirmar"}
              </button>
            </div>

          </div>
        </div>
      </Dialog>
    </div>
  );
}
