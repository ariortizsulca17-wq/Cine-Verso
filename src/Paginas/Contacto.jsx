// src/pages/Contacto.jsx
import { FormContacto } from "../Componentes/FormContacto";
import { Link } from "react-router-dom";
import { Send, Home, Film } from "lucide-react"; // 💡 CORREGIDO: Añadido Film

export default function Contacto() {
  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 text-gray-100">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
            <Send className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
            <h1 className="text-4xl text-white font-extrabold mb-2 tracking-wide">
              CONTÁCTANOS
            </h1>
            <p className="text-center text-gray-400 text-lg">
              ¿Tienes alguna duda o sugerencia? Completa el formulario y te responderemos pronto.
            </p>
        </div>

        {/* Formulario de contacto */}
        <FormContacto />

      </div>

      {/* Invitación a Seguir Navegando (Estilo más elegante) */}
      <div className="mt-12 text-center p-6 bg-gray-800/50 rounded-xl max-w-2xl mx-auto border border-gray-700 shadow-xl shadow-gray-900/50">
        <h2 className="text-xl font-bold text-white mb-3 flex items-center justify-center gap-2">
          <Home className="w-5 h-5 text-cyan-500" />
          Regresa a la cartelera
        </h2>
        <p className="text-gray-400 mb-4 text-sm">
          Mientras esperamos tu mensaje, te invitamos a ver las últimas novedades del catálogo.
        </p>
        <Link
          to="/"
          className="inline-flex items-center bg-cyan-600 text-gray-900 font-bold py-2.5 px-6 rounded-lg transition-all 
                     hover:bg-cyan-500 shadow-md shadow-cyan-500/50 uppercase text-sm tracking-widest"
        >
          <Film className="w-4 h-4 mr-2" />
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}