import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import Toast from "./Toast";
import { comentariosPeliculas } from "../assets/comentariospeli";
import { useTheme } from "../Context/ThemeContext"; // 🔑 Importamos ThemeContext

function ComentariosPelicula({ peliculaId, onPromedioChange }) {
  const { theme } = useTheme(); // 🔑 Obtenemos theme
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [editandoId, setEditandoId] = useState(null);
  const [editMensaje, setEditMensaje] = useState("");
  const [editPuntuacion, setEditPuntuacion] = useState(0);
  const [toast, setToast] = useState({ show: false, message: "" });

  const usuario = auth.currentUser;

  const formatearFecha = (timestamp) => {
    if (!timestamp?.seconds) return "";
    const fecha = new Date(timestamp.seconds * 1000);
    return fecha.toLocaleString("es-PE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🔥 COMENTARIOS
  useEffect(() => {
    if (!peliculaId) return;

    const q = query(
      collection(db, "comentarios"),
      where("peliculaId", "==", Number(peliculaId)),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const firestore = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        origen: "firestore",
      }));

      const locales = comentariosPeliculas
        .filter((c) => c.peliculaId === Number(peliculaId))
        .map((c, i) => ({ ...c, id: `local-${i}`, origen: "local" }));

      setComentarios([...locales, ...firestore]);
      setLoading(false);
    });

    return () => unsub();
  }, [peliculaId]);

  // ⭐ PROMEDIO
  useEffect(() => {
    if (comentarios.length === 0) return onPromedioChange(0);
    const total = comentarios.reduce((acc, c) => acc + (c.puntuacion || 0), 0);
    onPromedioChange(total / comentarios.length);
  }, [comentarios, onPromedioChange]);

  // ➕ CREAR
  const publicarComentario = async () => {
    if (!mensaje || puntuacion === 0) return;

    await addDoc(collection(db, "comentarios"), {
      mensaje,
      puntuacion,
      peliculaId: Number(peliculaId),
      userId: usuario.uid,
      nombreUsuario: usuario.displayName || usuario.email,
      createdAt: serverTimestamp(),
    });

    setMensaje("");
    setPuntuacion(0);
    setToast({ show: true, message: "Comentario publicado correctamente" });
  };

  // ✏️ ACTUALIZAR
  const actualizarComentario = async (id) => {
    if (!editMensaje || editPuntuacion === 0) return;

    await updateDoc(doc(db, "comentarios", id), {
      mensaje: editMensaje,
      puntuacion: editPuntuacion,
    });

    setEditandoId(null);
    setToast({ show: true, message: "Comentario actualizado correctamente" });
  };

  // 🗑️ ELIMINAR
  const eliminarComentario = async (id) => {
    await deleteDoc(doc(db, "comentarios", id));
    setToast({ show: true, message: "Comentario eliminado correctamente" });
  };

  if (loading) return <p className={theme === "dark" ? "text-gray-400" : "text-gray-700"}>Cargando comentarios...</p>;

  // 🔑 Colores según tema
  const bgComentario = theme === "dark" ? "bg-[#0B1014]" : "bg-gray-100";
  const bgComentarioMio = theme === "dark" ? "bg-[#0E1B22]" : "bg-cyan-100";
  const borderComentario = theme === "dark" ? "border-[#00C8D7]/20" : "border-cyan-300";
  const borderComentarioMio = theme === "dark" ? "border-[#00C8D7]" : "border-cyan-600";
  const textComentario = theme === "dark" ? "text-gray-300" : "text-gray-900";
  const textNombre = theme === "dark" ? "text-[#00C8D7]" : "text-cyan-700";
  const textBoton = theme === "dark" ? "text-[#00C8D7]" : "text-cyan-700";

  return (
    <div className="mt-12">
      <h2 className={`${textNombre} text-2xl font-bold mb-6`}>Comentarios</h2>

      {/* 💬 LISTA */}
      <div className="space-y-4 mb-10">
        {comentarios.map((c) => {
          const esMio = usuario?.uid === c.userId;

          return (
            <div
              key={c.id}
              className={`
                relative p-4 rounded-lg border transition-all duration-300 ease-in-out
                ${editandoId === c.id ? "scale-[1.02]" : "scale-100"}
                ${esMio
                  ? `${bgComentarioMio} ${borderComentarioMio} shadow-[0_0_12px_rgba(0,200,215,0.25)]`
                  : `${bgComentario} ${borderComentario}`
                }
              `}
            >
              <div className="flex justify-between mb-2">
                <div className="flex flex-col">
                  <span className={`font-bold flex items-center gap-2 ${textNombre}`}>
                    {c.nombreUsuario}
                    {esMio && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#00C8D7]/15 font-semibold">
                        Tu comentario
                      </span>
                    )}
                  </span>
                  {c.createdAt && (
                    <span className={theme === "dark" ? "text-xs text-gray-400" : "text-xs text-gray-600"}>
                      {formatearFecha(c.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${i < (editandoId === c.id ? editPuntuacion : c.puntuacion)
                        ? "text-yellow-400"
                        : "text-gray-600"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              {/* ✏️ EDICIÓN INLINE */}
              {editandoId === c.id ? (
                <>
                  <textarea
                    value={editMensaje}
                    onChange={(e) => setEditMensaje(e.target.value)}
                    className={`w-full p-2 rounded mb-3 transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}
                  />

                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setEditPuntuacion(i + 1)}
                        className={`text-3xl transition transform hover:scale-125 ${i < editPuntuacion ? "text-yellow-400" : "text-gray-600"}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <button className={`${textBoton} bg-[#00C8D7] px-4 py-1 rounded mr-3`} onClick={() => actualizarComentario(c.id)}>
                    Guardar
                  </button>

                  <button className={theme === "dark" ? "text-gray-400" : "text-gray-600"} onClick={() => setEditandoId(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <p className={textComentario}>{c.mensaje}</p>

                  {esMio && (
                    <div className="flex gap-4 mt-3 text-sm">
                      <button onClick={() => { setEditandoId(c.id); setEditMensaje(c.mensaje); setEditPuntuacion(c.puntuacion); }} className={textBoton}>
                        Editar
                      </button>
                      <button onClick={() => eliminarComentario(c.id)} className="text-red-400">
                        Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 📝 FORMULARIO NUEVO */}
      {usuario && (
        <div className={`${bgComentario} p-5 rounded-xl border ${borderComentario}`}>
          <h3 className={`${textNombre} text-lg font-bold mb-3`}>Escribe tu comentario</h3>

          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className={`w-full p-2 rounded mb-3 transition-all duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-900"}`}
          />

          <div className="flex mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPuntuacion(i + 1)}
                className={`text-4xl transition transform hover:scale-125 ${i < puntuacion ? "text-yellow-400" : theme === "dark" ? "text-gray-600" : "text-gray-400"}`}
              >
                ★
              </button>
            ))}
          </div>

          <button
            disabled={puntuacion === 0}
            onClick={publicarComentario}
            className={`px-6 py-2 rounded-lg font-bold transition ${puntuacion === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#00C8D7] hover:bg-[#00E0FF] text-black"}`}
          >
            Publicar
          </button>
        </div>
      )}

      <Toast
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
}

export default ComentariosPelicula;
