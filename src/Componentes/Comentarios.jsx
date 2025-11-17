// src/Componentes/Comentarios.jsx
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

function ComentariosPelicula({ peliculaId }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [editandoId, setEditandoId] = useState(null);
  const [, setHover] = useState(0);

  // 🟣 Cargar comentarios desde Firebase en tiempo real
  useEffect(() => {
    const q = query(
      collection(db, "peliculas", `${peliculaId}`, "comentarios"),
      orderBy("timestamp", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const datos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComentarios(datos);
    });
    return () => unsubscribe();
  }, [peliculaId]);

  // 🟣 Añadir comentario
  const handleAgregar = async () => {
    if (!nuevoComentario.trim() || puntuacion === 0) {
      alert("Por favor, escribe un comentario y selecciona una puntuación ⭐");
      return;
    }
    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    await addDoc(collection(db, "peliculas", `${peliculaId}`, "comentarios"), {
      mensaje: nuevoComentario,
      puntuacion,
      usuarioNombre: user.displayName || user.email || "Usuario anónimo",
      uid: user.uid,
      timestamp: serverTimestamp(),
    });

    setNuevoComentario("");
    setPuntuacion(0);
  };

  // 🟣 Editar comentario
  const handleEditar = async (id, mensaje, puntuacion) => {
    setNuevoComentario(mensaje);
    setPuntuacion(puntuacion);
    setEditandoId(id);
  };

  const handleGuardarEdicion = async () => {
    if (editandoId) {
      const ref = doc(db, "peliculas", `${peliculaId}`, "comentarios", editandoId);
      await updateDoc(ref, {
        mensaje: nuevoComentario,
        puntuacion,
        timestamp: serverTimestamp(),
      });
      setEditandoId(null);
      setNuevoComentario("");
      setPuntuacion(0);
    }
  };

  // 🟣 Eliminar comentario
  const handleEliminar = async (id) => {
    if (window.confirm("¿Eliminar este comentario?")) {
      await deleteDoc(doc(db, "peliculas", `${peliculaId}`, "comentarios", id));
    }
  };

  // 🟣 Renderizar estrellas (con medias)
  const renderPuntuacionEditable = (valor, setValor) => (
    <div className="flex space-x-1 text-yellow-400">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const halfValue = i + 0.5;
        return (
          <span key={i} className="cursor-pointer text-2xl">
            {valor >= starValue ? (
              <FaStar
                onClick={() => setValor(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(0)}
              />
            ) : valor >= halfValue ? (
              <FaStarHalfAlt
                onClick={() => setValor(halfValue)}
                onMouseEnter={() => setHover(halfValue)}
                onMouseLeave={() => setHover(0)}
              />
            ) : (
              <FaRegStar
                onClick={() => setValor(halfValue)}
                onMouseEnter={() => setHover(halfValue)}
                onMouseLeave={() => setHover(0)}
              />
            )}
          </span>
        );
      })}
    </div>
  );

  const renderPuntuacion = (valor) => (
    <div className="flex text-yellow-400 text-sm">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1;
        const halfValue = i + 0.5;
        return valor >= starValue ? (
          <FaStar key={i} />
        ) : valor >= halfValue ? (
          <FaStarHalfAlt key={i} />
        ) : (
          <FaRegStar key={i} />
        );
      })}
    </div>
  );

  // 🕒 Mostrar tiempo
  const mostrarTiempo = (timestamp) => {
    if (!timestamp) return "";
    const fecha = timestamp.toDate();
    const diffHoras = dayjs().diff(dayjs(fecha), "hour");

    return diffHoras < 24
      ? `Hace ${dayjs(fecha).fromNow()}`
      : `${dayjs(fecha).format("DD/MM/YYYY - HH:mm")}`;
  };

  return (
    <div className="mt-10 pt-6">
      <h2 className="text-3xl font-extrabold text-cyan-400 mb-6">
        Comentarios y Reseñas ({comentarios.length})
      </h2>

      {/* 📜 Lista de comentarios */}
      {comentarios.length === 0 ? (
        <p className="text-gray-400 italic">
          Aún no hay comentarios para esta película. ¡Sé el primero!
        </p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((c) => (
            <div
              key={c.id}
              className={`p-4 rounded-lg border-l-4 shadow-md transition ${
                theme === "dark"
                  ? "bg-gray-800 border-cyan-500 text-gray-100"
                  : "bg-gray-100 border-cyan-600 text-gray-800"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">{c.usuarioNombre}</p>
                {renderPuntuacion(c.puntuacion)}
              </div>
              <p className="italic mb-1">{c.mensaje}</p>
              <p className="text-xs text-gray-500">{mostrarTiempo(c.timestamp)}</p>

              {/* Solo el autor puede editar/eliminar */}
              {user && c.uid === user.uid && (
                <div className="flex space-x-3 mt-2 text-sm">
                  <button
                    onClick={() => handleEditar(c.id, c.mensaje, c.puntuacion)}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-200"
                  >
                    <FiEdit /> <span>Editar</span>
                  </button>
                  <button
                    onClick={() => handleEliminar(c.id)}
                    className="flex items-center space-x-1 text-red-400 hover:text-red-300"
                  >
                    <FiTrash2 /> <span>Eliminar</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✍️ Formulario */}
      <div
        className={`mt-8 p-6 rounded-lg border shadow-lg transition ${
          theme === "dark"
            ? "bg-gray-900 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <h3 className="text-xl font-bold text-cyan-400 mb-4">
          {editandoId ? "Editar comentario" : "¡Deja tu opinión!"}
        </h3>

        {user ? (
          <>
            <textarea
              placeholder="Escribe tu comentario..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              className={`w-full mb-3 p-3 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                theme === "dark"
                  ? "bg-gray-800 text-gray-100"
                  : "bg-gray-100 text-gray-900"
              }`}
              rows="3"
            />

            <div className="flex items-center mb-4">
              <span className="mr-3 text-gray-400">Tu puntuación:</span>
              {renderPuntuacionEditable(puntuacion, setPuntuacion)}
            </div>

            <button
              onClick={editandoId ? handleGuardarEdicion : handleAgregar}
              className="w-full bg-cyan-600 text-gray-900 py-2 rounded-lg font-semibold hover:bg-cyan-500 transition"
            >
              {editandoId ? "Guardar Cambios" : "Publicar Comentario"}
            </button>
          </>
        ) : (
          <p className="text-gray-500 italic">
            🔒 Debes iniciar sesión para comentar.
          </p>
        )}
      </div>
    </div>
  );
}

export default ComentariosPelicula;
