// ✅ src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useTheme } from "./Context/ThemeContext";
import { useAuth } from "./Context/AuthContext";
import { Toaster } from "react-hot-toast";

// PÁGINAS
import Inicio from "./Paginas/Inicio";
import PeliTops from "./Paginas/PeliTops";
import PeliKids from "./Paginas/PeliKids";
import PeliDocumentales from "./Paginas/PeliDocumentales";
import PeliLibros from "./Paginas/PeliLibros";
import PeliAsiaticas from "./Paginas/PeliAsiaticas";
import Contacto from "./Paginas/Contacto";
import Carrito from "./Paginas/Carrito";
import DetallePelicula from "./Paginas/Detalle";
import Estreno from "./Paginas/Estrenos";

// COMPONENTES
import Navbar from "./Componentes/Navbar";
import Footer from "./Componentes/Footer";
import Bienvenido from "./Componentes/Bienvenido";
import Modal from "./Componentes/Modal";
import Dashboard from "./Componentes/Dashboard";
import ResultadosBusqueda from "./Componentes/ResultadosBusqueda";
import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro";

// ADMIN
import ProtectedRoute from "./Componentes/AdminRoute";
import DashboardLayout from "./Componentes/DashboardAdmi/DashboardLayaout";
import AdminInicio from "./Componentes/DashboardAdmi/AdminInicio";
import AdminUsuarios from "./Componentes/DashboardAdmi/AdminUsuarios";
import AdminPeliculas from "./Componentes/DashboardAdmi/AdminPeliculas";
import AdminAgregarPelicula from "./Componentes/DashboardAdmi/AdminAgregarPelicula";
import AdminEditarPelicula from "./Componentes/DashboardAdmi/AdminEditarPelicula";
import GenerarCupon from "./Componentes/DashboardAdmi/GenerarCupon";
import ImportarPeliculas from "./Componentes/importarPeliculas";
import EstadosCupones from "./Componentes/DashboardAdmi/EstadoCupones";

import "./App.css";

// 🔐 Ruta protegida usuario
function RutaProtegida({ element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-cyan-600">
        Cargando...
      </div>
    );
  }

  if (!user) return null;

  return element;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();
  const navigate = useNavigate();

  // 🔍 Buscador
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // 🟧 Modal
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
      <Bienvenido />

      <Navbar onSearch={handleSearch} onAbrirLogin={abrirLogin} />

      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          {/* RUTAS PÚBLICAS */}
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
          <Route path="/Estrenos" element={<Estreno />} />

          {/* DASHBOARD USUARIO */}
          <Route
            path="/dashboard"
            element={<RutaProtegida element={<Dashboard />} />}
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolRequerido="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminInicio />} />
            <Route path="peliculas" element={<AdminPeliculas />} />
            <Route path="peliculas/agregar" element={<AdminAgregarPelicula />} />
            <Route path="peliculas/editar/:id" element={<AdminEditarPelicula />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="cupones/generar" element={<GenerarCupon />} />
            <Route path="cupones/estados" element={<EstadosCupones />} />
            <Route path="importar" element={<ImportarPeliculas />} />
          </Route>
        </Routes>
      </main>

      <Footer />

      {/* MODAL GLOBAL */}
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
