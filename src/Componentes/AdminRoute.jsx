// src/Componentes/AdminRoute/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function ProtectedRoute({ children, rolRequerido }) {
  const { user, datosUsuario, loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center text-xl text-cyan-600">Cargando...</div>;
  }

  // Si no está logueado
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si tiene rol incorrecto
  if (rolRequerido && datosUsuario?.rol?.toLowerCase() !== rolRequerido.toLowerCase()) {
    return <Navigate to="/no-autorizado" replace />;
  }

  return children;
}
