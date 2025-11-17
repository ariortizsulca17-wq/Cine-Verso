import { useEffect, useState } from "react";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../Context/AuthContext";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import peliculas from "./PeliculasData";

export default function MovieGallery() {
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  // 🔄 Escucha en tiempo real los favoritos del usuario
  useEffect(() => {
    if (!user) {
      setFavoritos([]);
      return;
    }

    const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        idDoc: doc.id, // ID del documento en Firestore
        ...doc.data(),
      }));
      setFavoritos(favs);
    });

    return () => unsubscribe();
  }, [user]);

  // ❤️ Añadir o quitar favorito
  const handleToggleFavorite = async (peli) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar a favoritos 😅");
      return;
    }

    const favExistente = favoritos.find((fav) => fav.peliculaId === peli.id);

    try {
      if (favExistente) {
        // ❌ Eliminar de favoritos
        await deleteDoc(doc(db, "favoritos", favExistente.idDoc));
        toast(`"${peli.titulo}" fue eliminado de tus favoritos 💔`);
      } else {
        // ✅ Agregar a favoritos
        await addDoc(collection(db, "favoritos"), {
          uid: user.uid,
          peliculaId: peli.id,
          titulo: peli.titulo,
          imagen: peli.imagen,
          createdAt: serverTimestamp(),
        });
        toast.success(`"${peli.titulo}" fue añadido a tus favoritos ❤️`);
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      toast.error("Error al actualizar favoritos 😢");
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6">
      {peliculas.map((peli) => {
        const esFavorito = favoritos.some((fav) => fav.peliculaId === peli.id);

        return (
          <div
            key={peli.id}
            className="relative bg-[#1A1F25] p-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
          >
            {/* ❤️ Botón de favoritos */}
            <button
              onClick={() => handleToggleFavorite(peli)}
              className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                esFavorito ? "bg-red-500" : "bg-gray-700 hover:bg-red-500"
              }`}
              title={esFavorito ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart
                size={20}
                className={esFavorito ? "text-white fill-white" : "text-white"}
              />
            </button>

            {/* 🎬 Imagen y detalles */}
            <img
              src={peli.imagen}
              alt={peli.titulo}
              className="rounded-lg w-full h-64 object-cover"
            />
            <h2 className="text-lg font-bold mt-2 text-white">{peli.titulo}</h2>
            <p className="text-sm text-[#B0B0B0]">{peli.anio}</p>
            <p className="text-sm text-[#00C8D7] font-semibold">{peli.genero}</p>

            <button className="mt-2 bg-[#00C8D7] text-black px-3 py-1 rounded hover:bg-[#00E0FF] transition">
              Ver ahora
            </button>
          </div>
        );
      })}
    </div>
  );
}
