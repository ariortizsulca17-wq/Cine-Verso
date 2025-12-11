// ✅ src/App.jsx (VERSIÓN FINAL FUSIONADA)
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTheme } from "./Context/ThemeContext";
import { useAuth } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";

// ⭐ PÁGINAS PRINCIPALES
import Inicio from "./Paginas/Inicio";
import PeliTops from "./Paginas/PeliTops";
import PeliKids from "./Paginas/PeliKids";
import PeliDocumentales from "./Paginas/PeliDocumentales";
import PeliLibros from "./Paginas/PeliLibros";
import PeliAsiaticas from "./Paginas/PeliAsiaticas";
import Contacto from "./Paginas/Contacto";
import Carrito from "./Paginas/Carrito";
import DetallePelicula from "./Paginas/Detalle";

// ⭐ COMPONENTES GENERALES
import Navbar from "./Componentes/Navbar";
import Footer from "./Componentes/Footer";
import Bienvenido from "./Componentes/Bienvenido";   // ⭐ AÑADIDO DESDE TU COMPAÑERA
import Modal from "./Componentes/Modal";
import Dashboard from "./Componentes/Dashboard";
import ResultadosBusqueda from "./Componentes/ResultadosBusqueda";
import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro";

// ⭐ ADMIN
import ProtectedRoute from "./Componentes/AdminRoute";
import DashboardLayout from "./Componentes/DashboardAdmi/DashboardLayaout";
import AdminInicio from "./Componentes/DashboardAdmi/AdminInicio";
import AdminUsuarios from "./Componentes/DashboardAdmi/AdminUsuarios";
import AdminPeliculas from "./Componentes/DashboardAdmi/AdminPeliculas";
import AdminAgregarPelicula from "./Componentes/DashboardAdmi/AdminAgregarPelicula";
import AdminEditarPelicula from "./Componentes/DashboardAdmi/AdminEditarPelicula";
import GenerarCupon from "./Componentes/DashboardAdmi/GenerarCupon";
import ImportarPeliculas from "./Componentes/importarPeliculas";

import "./App.css";
import EstadosCupones from "./Componentes/DashboardAdmi/EstadoCupones";

// ⭐ RUTA PROTEGIDA PARA USUARIOS NORMALES
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

  // 🔍 BUSCADOR
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // 🟦 ESTADOS DEL MODAL
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalContenido, setModalContenido] = useState("login");

  const abrirLogin = () => {
    setModalContenido("login");
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <div className={theme === "dark" ? "min-h-screen bg-gray-900" : "min-h-screen bg-gray-100"}>

      {/* ⭐ TARJETA DE BIENVENIDA (DE TU COMPAÑERA) */}
      <Bienvenido />  

      <Navbar onSearch={handleSearch} onAbrirLogin={abrirLogin} />

      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          {/* 📌 RUTAS PÚBLICAS */}
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

          {/* ⭐ DASHBOARD USUARIO NORMAL */}
          <Route
            path="/dashboard"
            element={<RutaProtegida element={<Dashboard />} />}
          />

          {/* 👑 RUTAS ADMINISTRADOR */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolRequerido="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* INDEX */}
            <Route index element={<AdminInicio />} />

            {/* ADMIN PELÍCULAS */}
            <Route path="peliculas" element={<AdminPeliculas />} />
            <Route path="peliculas/agregar" element={<AdminAgregarPelicula />} />
            <Route path="peliculas/editar/:id" element={<AdminEditarPelicula />} />

            {/* ADMIN USUARIOS */}
            <Route path="usuarios" element={<AdminUsuarios />} />

            {/* CUPONES */}
            <Route path="cupones/generar" element={<GenerarCupon />} />
            <Route path="cupones/estados" element={<EstadosCupones />} />

            {/* IMPORTAR */}
            <Route path="importar" element={<ImportarPeliculas />} />
          </Route>
        </Routes>
      </main>

      <Footer />

      {/* 🟧 MODAL GLOBAL */}
      <Modal isOpen={modalAbierto} onClose={cerrarModal}>
        {modalContenido === "login" && (
          <Login
            onLoginExitoso={() => {
              cerrarModal();
              navigate("/dashboard");
            }}
            irARegistro={() => setModalContenido("registro")}
          />
        )}

        {modalContenido === "registro" && (
          <Registro
            onRegistroExitoso={() => {
              cerrarModal();
              navigate("/dashboard");
            }}
            irALogin={() => setModalContenido("login")}
          />
        )}
      </Modal>

      <Toaster position="bottom-right" />
    </div>
  );
}
