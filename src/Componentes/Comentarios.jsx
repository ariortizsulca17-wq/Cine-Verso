// src/Componentes/Comentarios.jsx
import React, { useState, useEffect } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
// 👇 Usa tu contexto real: useAuth() o useUser()
import { useAuth } from "../Context/AuthContext";
import { comentariosPeliculas } from "../assets/comentariospeli";

function ComentariosPelicula({ peliculaId }) {
  const { user } = useAuth(); // 👈 el usuario actual logueado (user.displayName o user.email)
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [puntuacion, setPuntuacion] = useState(0);
  const [editandoId, setEditandoId] = useState(null);

  // 🔹 Cargar comentarios guardados o base inicial
  useEffect(() => {
    const guardados =
      JSON.parse(localStorage.getItem(`comentarios_${peliculaId}`)) || [];
    if (guardados.length > 0) {
      setComentarios(guardados);
    } else {
      const iniciales = comentariosPeliculas.filter(
        (c) => c.peliculaId === peliculaId
      );
      setComentarios(iniciales);
    }
  }, [peliculaId]);

  // 🔹 Guardar cambios en localStorage
  const guardarComentarios = (nuevos) => {
    setComentarios(nuevos);
    localStorage.setItem(`comentarios_${peliculaId}`, JSON.stringify(nuevos));
  };

  // 🔹 Agregar comentario
  const handleAgregar = () => {
    if (!nuevoComentario.trim() || puntuacion === 0) {
      alert("Por favor, escribe un comentario y selecciona una puntuación ⭐");
      return;
    }

    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }

    const nuevo = {
      id: Date.now(),
      peliculaId,
      nombreUsuario: user.displayName || user.email || "Usuario anónimo",
      mensaje: nuevoComentario,
      puntuacion,
      uid: user.uid,
    };

    guardarComentarios([...comentarios, nuevo]);
    setNuevoComentario("");
    setPuntuacion(0);
  };

  // 🔹 Editar
  const handleEditar = (id) => {
    const comentario = comentarios.find((c) => c.id === id);
    setNuevoComentario(comentario.mensaje);
    setPuntuacion(comentario.puntuacion);
    setEditandoId(id);
  };

  const handleGuardarEdicion = () => {
    const actualizados = comentarios.map((c) =>
      c.id === editandoId
        ? { ...c, mensaje: nuevoComentario, puntuacion }
        : c
    );
    guardarComentarios(actualizados);
    setNuevoComentario("");
    setPuntuacion(0);
    setEditandoId(null);
  };

  // 🔹 Eliminar
  const handleEliminar = (id) => {
    if (window.confirm("¿Eliminar este comentario?")) {
      const filtrados = comentarios.filter((c) => c.id !== id);
      guardarComentarios(filtrados);
    }
  };

  // 🔹 Estrellas visuales
  const renderPuntuacion = (valor) => (
    <div className="flex text-yellow-500">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < valor ? "fill-current" : "text-gray-600"
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.487 7.71l6.568-.955L10 1l2.945 5.755 6.568.955-4.758 4.835 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div className="mt-10 pt-6">
      <h2 className="text-3xl font-extrabold text-cyan-400 mb-6">
        Comentarios y Reseñas ({comentarios.length})
      </h2>

      {comentarios.length === 0 ? (
        <p className="text-gray-400 italic">
          Aún no hay comentarios para esta película. ¡Sé el primero!
        </p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className="bg-gray-700 p-4 rounded-lg border-l-4 border-cyan-500 shadow-lg relative group hover:shadow-cyan-500/20 transition"
            >
              {/* Cabecera */}
              <div className="flex justify-between items-start mb-2">
                <p className="text-md font-semibold text-gray-200">
                  {comentario.nombreUsuario}
                </p>
                {renderPuntuacion(comentario.puntuacion)}
              </div>

              {/* Texto */}
              <p className="text-gray-300 text-sm leading-relaxed italic">
                {comentario.mensaje}
              </p>

              {/* Botones visibles SOLO si el usuario actual escribió el comentario */}
              {user && comentario.uid === user.uid && (
                <div className="absolute top-2 right-2 flex space-x-2 opacity-80 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEditar(comentario.id)}
                    className="text-black hover:text-cyan-400 transition-colors"
                    title="Editar comentario"
                  >
                    <FiEdit size={17} />
                  </button>
                  <button
                    onClick={() => handleEliminar(comentario.id)}
                    className="text-black hover:text-red-500 transition-colors"
                    title="Eliminar comentario"
                  >
                    <FiTrash2 size={17} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Formulario */}
      <div className="mt-8 p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
        <h3 className="text-xl font-bold text-cyan-400 mb-4">
          {editandoId ? "Editar comentario" : "¡Deja tu opinión!"}
        </h3>

        <textarea
          placeholder="Escribe tu comentario..."
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          rows="3"
        />

        <div className="flex items-center mb-4">
          <span className="text-gray-300 mr-3">Tu puntuación:</span>
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setPuntuacion(num)}
              className={`text-2xl transition ${
                num <= puntuacion
                  ? "text-yellow-400"
                  : "text-gray-500 hover:text-yellow-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>

        <button
          onClick={editandoId ? handleGuardarEdicion : handleAgregar}
          className="w-full bg-cyan-600 text-gray-900 py-2 rounded-lg font-semibold hover:bg-cyan-500 transition shadow-md"
        >
          {editandoId ? "Guardar Cambios" : "Publicar Comentario"}
        </button>
      </div>
    </div>
  );
}

export default ComentariosPelicula;
