import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { ListOrdered, Filter } from "lucide-react";

export default function PeliTops() {
  const { theme } = useTheme();

  const [peliculas, setPeliculas] = useState([]);
  const [generoSeleccionado, setGeneroSeleccionado] = useState("Todos");
  const [loading, setLoading] = useState(true);

  // 🔥 FIRESTORE: Top 10
  useEffect(() => {
    const q = query(
      collection(db, "peliculas"),
      where("categoria", "==", "Top 10")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPeliculas(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🎭 Géneros
  const generos = useMemo(
    () => ["Todos", ...new Set(peliculas.map((p) => p.genero))],
    [peliculas]
  );

  // 🎬 Filtro
  const peliculasFiltradas = useMemo(() => {
    return generoSeleccionado === "Todos"
      ? peliculas
      : peliculas.filter((p) => p.genero === generoSeleccionado);
  }, [generoSeleccionado, peliculas]);

  // 🎨 Estilos
  const btnBase =
    "px-4 py-2 text-sm font-medium rounded-lg transition whitespace-nowrap";
  const btnDefault =
    theme === "dark"
      ? "bg-[#1A1F25] text-gray-300 hover:bg-[#00C8D7]/20 hover:text-[#00C8D7]"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  const btnSelected =
    "bg-[#00C8D7] text-black shadow-md shadow-[#00C8D7]/50 font-bold";

  return (
    <div
      className={`min-h-screen px-4 py-6 sm:p-6 overflow-x-hidden transition-colors duration-500 ${
        theme === "dark"
          ? "bg-[#0B1014] text-white"
          : "bg-[#f2f5f7] text-black"
      }`}
    >
      {/* HEADER */}
      <header className="mb-8 text-center sm:text-left">
        <h1
          className={`flex justify-center sm:justify-start items-center text-3xl sm:text-4xl font-extrabold mb-2 ${
            theme === "dark" ? "text-[#00C8D7]" : "text-[#007D85]"
          }`}
        >
          <ListOrdered className="w-7 h-7 sm:w-8 sm:h-8 mr-3" />
          El Top 10
        </h1>
        <p
          className={`text-sm sm:text-lg ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Explora las películas más aclamadas y populares del momento.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-8">
        {/* SIDEBAR */}
        <aside
          className={`mb-6 md:mb-0 p-4 rounded-xl shadow-xl md:sticky md:top-4 self-start ${
            theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filtrar por Género
          </h2>

          {/* Mobile: horizontal | Desktop: vertical */}
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {generos.map((g) => (
              <button
                key={g}
                onClick={() => setGeneroSeleccionado(g)}
                className={`${btnBase} ${
                  generoSeleccionado === g ? btnSelected : btnDefault
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </aside>

        {/* CONTENIDO */}
        <main className="md:col-span-3">
          {loading ? (
            <p className="text-gray-400 text-center py-10">
              Cargando películas...
            </p>
          ) : peliculasFiltradas.length === 0 ? (
            <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-500/50 rounded-xl">
              <p className="text-base sm:text-xl font-semibold text-gray-400 text-center px-4">
                No hay películas de "{generoSeleccionado}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {peliculasFiltradas.map((p, i) => (
                <div
                  key={p.id}
                  className={`rounded-xl overflow-hidden shadow-xl hover:scale-[1.03] transition-transform duration-300 relative ${
                    theme === "dark" ? "bg-[#1A1F25]" : "bg-white"
                  }`}
                >
                  {/* BADGE */}
                  <div className="absolute top-0 left-0 bg-[#00C8D7] text-black font-extrabold text-lg sm:text-2xl px-2 sm:px-3 py-1 rounded-br-lg z-10">
                    #{i + 1}
                  </div>

                  <Link to={`/detalle/${p.id}`}>
                    <img
                      src={p.imagen}
                      alt={p.titulo}
                      className="w-full h-40 sm:h-48 object-cover"
                    />

                    <div className="p-3">
                      <h2 className="text-sm sm:text-lg font-bold truncate">
                        {p.titulo}
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-400">
                        {p.genero} • {p.anio}
                      </p>
                    </div>
                  </Link>

                  <Link
                    to={`/detalle/${p.id}`}
                    className="block w-full text-center bg-[#00C8D7] text-black py-2 hover:bg-[#00E0FF] font-bold text-xs sm:text-sm uppercase tracking-wider"
                  >
                    Ver Detalle
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
