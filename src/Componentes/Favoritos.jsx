// src/Componentes/Favoritos.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { db } from "../lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../Context/ThemeContext"; // <-- Importamos ThemeContext

export default function Favoritos() {
  const { user } = useAuth();
  const { theme } = useTheme(); // <-- Extraemos theme
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

  const eliminarFavorito = async (id) => {
    try {
      await deleteDoc(doc(db, "favoritos", id));
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
    }
  };

  // --- Clases dinámicas según theme ---
  const containerBg = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const cardBg = theme === "dark" ? "bg-gray-900/80 border-gray-700" : "bg-white border-gray-300";
  const cardShadowHover = theme === "dark" ? "hover:shadow-cyan-600/20" : "hover:shadow-cyan-300/30";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const subTextColor = theme === "dark" ? "text-cyan-400" : "text-cyan-600";

  return (
    <div className={`p-6 ${containerBg}`}>
      <h2 className={`text-3xl font-extrabold uppercase tracking-widest border-b-2 pb-3 inline-block mb-8 ${theme === 'dark' ? 'text-white border-cyan-600' : 'text-gray-900 border-cyan-500'}`}>
        MIS FAVORITOS
      </h2>

      {favoritos.length === 0 ? (
        <p className={`${textColor} text-center mt-10`}>
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
              className={`relative ${cardBg} border rounded-xl p-3 shadow-lg hover:-translate-y-1 transition-all duration-300 ${cardShadowHover}`}
            >
              <Link to={`/detalle/${peli.id}`}>
                <img
                  src={peli.imagen || "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬"}
                  alt={peli.titulo}
                  className="rounded-lg w-full h-56 object-cover mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬";
                  }}
                />
                <h3 className={`text-lg font-bold truncate hover:text-cyan-400 transition-colors ${textColor}`}>
                  {peli.titulo}
                </h3>
                {peli.genero && (
                  <p className={`text-sm ${subTextColor}`}>{peli.genero}</p>
                )}
              </Link>

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
