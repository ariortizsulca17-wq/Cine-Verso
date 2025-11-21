import React from 'react';
import { Link } from 'react-router-dom'; // Para el enlace de contacto
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    // Fondo oscuro con un sutil borde turquesa superior
    <footer className="bg-[#0B1014] text-gray-400 mt-12 p-8 md:p-12 border-t border-t-[#00C8D7]/30 text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* // -------------------------------------------------------------------
        // --- COLUMNA 1: LOGO Y FRASE --- 
        // -------------------------------------------------------------------
        */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-3xl font-extrabold text-[#00C8D7] tracking-wider">
            CINEVERSO
          </h2>
          <p className="text-xs max-w-xs leading-relaxed">
            Explora las mejores historias de la pantalla grande. Gracias por visitarnos.
          </p>
        </div>

        {/* // -------------------------------------------------------------------
        // --- COLUMNA 2: CONTACTO (ENLACES A LA PÁGINA DE CONTACTO) --- 
        // -------------------------------------------------------------------
        */}
        <div className="md:col-span-1 space-y-3">
          <h3 className="text-lg font-bold mb-3 text-white">
            Contacto
          </h3>
          <div className="space-y-2">
            {/* Redirige a /contacto al hacer clic */}
            <Link to="/contacto" className="block hover:text-[#00C8D7] transition-colors cursor-pointer">
              📞 +51 987 654 321
            </Link>
            {/* Redirige a /contacto al hacer clic */}
            <Link to="/contacto" className="block hover:text-[#00C8D7] transition-colors cursor-pointer">
              📧 info@cineverso.com
            </Link>
            <p className="text-gray-500 pt-2">
              Creado en 2025
            </p>
          </div>
        </div>

        {/* // -------------------------------------------------------------------
        // --- COLUMNA 3: REDES SOCIALES y COPYRIGHT --- 
        // -------------------------------------------------------------------
        */}
        <div className="md:col-span-1 space-y-3">
            <h3 className="text-lg font-bold mb-3 text-white">
                Síguenos
            </h3>
            <div className="flex space-x-5">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00C8D7] transition-colors text-2xl">
                <FaFacebook />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00C8D7] transition-colors text-2xl">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#00C8D7] transition-colors text-2xl">
                <FaTiktok />
              </a>
            </div>
            
            <p className="pt-4 text-xs text-gray-500">
                &copy; {currentYear} CINEVERSO.
            </p>
        </div>


        {/* // -------------------------------------------------------------------
        // --- COLUMNA 4: ANUNCIO MANGA VERSO (Con Efecto Glow) --- 
        // -------------------------------------------------------------------
        */}
        <div className="md:col-span-1">
          {/* Aplicamos una sombra turquesa para el efecto 'glow' */}
          <div className="p-4 rounded-lg border-2 border-[#00C8D7] bg-[#1A1F25] shadow-lg shadow-[#00C8D7]/40 transition-shadow hover:shadow-[#00C8D7]/60">
            <h3 className="text-lg font-extrabold text-[#00C8D7] mb-1">
              ¡Próximamente! 🚀
            </h3>
            <p className="text-gray-200 text-xs">
              MANGAVERSO. Tu portal de anime y manga. ¡Lanzamiento en 2026!
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}