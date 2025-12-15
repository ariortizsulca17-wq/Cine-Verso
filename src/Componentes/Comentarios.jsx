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

function ComentariosPelicula({ peliculaId, onPromedioChange }) {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // NUEVO
  const [mensaje, setMensaje] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);

  // EDICIÓN INLINE
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
      orderBy("createdAt", "asc") // 👈 NUEVOS ABAJO
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
    setToast({ show: true, message: " Comentario publicado correctamente" });
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

  if (loading) return <p className="text-gray-400">Cargando comentarios...</p>;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-[#00C8D7] mb-6">Comentarios</h2>

      {/* 💬 LISTA */}
      <div className="space-y-4 mb-10">
        {comentarios.map((c) => {
          const esMio = usuario?.uid === c.userId;

          return (
            <div
              key={c.id}
              className={`
        relative p-4 rounded-lg border
        transition-all duration-300 ease-in-out
        ${editandoId === c.id ? "scale-[1.02]" : "scale-100"}
        ${esMio
                  ? "bg-[#0E1B22] border-[#00C8D7] shadow-[0_0_12px_rgba(0,200,215,0.25)]"
                  : "bg-[#0B1014] border-[#00C8D7]/20"
                }
      `}
            >

              <div className="flex justify-between mb-2">
                <div className="flex flex-col">
                  <span className="font-bold text-[#00C8D7] flex items-center gap-2">
                    {c.nombreUsuario}

                    {esMio && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#00C8D7]/15 text-[#00C8D7] font-semibold">
                        Tu comentario
                      </span>
                    )}
                  </span>
                  {c.createdAt && (
                    <span className="text-xs text-gray-400">
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
                    className="w-full bg-gray-800 text-white p-2 rounded mb-3
             transition-all duration-300"
                  />

                  <div className="flex mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setEditPuntuacion(i + 1)}
                        className={`text-3xl transition transform hover:scale-125 ${i < editPuntuacion
                          ? "text-yellow-400"
                          : "text-gray-600"
                          }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => actualizarComentario(c.id)}
                    className="bg-[#00C8D7] text-black px-4 py-1 rounded mr-3"
                  >
                    Guardar
                  </button>

                  <button
                    onClick={() => setEditandoId(null)}
                    className="text-gray-400"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <p className="text-gray-300">{c.mensaje}</p>

                  {usuario?.uid === c.userId && (
                    <div className="flex gap-4 mt-3 text-sm">
                      <button
                        onClick={() => {
                          setEditandoId(c.id);
                          setEditMensaje(c.mensaje);
                          setEditPuntuacion(c.puntuacion);
                        }}
                        className="text-[#00C8D7]"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarComentario(c.id)}
                        className="text-red-400"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );})}
      </div>

      {/* 📝 FORMULARIO NUEVO */}
      {usuario && (
        <div className="bg-[#0B1014] p-5 rounded-xl border border-[#00C8D7]/30">
          <h3 className="text-lg font-bold text-[#00C8D7] mb-3">
            Escribe tu comentario
          </h3>

          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded mb-3"
          />

          <div className="flex mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPuntuacion(i + 1)}
                className={`text-4xl transition transform hover:scale-125 ${i < puntuacion ? "text-yellow-400" : "text-gray-600"
                  }`}
              >
                ★
              </button>
            ))}
          </div>

          <button
            disabled={puntuacion === 0}
            onClick={publicarComentario}
            className={`px-6 py-2 rounded-lg font-bold ${puntuacion === 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-[#00C8D7] hover:bg-[#00E0FF] text-black"
              }`}
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
