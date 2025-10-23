// ✅ src/App.jsx
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useTheme } from "./Context/ThemeContext";

// 🧭 Páginas
import Inicio from "./Paginas/Inicio";
import PeliTops from "./Paginas/PeliTops";
import PeliKids from "./Paginas/PeliKids";
import PeliDocumentales from "./Paginas/PeliDocumentales";
import PeliLibros from "./Paginas/PeliLibros";
import PeliAsiaticas from "./Paginas/PeliAsiaticas";
import Contacto from "./Paginas/Contacto";
import Login from "./Paginas/Login";
import Register from "./Paginas/Register";
import Carrito from "./Paginas/Carrito";
import DetallePelicula from "./Paginas/Detalle";

// 🧱 Componentes
import Navbar from "./Componentes/Navbar";
import Footer from "./Componentes/Footer";

// 🎨 Estilos globales
import "./App.css";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // 🔍 Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  return (
    <div className={theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}>
      {/* ✅ Navbar global con buscador y rutas */}
      <Navbar onSearch={handleSearch} />  

      {/* ✅ Contenido principal con rutas activas */}
      <main className="p-4">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Inicio searchQuery={searchQuery} />} />

          {/* Páginas de películas */}
          <Route path="/PeliculasTops" element={<PeliTops />} />
          <Route path="/PeliculasKids" element={<PeliKids />} />
          <Route path="/PeliAsiaticas" element={<PeliAsiaticas />} />
          <Route path="/PeliDocumentales" element={<PeliDocumentales />} />
          <Route path="/PeliLibros" element={<PeliLibros />} />
          <Route path="/Detalle/:id" element={<DetallePelicula />} />

        

          {/* Página de contacto */}
          <Route path="/Contacto" element={<Contacto />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />

          {/* Carrito */}
          <Route path="/carrito" element={<Carrito />} />
        </Routes>
       <Footer> 
        </Footer>
      </main>
    </div>
  );
}