// ✅ src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom"; // Importar useNavigate
import { useTheme } from "./Context/ThemeContext";
import { useAuth } from "./Context/AuthContext.jsx"; // ✅ IMPORTAR useAuth

// 🧭 Páginas (Rutas públicas)
import Inicio from "./Paginas/Inicio";
import PeliTops from "./Paginas/PeliTops";
import PeliKids from "./Paginas/PeliKids";
import PeliDocumentales from "./Paginas/PeliDocumentales";
import PeliLibros from "./Paginas/PeliLibros";
import PeliAsiaticas from "./Paginas/PeliAsiaticas";
import Contacto from "./Paginas/Contacto";
import Carrito from "./Paginas/Carrito";
import DetallePelicula from "./Paginas/Detalle";

// 🧱 Componentes (UI Global)
import Navbar from "./Componentes/Navbar";
import Footer from "./Componentes/Footer";
import Dashboard from "./Componentes/Dashboard"; // ✅ IMPORTAR DASHBOARD
import Login from "./Componentes/Login"; // ✅ IMPORTAR LOGIN
import Registro from "./Componentes/Registro"; // ✅ IMPORTAR REGISTRO

// 🎨 Estilos globales
import "./App.css";

// 🔐 Componente para proteger la ruta del Dashboard
function RutaProtegida({ element }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Esperar a que la autenticación cargue
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-cyan-600">
        Cargando...
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    // Si no está en login, redirigir. Si ya está, no hace nada (evita bucle)
    // Aunque el Dashboard no estará en Routes, es buena práctica.
    navigate("/login");
    return null; 
  }

  // Si hay usuario, renderizar el componente
  return element;
}


export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const { theme } = useTheme();

  // ✅ Estados para manejar los modales
  // (Estados de modal removidos: actualmente no se usan en esta versión)

  // 🔍 Función para manejar la búsqueda
  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  // --- Funciones para Manejar los Modales ---
  // Las mantendremos simples, asumiendo que el Navbar ahora navega a /login
  
  // Función de redirección centralizada para los componentes de autenticación
  const navigate = useNavigate();


  return (
    // La clase del div de envoltura ahora se aplica directamente al fondo del main
    // para un mejor manejo de rutas completas.
    <div className={theme === 'dark' ? 'min-h-screen bg-gray-900' : 'min-h-screen bg-gray-100'}>
  <Navbar onSearch={handleSearch} />

      <main className="min-h-[calc(100vh-64px)]"> {/* Asegura que el contenido ocupe la altura restante */}
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<Inicio searchQuery={searchQuery} />} />
          <Route path="/PeliculasTops" element={<PeliTops />} />
          <Route path="/PeliculasKids" element={<PeliKids />} />
          <Route path="/PeliAsiaticas" element={<PeliAsiaticas />} />
          <Route path="/PeliDocumentales" element={<PeliDocumentales />} />
          <Route path="/PeliLibros" element={<PeliLibros />} />
          <Route path="/Detalle/:id" element={<DetallePelicula />} />
          <Route path="/Contacto" element={<Contacto />} />
          <Route path="/carrito" element={<Carrito />} />
          
          {/* ✅ Rutas de autenticación como páginas completas */}
          {/* Usamos el componente <Login> en la ruta /login */}
          <Route 
            path="/login" 
            element={
              <Login 
                onLoginExitoso={() => navigate("/dashboard")} 
                irARegistro={() => navigate("/registro")}
              />
            } 
          />
          
          {/* Usamos el componente <Registro> en la ruta /registro */}
          <Route 
            path="/registro" 
            element={
              <Registro 
                onRegistroExitoso={() => navigate("/dashboard")} 
                onLoginExitoso={() => navigate("/dashboard")} // Redirigir si loguea con Google
                irALogin={() => navigate("/login")}
              />
            } 
          />

          {/* 🔐 Ruta Protegida: Dashboard */}
          <Route 
            path="/dashboard" 
            element={<RutaProtegida element={<Dashboard />} />} 
          />
          
        </Routes>
      </main>
      
      {/* El Footer puede ir fuera del <Routes> si es estático */}
      <Footer />
    </div>
  );
}