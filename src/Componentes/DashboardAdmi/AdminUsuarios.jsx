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
import {
  Check,
  X,
  Trash2,
  UserCog,
  Search,
  Users,
  Loader2,
  AlertTriangle,
  User,
} from "lucide-react";

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState("");
  const [error, setError] = useState(null); // Nuevo estado para errores

  const [modal, setModal] = useState({
    abierto: false,
    usuario: null,
    nuevoRol: null,
    eliminar: false,
  });

  const [confirmando, setConfirmando] = useState(false);


  useEffect(() => {
    async function cargarUsuarios() {
      setCargando(true);
      setError(null);
      try {
        const snap = await getDocs(collection(db, "usuarios"));
        const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setUsuarios(lista);
        setFiltrados(lista);
      } catch (e) {
        console.error("Error al cargar usuarios:", e);
        setError("Error al cargar usuarios. Verifica la conexión a Firebase.");
      }
      setCargando(false);
    }
    cargarUsuarios();
  }, []);


  useEffect(() => {
    const texto = buscar.toLowerCase();
    setFiltrados(
      usuarios.filter(
        (u) =>
          u.username?.toLowerCase().includes(texto) ||
          u.email?.toLowerCase().includes(texto) ||
          u.rol?.toLowerCase().includes(texto)
      )
    );
  }, [buscar, usuarios]);


  const abrirModal = (usuario, nuevoRol = null, eliminar = false) => {
    setModal({ abierto: true, usuario, nuevoRol, eliminar });
  };

  const cerrarModal = () =>
    setModal({ abierto: false, usuario: null, nuevoRol: null, eliminar: false });


  const confirmarAccion = async () => {
    setConfirmando(true);
    setError(null);
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
    } catch (e) {
      console.error("Error en operación:", e);
      setError(`Fallo al ${eliminar ? "eliminar" : "cambiar rol"}. Verifique sus reglas de seguridad.`);
    }

    setConfirmando(false);
    cerrarModal();
  };


  const getRolStyles = (rol) => {
    switch (rol) {
      case "admin":
        return "bg-red-500/20 text-red-300 ring-1 ring-red-400/50";
      case "editor":
        return "bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-400/50";
      default:
        return "bg-green-500/20 text-green-300 ring-1 ring-green-400/50";
    }
  };

  const getUsername = (user) => user.username || (user.email ? user.email.split('@')[0] : 'Usuario Anónimo');

  if (cargando)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        <p className="ml-3 text-white text-xl font-medium">Cargando usuarios...</p>
      </div>
    );

  return (
    <div className="p-6 text-white max-w-7xl mx-auto font-sans">

      {/* HEADER Y BUSCADOR */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-700">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-cyan-400 mr-3" />
          <h1 className="text-3xl font-extrabold uppercase tracking-wider text-white">
            Panel de Usuarios
          </h1>
        </div>

        <div className="relative w-full sm:w-80 mt-4 sm:mt-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="w-full bg-gray-800/80 pl-10 pr-4 py-2 rounded-full border border-gray-600 
                       focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all text-sm shadow-inner"
          />
        </div>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="bg-red-900/40 border border-red-500 text-red-300 p-4 rounded-lg mb-6 flex items-center shadow-lg">
          <AlertTriangle className="w-5 h-5 mr-3" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* TABLA OPTIMIZADA */}
      <div className="overflow-x-auto rounded-xl shadow-2xl shadow-cyan-900/30 border border-cyan-800/50 bg-gray-900/60 backdrop-blur-md">
        <table className="min-w-full divide-y divide-cyan-700/50">
          <thead className="bg-cyan-900/20 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 text-left font-semibold text-cyan-400">Usuario</th>
              <th className="p-4 text-left font-semibold text-cyan-400 hidden sm:table-cell">Email</th>
              <th className="p-4 text-left font-semibold text-cyan-400">Rol</th>
              <th className="p-4 text-left font-semibold text-cyan-400">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700/50">
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500 text-lg">
                  No se encontraron usuarios con el término de búsqueda.
                </td>
              </tr>
            ) : (
              filtrados.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-gray-800/50 transition duration-150"
                >
                  {/* Avatar y Nombre (Mezclados para mejor presentación en móvil) */}
                  <td className="p-4 flex items-center">
                    <img
                      src={
                        u.avatar ||
                        "https://via.placeholder.com/48/4B5563/FFFFFF?text=U"
                      }
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/70 mr-3 shadow-md"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm">
                        {getUsername(u)}
                      </span>
                      <span className="text-gray-400 text-xs sm:hidden">
                        {u.email}
                      </span>
                    </div>
                  </td>

                  {/* Email (Solo en pantallas medianas/grandes) */}
                  <td className="p-4 text-gray-400 text-sm hidden sm:table-cell">
                    {u.email}
                  </td>

                  {/* Rol */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${getRolStyles(u.rol)}`}
                    >
                      {u.rol?.toUpperCase() || "USUARIO"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="p-4 flex gap-2 items-center">
                    {/* Botón Cambiar rol */}
                    <button
                      onClick={() => abrirModal(u, u.rol === 'admin' ? 'usuario' : 'admin')}
                      title={u.rol === 'admin' ? "Degradar a Usuario" : "Promover a Admin"}
                      className="p-2 bg-cyan-600/70 rounded-full hover:bg-cyan-500 transition shadow-md hover:shadow-cyan-500/50"
                    >
                      <UserCog size={16} />
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      onClick={() => abrirModal(u, null, true)}
                      title="Eliminar usuario permanentemente"
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
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-sm border border-cyan-700 shadow-2xl shadow-cyan-900/50">

            <div className={`text-center mb-4 ${modal.eliminar ? 'text-red-400' : 'text-cyan-400'}`}>
              {modal.eliminar ? <Trash2 size={32} className="mx-auto mb-2" /> : <UserCog size={32} className="mx-auto mb-2" />}
            </div>

            <h2 className="text-xl font-bold text-white mb-2 text-center">
              {modal.eliminar ? "¿Eliminar usuario?" : "¿Cambiar Rol?"}
            </h2>

            <p className="mb-6 text-gray-400 text-center text-sm leading-relaxed">
              {modal.eliminar
                ? `Confirmas la eliminación permanente de: ${modal.usuario?.username || modal.usuario?.email}? Esta acción es irreversible.`
                : `Estás a punto de cambiar el rol de ${modal.usuario?.username || modal.usuario?.email} a: `}
              {!modal.eliminar && (
                <span className="font-extrabold text-cyan-300">
                  {modal.nuevoRol?.toUpperCase()}
                </span>
              )}
            </p>

            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={cerrarModal}
                disabled={confirmando}
                className="flex-1 px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 text-white font-medium flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <X size={18} /> Cancelar
              </button>

              <button
                onClick={confirmarAccion}
                disabled={confirmando}
                className={`flex-1 px-4 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition disabled:opacity-50
                  ${modal.eliminar
                    ? "bg-red-600 hover:bg-red-500 shadow-red-500/30"
                    : "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/30"
                  }
                  shadow-md`}
              >
                {confirmando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <Check size={18} /> Confirmar
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