// src/Paginas/Inicio.jsx
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
import { comentariosPeliculas } from "../assets/comentariospeli";

export default function Inicio({ searchQuery = "" }) {
  const categorias = ["Top 10", "Basadas en Libros", "Kids", "Documentales", "Asiáticas"];
  const carruseles = useRef({});
  const { theme } = useTheme();
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);

  const [peliDestacada, setPeliDestacada] = useState(null);

  useEffect(() => {
    const random = Math.floor(Math.random() * peliculas.length);
    setPeliDestacada(peliculas[random]);

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * peliculas.length);
      setPeliDestacada(peliculas[randomIndex]);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const obtenerPromedio = (peliculaId) => {
    const comentarios = comentariosPeliculas.filter((c) => c.peliculaId === peliculaId);
    if (comentarios.length === 0) return 0;
    const suma = comentarios.reduce((acc, c) => acc + c.puntuacion, 0);
    return suma / comentarios.length;
  };

  useEffect(() => {
    if (!user) return;
    const cargarFavoritos = async () => {
      const q = query(collection(db, "favoritos"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      setFavoritos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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

    const newSnap = await getDocs(query(collection(db, "favoritos"), where("uid", "==", user.uid)));
    setFavoritos(newSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const esFavorito = (titulo) => favoritos.some((fav) => fav.titulo === titulo);

  const scroll = (categoria, direccion) => {
    const contenedor = carruseles.current[categoria];
    if (contenedor) {
      contenedor.scrollBy({
        left: direccion === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      categorias.forEach((categoria) => {
        const contenedor = carruseles.current[categoria];
        if (!contenedor) return;

        const maxScroll = contenedor.scrollWidth - contenedor.clientWidth;

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
      peli.autor?.toLowerCase().includes(query) ||
      peli.reseña?.toLowerCase().includes(query) ||
      peli.descripcion?.toLowerCase().includes(query) ||
      peli.recomendacion?.toLowerCase().includes(query) ||
      peli.detalles?.toLowerCase().includes(query) ||
      peli.anio?.toString().includes(query)
    );
  });

  const normalizar = (texto) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const obtenerRutaCategoria = (categoria) => {
    if (!categoria) return "/";
    const c = normalizar(categoria);

    if (c.includes("top")) return "/PeliTops";
    if (c.includes("libro")) return "/PeliLibros";
    if (c.includes("kids")) return "/PeliKids";
    if (c.includes("documental")) return "/PeliDocumentales";
    if (c.includes("asiatic")) return "/PeliAsiaticas";

    return "/";
  };

  const rutaCategoriaSlide =
    peliDestacada ? obtenerRutaCategoria(peliDestacada.categoria) : "/";

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0B1014] text-white"
          : "bg-[#F9F9F9] text-gray-900"
      }`}
    >
      {peliDestacada && (
        <Link to={rutaCategoriaSlide}>
          <div className="w-full h-[300px] md:h-[380px] rounded-xl overflow-hidden relative shadow-lg mb-10 cursor-pointer">
            <img
              src={peliDestacada.imagen}
              className="w-full h-full object-cover object-center transition-all duration-700"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>

            <div className="absolute bottom-4 left-4">
              <h2 className="text-3xl font-bold text-white drop-shadow-lg">
                {peliDestacada.titulo}
              </h2>
              <p className="text-sm text-gray-200 line-clamp-2 max-w-[500px]">
                {peliDestacada.descripcion}
              </p>
            </div>
          </div>
        </Link>
      )}

      <h1
        className={`text-4xl mb-6 text-center font-bold ${
          theme === "dark" ? "text-[#00C8D7]" : "text-[#007D85]"
        }`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        🎬 Todas las películas
      </h1>

      {peliculasFiltradas.length === 0 ? (
        <p
          className={`text-center text-lg mt-10 ${
            theme === "dark" ? "text-[#B0B0B0]" : "text-gray-600"
          }`}
        >
          No se encontraron películas 😢
        </p>
      ) : (
        categorias.map((categoria) => {
          let peliculasCategoria = peliculasFiltradas.filter(
            (peli) => normalizar(peli.categoria) === normalizar(categoria)
          );

          // ❌ SE QUITÓ EL ORDEN ALEATORIO — AHORA SE MUESTRAN NORMAL
          // peliculasCategoria = [...peliculasCategoria].sort(() => Math.random() - 0.5);

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

              <button
                onClick={() => scroll(categoria, "left")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full z-10 ${
                  theme === "dark"
                    ? "bg-[#0B1014]/70 hover:bg-[#00C8D7]"
                    : "bg-[#E0E0E0]/70 hover:bg-[#00C8D7]"
                }`}
              >
                ◀
              </button>

              <button
                onClick={() => scroll(categoria, "right")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full z-10 ${
                  theme === "dark"
                    ? "bg-[#0B1014]/70 hover:bg-white"
                    : "bg-[#E0E0E0]/70 hover:bg-[#00C8D7]"
                }`}
              >
                ▶
              </button>

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
                    <button
                      onClick={() => handleToggleFavorite(peli)}
                      className={`absolute top-2 right-2 p-2 rounded-full ${
                        esFavorito(peli.titulo)
                          ? "bg-red-500 text-white"
                          : "bg-gray-700 text-white hover:bg-red-500"
                      }`}
                    >
                      <Heart size={18} fill={esFavorito(peli.titulo) ? "white" : "none"} />
                    </button>

                    <Link to={`/detalle/${peli.id}`}>
                      <img
                        src={peli.imagen}
                        className="rounded-lg mb-2 w-full h-48 object-cover cursor-pointer"
                      />

                      <h3
                        className={`text-lg font-semibold truncate ${
                          theme === "dark"
                            ? "text-white hover:text-[#00C8D7]"
                            : "text-gray-900 hover:text-[#007D85]"
                        }`}
                      >
                        {peli.titulo}
                      </h3>

                      <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.round(obtenerPromedio(peli.id)) ? "★" : "☆"}
                          </span>
                        ))}
                        <span className="text-xs ml-1 text-gray-400">
                          {obtenerPromedio(peli.id).toFixed(1)}/5
                        </span>
                      </div>
                    </Link>

                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-[#B0B0B0]" : "text-gray-600"
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
