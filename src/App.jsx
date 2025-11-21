// ✅ src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTheme } from "./Context/ThemeContext";
import { useAuth } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";

import Inicio from "./Paginas/Inicio";
import PeliTops from "./Paginas/PeliTops";
import PeliKids from "./Paginas/PeliKids";
import PeliDocumentales from "./Paginas/PeliDocumentales";
import PeliLibros from "./Paginas/PeliLibros";
import PeliAsiaticas from "./Paginas/PeliAsiaticas";
import Contacto from "./Paginas/Contacto";
import Carrito from "./Paginas/Carrito";
import DetallePelicula from "./Paginas/Detalle";

import Navbar from "./Componentes/Navbar";
import Footer from "./Componentes/Footer";
import Modal from "./Componentes/Modal";
import Dashboard from "./Componentes/Dashboard";
import ResultadosBusqueda from "./Componentes/ResultadosBusqueda";

import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro";

import "./App.css";

function RutaProtegida({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-cyan-600">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return element;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 🔍 Función para manejar búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // === 🟦 ESTADOS DEL MODAL ===
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalContenido, setModalContenido] = useState("login"); 
  // "login" o "registro"

  const abrirLogin = () => {
    setModalContenido("login");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-100'}>

      {/* 🔵 Pasamos abrirLogin al Navbar → ZonaUsuario */}
      <Navbar onSearch={handleSearch} onAbrirLogin={abrirLogin} />

      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Inicio searchQuery={searchQuery} />} />
          <Route path="/PeliculasTops" element={<PeliTops />} />
          <Route path="/PeliculasKids" element={<PeliKids />} />
          <Route path="/PeliAsiaticas" element={<PeliAsiaticas />} />
          <Route path="/PeliDocumentales" element={<PeliDocumentales />} />
          <Route path="/PeliLibros" element={<PeliLibros />} />
          <Route path="/Detalle/:id" element={<DetallePelicula />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/buscar" element={<ResultadosBusqueda />} />
          <Route path="/carrito" element={<Carrito />} />

          {/* 🔐 Dashboard protegido */}
          <Route 
            path="/dashboard" 
            element={<RutaProtegida element={<Dashboard />} />} 
          />
        </Routes>
      </main>

      <Footer />

      {/* === 🟧 MODAL GLOBAL === */}
      <Modal isOpen={modalAbierto} onClose={cerrarModal}>
        {modalContenido === "login" && (
          <Login 
            onLoginExitoso={() => { cerrarModal(); navigate("/dashboard"); }}
            irARegistro={() => setModalContenido("registro")}
          />
        )}

        {modalContenido === "registro" && (
          <Registro 
            onRegistroExitoso={() => { cerrarModal(); navigate("/dashboard"); }}
            irALogin={() => setModalContenido("login")}
          />
        )}
      </Modal>

      <Toaster position="bottom-right" />
    </div>
  );
}
