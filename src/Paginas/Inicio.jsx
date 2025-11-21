import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import { db } from "../lib/firebase";
import {
  collection,
  query,
  where,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { Heart } from "lucide-react";
import peliculas from "../Componentes/PeliculasData";
import toast from "react-hot-toast";

// ⭐ IMPORTAMOS TUS COMENTARIOS LOCALES
import { comentariosPeliculas } from "../assets/comentariospeli";

export default function Inicio({ searchQuery = "" }) {
  const categorias = ["Top 10", "Basadas en Libros", "Kids", "Documentales", "Asiáticas"];
  const carruseles = useRef({});
  const { theme } = useTheme();
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  // ⭐ FUNCIÓN PARA SACAR PROMEDIO DE ESTRELLAS POR PELÍCULA
  const obtenerPromedio = (peliculaId) => {
    const comentarios = comentariosPeliculas.filter(
      (c) => c.peliculaId === peliculaId
    );

    if (comentarios.length === 0) return 0;

    const suma = comentarios.reduce((acc, c) => acc + c.puntuacion, 0);
    return suma / comentarios.length; // regresa el promedio real
  };

  // ⭐ Cargar favoritos del usuario
  useEffect(() => {
    if (!user) return;
    const cargarFavoritos = async () => {
      const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const favs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoritos(favs);
    };
    cargarFavoritos();
  }, [user]);

  const handleToggleFavorite = async (peli) => {
    if (!user) {
      toast.error("Inicia sesión para agregar a favoritos ❤️");
      return;
    }

    const q = query(
      collection(db, "favoritos"),
      where("uid", "==", user.uid),
      where("titulo", "==", peli.titulo)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await addDoc(collection(db, "favoritos"), {
        uid: user.uid,
        titulo: peli.titulo,
        imagen: peli.imagen,
        genero: peli.genero,
        createdAt: new Date(),
      });
      toast.success(`Agregado a favoritos ❤️`);
    } else {
      await deleteDoc(doc(db, "favoritos", snapshot.docs[0].id));
      toast("Eliminado de favoritos 💔", { icon: "🗑️" });
    }

    // refrescar estado
    const newSnapshot = await getDocs(
      query(collection(db, "favoritos"), where("uid", "==", user.uid))
    );
    setFavoritos(newSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const esFavorito = (titulo) =>
    favoritos.some((fav) => fav.titulo === titulo);

  const scroll = (categoria, direccion) => {
    const contenedor = carruseles.current[categoria];
    if (contenedor) {
      const scrollAmount = direccion === "left" ? -300 : 300;
      contenedor.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // ⭐ Carrusel automático INFINITO ⭐
  useEffect(() => {
    const interval = setInterval(() => {
      categorias.forEach((categoria) => {
        const contenedor = carruseles.current[categoria];
        if (!contenedor) return;

        const maxScroll =
          contenedor.scrollWidth - contenedor.clientWidth;

        if (contenedor.scrollLeft >= maxScroll - 10) {
          contenedor.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          contenedor.scrollBy({ left: 300, behavior: "smooth" });
        }
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const peliculasFiltradas = peliculas.filter((peli) => {
    const query = searchQuery.toLowerCase();
    return (
      peli.titulo?.toLowerCase().includes(query) ||
      peli.genero?.toLowerCase().includes(query) ||
      peli.categoria?.toLowerCase().includes(query) ||
      peli.anio?.toString().includes(query)
    );
  });

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0B1014] text-white"
          : "bg-[#F9F9F9] text-gray-900"
      }`}
    >
      <h1
        className={`text-3xl font-bold mb-6 text-center ${
          theme === "dark" ? "text-[#00C8D7]" : "text-[#008A91]"
        }`}
      >
        🎬 Todas las películas
      </h1>

      {peliculasFiltradas.length === 0 ? (
        <p
          className={`text-center text-lg mt-10 ${
            theme === "dark" ? "text-[#B0B0B0]" : "text-gray-600"
          }`}
        >
          No se encontraron películas con ese nombre 😢
        </p>
      ) : (
        categorias.map((categoria) => {
          const peliculasCategoria = peliculasFiltradas.filter(
            (peli) =>
              peli.categoria.toLowerCase() === categoria.toLowerCase()
          );

          if (peliculasCategoria.length === 0) return null;

          return (
            <div key={categoria} className="mb-12 relative">
              <h2
                className={`text-2xl font-semibold mb-3 ${
                  theme === "dark" ? "text-[#00C8D7]" : "text-[#007D85]"
                }`}
              >
                {categoria}
              </h2>

              {/* Botones de desplazamiento */}
              <button
                onClick={() => scroll(categoria, "left")}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 transition-all ${
                  theme === "dark"
                    ? "bg-[#0B1014]/70 hover:bg-[#00C8D7] text-white"
                    : "bg-[#E0E0E0]/70 hover:bg-[#00C8D7] text-gray-900"
                }`}
              >
                ◀
              </button>

              <button
                onClick={() => scroll(categoria, "right")}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-full z-10 transition-all ${
                  theme === "dark"
                    ? "bg-[#0B1014]/70 hover:bg-[#ffffff] text-white"
                    : "bg-[#E0E0E0]/70 hover:bg-[#00C8D7] text-gray-900"
                }`}
              >
                ▶
              </button>

              {/* ⭐ CARRUSEL */}
              <div
                ref={(el) => (carruseles.current[categoria] = el)}
                className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {peliculasCategoria.map((peli, index) => (
                  <div
                    key={peli.id || index}
                    className={`rounded-lg p-3 shadow-md hover:scale-105 transition-transform duration-300 min-w-[180px] relative ${
                      theme === "dark"
                        ? "bg-[#1A1F25]"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {/* ❤️ BOTÓN FAVORITO */}
                    <button
                      onClick={() => handleToggleFavorite(peli)}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-all ${
                        esFavorito(peli.titulo)
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-white hover:bg-red-500"
                      }`}
                    >
                      <Heart
                        size={18}
                        fill={esFavorito(peli.titulo) ? "white" : "none"}
                      />
                    </button>

                    <Link to={`/detalle/${peli.id}`}>
                      <img
                        src={peli.imagen}
                        alt={peli.titulo}
                        className="rounded-lg mb-2 w-full h-48 object-cover cursor-pointer"
                      />

                      {/* 🔹 TÍTULO */}
                      <h3
                        className={`text-lg font-semibold truncate transition-colors cursor-pointer ${
                          theme === "dark"
                            ? "text-white hover:text-[#00C8D7]"
                            : "text-gray-900 hover:text-[#007D85]"
                        }`}
                      >
                        {peli.titulo}
                      </h3>

                      {/* ⭐ PROMEDIO DE ESTRELLAS */}
                      <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.round(obtenerPromedio(peli.id))
                              ? "★"
                              : "☆"}
                          </span>
                        ))}

                        <span className="text-xs ml-1 text-gray-400">
                          {obtenerPromedio(peli.id).toFixed(1)}/5
                        </span>
                      </div>
                    </Link>

                    {/* 🔹 Año - Género */}
                    <p
                      className={`text-sm ${
                        theme === "dark"
                          ? "text-[#B0B0B0]"
                          : "text-gray-600"
                      }`}
                    >
                      {peli.anio} • {peli.genero}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
