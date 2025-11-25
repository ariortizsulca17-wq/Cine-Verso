import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext.jsx";
import { useAuth } from "../Context/AuthContext.jsx";
import { db } from "../lib/firebase.js";
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
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi"; 
import peliculas from "../Componentes/PeliculasData";
import toast from "react-hot-toast";

import { comentariosPeliculas } from "../assets/comentariospeli";

export default function Inicio({ searchQuery = "" }) {
  const categorias = [
    "Top 10",
    "Basadas en Libros",
    "Kids",
    "Documentales",
    "Asiáticas",
  ];
  const carruseles = useRef({});
  const { theme } = useTheme();
  const { user } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [slide, setSlide] = useState(0);

  // LÓGICA DE FAVORITOS (Restaurada)
  useEffect(() => { 
    if (!user) return;
    const cargarFavoritos = async () => {
      const q = query(
        collection(db, "favoritos"),
        where("uid", "==", user.uid)
      );
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
      // Notificación de AGREGADO (ícono por defecto, estilo profesional)
      await addDoc(collection(db, "favoritos"), {
        uid: user.uid,
        id: peli.id,
        titulo: peli.titulo,
        imagen: peli.imagen,
        genero: peli.genero,
        createdAt: new Date(),
      });
      toast.success(`${peli.titulo} agregado a favoritos.`, {
        // La propiedad 'icon' ha sido removida para usar el ícono de éxito por defecto (checkmark)
        style: { 
            border: '1px solid #00C8D7', 
            padding: '16px', 
            color: '#00C8D7',
            fontWeight: 'bold',
            backgroundColor: theme === 'dark' ? '#1A1F25' : 'white', // Fondo adaptado al tema
        },
      });
    } else {
      // Notificación de ELIMINADO (ícono por defecto, estilo profesional)
      await deleteDoc(doc(db, "favoritos", snapshot.docs[0].id));
      toast.error(`${peli.titulo} eliminado de favoritos.`, {
        // La propiedad 'icon' ha sido removida para usar el ícono de error por defecto (X o !)
        style: { 
            border: '1px solid #FF4D4D', 
            padding: '16px', 
            color: '#FF4D4D', 
            fontWeight: 'bold',
            backgroundColor: theme === 'dark' ? '#1A1F25' : 'white', // Fondo adaptado al tema
        },
      });
    }

    const newSnapshot = await getDocs(
      query(collection(db, "favoritos"), where("uid", "==", user.uid))
    );
    setFavoritos(newSnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const esFavorito = (titulo) =>
    favoritos.some((fav) => fav.titulo === titulo);

  // LÓGICA DE CALIFICACIONES (Restaurada)
  const obtenerPromedio = (peliculaId) => { 
    const comentarios = comentariosPeliculas.filter(
      (c) => c.peliculaId === peliculaId
    );
    if (comentarios.length === 0) return 0;
    const suma = comentarios.reduce((acc, c) => acc + c.puntuacion, 0);
    return suma / comentarios.length;
  };

  // LÓGICA DE CARRUSELES Y SLIDER con BUCLE (Mantenida)
  const scroll = (categoria, direccion) => {
    const contenedor = carruseles.current[categoria];
    if (contenedor) {
      const scrollAmount = 250; 
      const maxScroll = contenedor.scrollWidth - contenedor.clientWidth;

      if (direccion === "right") {
        if (contenedor.scrollLeft >= maxScroll - 10) {
          contenedor.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          contenedor.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      } else if (direccion === "left") {
        if (contenedor.scrollLeft <= 10) {
          contenedor.scrollTo({ left: maxScroll, behavior: "smooth" });
        } else {
          contenedor.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
      }
    }
  };
  
  // SLIDER PRINCIPAL AUTOMÁTICO (Restaurado)
  useEffect(() => { 
    const intervalo = setInterval(() => {
      setSlide((prev) => (prev + 1) % peliculas.length);
    }, 4000); 
    return () => clearInterval(intervalo);
  }, []);

  // CARRUSEL DE CATEGORÍAS AUTOMÁTICO (Restaurado)
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

  // LÓGICA DE BÚSQUEDA (Restaurada)
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

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0B1014] text-white"
          : "bg-[#F9F9F9] text-gray-900"
      }`}
    >
      {/* 💥 CARRUSEL PRINCIPAL (SLIDER) - Mantenido 💥 */}
      {peliculas.length > 0 && (
        <Link to={`/detalle/${peliculas[slide].id}`}>
          <div className="w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden relative shadow-2xl mb-12 cursor-pointer group">
            <img
              src={peliculas[slide].imagen}
              alt={peliculas[slide].titulo}
              className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 md:left-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-[#00C8D7] drop-shadow-xl mb-2"
                  style={{ fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em' }}> 
                {peliculas[slide].titulo}
              </h2>
              <p className="text-base md:text-xl text-gray-200 line-clamp-3 max-w-lg font-light">
                {peliculas[slide].descripcion}
              </p>
            </div>
          </div>
        </Link>
      )}
      {/* ------------------------------------------------------------------ */}

      {/* TÍTULO PRINCIPAL - Mantenido */}
      <h1
        className={`text-5xl mb-10 text-center font-extrabold tracking-tight ${
          theme === "dark" ? "text-white" : "text-gray-900"
        }`}
        style={{ fontFamily: "'Oswald', sans-serif" }} 
      >
        EXPLORA EL <span className="text-[#00C8D7]">CINEVERSO</span>
      </h1>
      <hr className="mb-10 border-[#00C8D7]/30"/>

      {peliculasFiltradas.length === 0 ? (
        <p
          className={`text-center text-xl mt-10 font-medium ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No se encontraron películas con ese nombre 😔.
        </p>
      ) : (
        categorias.map((categoria) => {
          const peliculasCategoria = peliculasFiltradas.filter(
            (peli) =>
              peli.categoria.toLowerCase() === categoria.toLowerCase()
          );

          if (peliculasCategoria.length === 0) return null;

          return (
            <div key={categoria} className="mb-14 relative group">
              {/* Título de Categoría - Mantenido */}
              <h2
                className={`text-3xl font-bold mb-4 ml-2 uppercase tracking-wider ${
                  theme === "dark" ? "text-[#00C8D7]" : "text-[#007D85]"
                }`}
                style={{ fontFamily: "'Oswald', sans-serif" }}
              >
                {categoria}
              </h2>

              {/* Botones de desplazamiento - Mantenidos */}
              <button
                onClick={() => scroll(categoria, "left")}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg ${
                  theme === "dark"
                    ? "bg-[#0B1014]/80 hover:bg-[#00C8D7] text-white"
                    : "bg-white/80 hover:bg-[#007D85] text-gray-900 border border-gray-300"
                } hidden md:block`}
              >
                <FiChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll(categoria, "right")}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 p-3 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg ${
                  theme === "dark"
                    ? "bg-[#0B1014]/80 hover:bg-[#00C8D7] text-white"
                    : "bg-white/80 hover:bg-[#007D85] text-gray-900 border border-gray-300"
                } hidden md:block`}
              >
                <FiChevronRight size={24} />
              </button>

              {/* Carrusel */}
              <div
                ref={(el) => (carruseles.current[categoria] = el)}
                className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {peliculasCategoria.map((peli, index) => (
                  <div
                    key={peli.id || index}
                    // Tamaño fijo w-44 y min-w-44
                    className={`rounded-xl p-4 shadow-xl hover:shadow-[#00C8D7]/30 transition-all duration-500 w-44 min-w-44 relative flex-shrink-0 ${
                      theme === "dark"
                        ? "bg-[#1A1F25]"
                        : "bg-white border border-gray-100"
                    }`}
                  >
                    {/* Botón de favoritos - Mantenido */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggleFavorite(peli);
                      }}
                      className={`absolute top-2 right-2 p-1.5 rounded-full z-10 transition-colors ${
                        esFavorito(peli.titulo)
                          ? "bg-red-600 text-white shadow-md hover:bg-red-700"
                          : "bg-black/50 text-white hover:bg-red-500/70"
                      }`}
                    >
                      <Heart
                        size={20}
                        fill={esFavorito(peli.titulo) ? "white" : "none"}
                        className="transition-transform duration-200 hover:scale-110"
                      />
                    </button>

                    <Link to={`/detalle/${peli.id}`}>
                      {/* Altura de imagen fija h-56 */}
                      <img
                        src={peli.imagen}
                        alt={peli.titulo}
                        className="rounded-lg mb-3 w-full h-56 object-cover cursor-pointer shadow-lg"
                      />
                      <h3
                        className={`text-lg font-bold truncate transition-colors cursor-pointer mb-1 ${
                          theme === "dark"
                            ? "text-white hover:text-[#00C8D7]"
                            : "text-gray-900 hover:text-[#007D85]"
                        }`}
                      >
                        {peli.titulo}
                      </h3>

                      {/* Estrellas - Mantenidas */}
                      <div className="flex items-center gap-1 text-sm mb-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FiStar 
                            key={i} 
                            size={16} 
                            className={i < Math.round(obtenerPromedio(peli.id)) ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                          />
                        ))}
                        <span className="text-xs ml-1 font-medium text-gray-400">
                          {obtenerPromedio(peli.id).toFixed(1)}/5
                        </span>
                      </div>
                      {/* Detalles - Mantenidos */}
                      <p
                        className={`text-sm ${
                          theme === "dark"
                            ? "text-gray-400"
                            : "text-gray-600"
                        }`}
                      >
                        {peli.anio} • {peli.genero}
                      </p>
                    </Link>
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