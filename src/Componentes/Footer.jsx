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
import { useTheme } from '../Context/ThemeContext'; // Ajusta la ruta

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const bgColor = theme === 'dark' ? 'bg-[#0B1014]' : 'bg-gray-100';
  const textColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-800';
  const borderColor = theme === 'dark' ? 'border-t-[#00C8D7]/40' : 'border-t-gray-300';
  const cardBg = theme === 'dark' ? 'bg-[#1A1F25]' : 'bg-gray-200';
  const cardBorder = theme === 'dark' ? 'border-[#00C8D7]/60' : 'border-gray-400';
  const accentColor = '#00C8D7';

  return (
    <footer className={`${bgColor} ${textColor} mt-16 p-8 md:p-12 border-t ${borderColor} text-sm`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Columna 1: Logo y frase */}
        <div className="space-y-4">
          <h2 className={`text-4xl font-extrabold tracking-widest leading-none`} style={{color: accentColor}}>
            CINEVERSO
          </h2>
          <p className={`text-xs max-w-xs leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Explora las mejores historias de la pantalla grande. Gracias por visitarnos.
          </p>
          <div className="pt-4 text-xs flex items-center space-x-1" style={{color: theme === 'dark' ? '#888' : '#555'}}>
            <FaRegCopyright className="text-xs" />
            <span>{currentYear} CINEVERSO.</span>
          </div>
        </div>

        {/* Columna 2: Contacto */}
        <div className="space-y-3">
          <h3 className={`text-xl font-bold mb-4 uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Contáctanos
          </h3>
          <div className="space-y-3">
            <Link 
              to="/contacto" 
              className={`flex items-center space-x-3 text-base hover:text-[#00C8D7] transition-colors group`}
            >
              <FaPhoneAlt className="text-sm" style={{color: accentColor}} />
              <span>+51 987 654 321</span>
            </Link>
            <Link 
              to="/contacto" 
              className={`flex items-center space-x-3 text-base hover:text-[#00C8D7] transition-colors group`}
            >
              <FaEnvelope className="text-sm" style={{color: accentColor}} />
              <span>info@cineverso.com</span>
            </Link>
          </div>
        </div>

        {/* Columna 3: Redes sociales */}
        <div className="space-y-4">
          <h3 className={`text-xl font-bold mb-4 uppercase tracking-wider ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Síguenos
          </h3>
          <div className="flex space-x-6">
            {[FaFacebook, FaInstagram, FaTiktok].map((Icon, i) => (
              <a 
                key={i}
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`hover:text-[#00C8D7] transition-transform duration-300 transform hover:scale-110 text-3xl`}
                style={{color: theme === 'dark' ? '#888' : '#555'}}
                aria-label="Red Social"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {/* Columna 4: Anuncio */}
        <div>
          <div className={`p-5 rounded-xl border ${cardBorder} ${cardBg} shadow-xl shadow-[#00C8D7]/30 transition-all duration-500 hover:shadow-[#00C8D7]/70 hover:scale-[1.02]`}>
            <h3 className="text-xl font-extrabold mb-2 flex items-center space-x-2" style={{color: accentColor}}>
              <FaRocket className="text-2xl" />
              <span>¡Próximamente!</span>
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
              MANGAVERSO. Tu portal de anime y manga. ¡Lanzamiento en 2026!
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
