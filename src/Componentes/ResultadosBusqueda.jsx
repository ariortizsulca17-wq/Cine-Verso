// src/Componentes/ResultadosBusqueda.jsx
import { useLocation, Link } from "react-router-dom";
import PeliculasData from "../Componentes/PeliculasData.jsx";

export default function ResultadosBusqueda() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const termino = queryParams.get("q")?.toLowerCase() || "";

  // 🔍 FILTRAR POR TODO (título, género, categoría, autor, reseña, año, etc.)
  const resultados = PeliculasData.filter((peli) => {
    const q = termino.toLowerCase();

    return (
      peli.titulo?.toLowerCase().includes(q) ||
      peli.genero?.toLowerCase().includes(q) ||
      peli.categoria?.toLowerCase().includes(q) ||
      peli.autor?.toLowerCase().includes(q) ||
      peli.reseña?.toLowerCase().includes(q) ||
      peli.descripcion?.toLowerCase().includes(q) ||
      peli.recomendacion?.toLowerCase().includes(q) ||
      peli.detalles?.toLowerCase().includes(q) ||
      peli.anio?.toString().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-5">
        Resultados para: <span className="text-cyan-400">"{termino}"</span>
      </h2>

      {resultados.length === 0 ? (
        <p className="text-gray-400">No se encontraron coincidencias.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {resultados.map((peli) => (
            <Link
              key={peli.id}
              to={`/Detalle/${peli.id}`}
              className="bg-gray-900 text-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <img src={peli.imagen} alt={peli.titulo} className="w-full h-60 object-cover" />
              <div className="p-3">
                <h3 className="font-bold text-lg">{peli.titulo}</h3>
                <p className="text-sm opacity-70">{peli.anio}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
