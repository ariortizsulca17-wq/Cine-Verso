import { useRef, useEffect, useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function MovieCarousel({ titulo, peliculas }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const carruselRef = useRef(null);
  const [favoritos, setFavoritos] = useState([]);

  // 🔄 Escucha cambios en los favoritos del usuario
  useEffect(() => {
    if (!user) {
      setFavoritos([]);
      return;
    }

    const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const favs = snapshot.docs.map((doc) => ({
        idDoc: doc.id,
        ...doc.data(),
      }));
      setFavoritos(favs);
    });

    return () => unsubscribe();
  }, [user]);

  // ❤️ Añadir o quitar de favoritos
  const handleToggleFavorite = async (peli) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar a favoritos 😅");
      return;
    }

    const favExistente = favoritos.find((fav) => fav.peliculaId === peli.id);

    try {
      if (favExistente) {
        // ❌ Quitar de favoritos
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
      toast.error("Ocurrió un error al actualizar favoritos 😢");
    }
  };

  const scrollLeft = () => {
    carruselRef.current.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    carruselRef.current.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <div className={`mb-10 ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-bold text-[#00C8D7] mb-3">{titulo}</h2>
      <div className="relative">
        {/* Botón izquierda */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#1A1F25]/70 hover:bg-[#00C8D7] text-white p-3 rounded-full z-10"
        >
          ◀
        </button>

        {/* Carrusel */}
        <div
          ref={carruselRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth px-10 bg-gray-900 text-white"
        >
          {peliculas.map((peli) => {
            const esFavorito = favoritos.some((fav) => fav.peliculaId === peli.id);

            return (
              <div
                key={peli.id}
                className="relative min-w-[220px] bg-[#1A1F25] rounded-lg p-3 shadow-lg hover:scale-105 transition-transform duration-200"
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
                <h3 className="text-lg font-bold mt-2">{peli.titulo}</h3>
                <p className="text-sm text-[#B0B0B0]">{peli.anio}</p>
                <p className="text-sm text-[#00C8D7]">{peli.genero}</p>
                <button className="mt-2 bg-[#00C8D7] text-black px-3 py-1 rounded hover:bg-[#00E0FF] transition">
                  Ver ahora
                </button>
              </div>
            );
          })}
        </div>

        {/* Botón derecha */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#1A1F25]/70 hover:bg-[#00C8D7] text-white p-3 rounded-full z-10"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
