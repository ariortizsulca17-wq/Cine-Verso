// src/pages/Contacto.jsx
import { FormContacto } from "../Componentes/FormContacto";
import { Link } from "react-router-dom";
import { Send, Home, Film } from "lucide-react";
import { useTheme } from "../Context/ThemeContext"; // 🔑 Importamos contexto

export default function Contacto() {
  const { theme } = useTheme();

  // Clases condicionales según tema
  const bgPage = theme === "dark" ? "bg-gray-900" : "bg-gray-100";
  const textMain = theme === "dark" ? "text-white" : "text-gray-900";
  const textSub = theme === "dark" ? "text-gray-400" : "text-gray-700";
  const sectionBg = theme === "dark" ? "bg-gray-800/50" : "bg-white/50";
  const sectionBorder = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const sectionShadow = theme === "dark" ? "shadow-gray-900/50" : "shadow-gray-400/30";
  const btnBg = theme === "dark" ? "bg-cyan-600" : "bg-cyan-500";
  const btnText = theme === "dark" ? "text-gray-900" : "text-white";
  const btnHover = theme === "dark" ? "hover:bg-cyan-500" : "hover:bg-cyan-400";

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${bgPage} ${textMain}`}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <Send className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
          <h1 className={`text-4xl font-extrabold mb-2 tracking-wide ${textMain}`}>
            CONTÁCTANOS
          </h1>
          <p className={`text-center text-lg ${textSub}`}>
            ¿Tienes alguna duda o sugerencia? Completa el formulario y te responderemos pronto.
          </p>
        </div>

        {/* Formulario de contacto */}
        <FormContacto />

      </div>

      {/* Invitación a Seguir Navegando */}
      <div className={`mt-12 text-center p-6 rounded-xl max-w-2xl mx-auto border ${sectionBorder} ${sectionBg} shadow-xl ${sectionShadow}`}>
        <h2 className={`text-xl font-bold mb-3 flex items-center justify-center gap-2 ${textMain}`}>
          <Home className="w-5 h-5 text-cyan-500" />
          Regresa a la cartelera
        </h2>
        <p className={`mb-4 text-sm ${textSub}`}>
          Mientras esperamos tu mensaje, te invitamos a ver las últimas novedades del catálogo.
        </p>
        <Link
          to="/"
          className={`inline-flex items-center ${btnBg} ${btnText} font-bold py-2.5 px-6 rounded-lg transition-all ${btnHover} shadow-md shadow-cyan-500/50 uppercase text-sm tracking-widest`}
        >
          <Film className="w-4 h-4 mr-2" />
          Explorar Catálogo
        </Link>
      </div>
    </div>
  );
}
