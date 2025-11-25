import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaRocket, 
  FaRegCopyright 
} from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Fondo oscuro con un sutil borde turquesa superior
    // Se mantiene la misma clase de fondo y estilo
    <footer className="bg-[#0B1014] text-gray-400 mt-16 p-8 md:p-12 border-t border-t-[#00C8D7]/40 text-sm">
      
      {/* 💥 CAMBIO CLAVE AQUÍ: grid-cols-2 en MD y grid-cols-4 en LG (4 columnas iguales) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* // -------------------------------------------------------------------
        // --- COLUMNA 1: LOGO Y FRASE (Ocupa 1/4) --- 
        // ------------------------------------------------------------------- */}
        {/* Se elimina 'lg:col-span-1' para que ocupe la columna por defecto */}
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold text-[#00C8D7] tracking-widest leading-none">
            CINEVERSO
          </h2>
          <p className="text-xs max-w-xs leading-relaxed text-gray-300">
            Explora las mejores historias de la pantalla grande. Gracias por visitarnos.
          </p>
          
          <div className="pt-4 text-xs text-gray-500 flex items-center space-x-1">
            <FaRegCopyright className="text-xs" />
            <span>{currentYear} CINEVERSO.</span>
          </div>
        </div>

        {/* // -------------------------------------------------------------------
        // --- COLUMNA 2: CONTACTO (Ocupa 1/4) --- 
        // ------------------------------------------------------------------- */}
        {/* Se elimina 'lg:col-span-1' */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-wider">
            Contáctanos
          </h3>
          <div className="space-y-3">
            <Link 
              to="/contacto" 
              className="flex items-center space-x-3 text-base hover:text-[#00C8D7] transition-colors group"
            >
              <FaPhoneAlt className="text-sm text-[#00C8D7] group-hover:text-white" />
              <span>+51 987 654 321</span>
            </Link>
            
            <Link 
              to="/contacto" 
              className="flex items-center space-x-3 text-base hover:text-[#00C8D7] transition-colors group"
            >
              <FaEnvelope className="text-sm text-[#00C8D7] group-hover:text-white" />
              <span>info@cineverso.com</span>
            </Link>
          </div>
        </div>

        {/* // -------------------------------------------------------------------
        // --- COLUMNA 3: REDES SOCIALES (Ocupa 1/4) --- 
        // ------------------------------------------------------------------- */}
        {/* Se elimina 'lg:col-span-1' */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-wider">
            Síguenos
          </h3>
          <div className="flex space-x-6">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-[#00C8D7] transition-transform duration-300 transform hover:scale-110 text-3xl"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-[#00C8D7] transition-transform duration-300 transform hover:scale-110 text-3xl"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-500 hover:text-[#00C8D7] transition-transform duration-300 transform hover:scale-110 text-3xl"
              aria-label="TikTok"
            >
              <FaTiktok />
            </a>
          </div>
        </div>


        {/* // -------------------------------------------------------------------
        // --- COLUMNA 4: ANUNCIO MANGA VERSO (Ocupa 1/4) --- 
        // ------------------------------------------------------------------- */}
        {/* Se elimina 'lg:col-span-1' */}
        <div className="">
          <div className="p-5 rounded-xl border border-[#00C8D7]/60 bg-[#1A1F25] shadow-xl shadow-[#00C8D7]/30 transition-all duration-500 hover:shadow-[#00C8D7]/70 hover:scale-[1.02]">
            <h3 className="text-xl font-extrabold text-[#00C8D7] mb-2 flex items-center space-x-2">
              <FaRocket className="text-2xl" />
              <span>¡Próximamente!</span>
            </h3>
            <p className="text-gray-300 text-sm">
              MANGAVERSO. Tu portal de anime y manga. ¡Lanzamiento en 2026!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}