// src/Componentes/Favoritos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 👈 Necesitas esta importación
import { useAuth } from "../Context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Favoritos() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoritos(favs);
    });

    return () => unsubscribe();
  }, [user]);

  // 🗑️ Eliminar favorito
  const eliminarFavorito = async (id) => {
    try {
      await deleteDoc(doc(db, "favoritos", id));
      // NOTA: Puedes añadir una notificación profesional aquí (usando react-hot-toast)
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-extrabold uppercase tracking-widest text-white border-b-2 border-cyan-600 pb-3 inline-block mb-8">
        MIS FAVORITOS
      </h2>

      {favoritos.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">
          Aún no tienes películas en favoritos ❤️
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {favoritos.map((peli) => (
            <motion.div
              key={peli.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-gray-900/80 border border-gray-700 rounded-xl p-3 shadow-lg hover:shadow-cyan-600/20 hover:-translate-y-1 transition-all duration-300"
            >
              {/* 🛑 ENVOLVEMOS EL CONTENIDO EN EL LINK 🛑 */}
              <Link to={`/detalle/${peli.id}`}>
                {/* Imagen */}
                <img
                  src={peli.imagen || "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬"}
                  alt={peli.titulo}
                  // Se recomienda h-56 para que el tamaño sea más uniforme con Inicio
                  className="rounded-lg w-full h-56 object-cover mb-3" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬";
                  }}
                />

                {/* Título y género */}
                <h3 className="text-lg font-bold text-white truncate hover:text-cyan-400 transition-colors">{peli.titulo}</h3>
                {peli.genero && (
                  <p className="text-sm text-cyan-400">{peli.genero}</p>
                )}
              </Link>
              {/* 🛑 Botón eliminar: Debe quedar FUERA del Link 🛑 */}
              <button
                onClick={() => eliminarFavorito(peli.id)}
                className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-all shadow-md hover:shadow-red-500/30 z-10"
                title="Eliminar de favoritos"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}