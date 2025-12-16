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
import { useTheme } from '../Context/ThemeContext';

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
    <footer
      className={`${bgColor} ${textColor} mt-16 border-t ${borderColor} text-sm`}
    >
      <div className="max-w-7xl mx-auto px-6 py-10 sm:px-8 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">

          {/* Columna 1 */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-widest"
              style={{ color: accentColor }}
            >
              CINEVERSO
            </h2>

            <p
              className={`text-xs sm:text-sm max-w-xs leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              Explora las mejores historias de la pantalla grande. Gracias por visitarnos.
            </p>

            <div
              className="pt-2 text-xs flex items-center space-x-1"
              style={{ color: theme === 'dark' ? '#888' : '#555' }}
            >
              <FaRegCopyright />
              <span>{currentYear} CINEVERSO.</span>
            </div>
          </div>

          {/* Columna 2 */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h3
              className={`text-lg sm:text-xl font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Contáctanos
            </h3>

            <div className="space-y-3">
              <Link
                to="/contacto"
                className="flex items-center justify-center sm:justify-start gap-3 hover:text-[#00C8D7] transition-colors"
              >
                <FaPhoneAlt style={{ color: accentColor }} />
                <span>+51 987 654 321</span>
              </Link>

              <Link
                to="/contacto"
                className="flex items-center justify-center sm:justify-start gap-3 hover:text-[#00C8D7] transition-colors"
              >
                <FaEnvelope style={{ color: accentColor }} />
                <span>info@cineverso.com</span>
              </Link>
            </div>
          </div>

          {/* Columna 3 */}
          <div className="space-y-4 flex flex-col items-center sm:items-start">
            <h3
              className={`text-lg sm:text-xl font-bold uppercase tracking-wider ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Síguenos
            </h3>

            <div className="flex justify-center sm:justify-start space-x-6">
              {[FaFacebook, FaInstagram, FaTiktok].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-300 hover:scale-110 hover:text-[#00C8D7] text-2xl sm:text-3xl"
                  style={{ color: theme === 'dark' ? '#888' : '#555' }}
                  aria-label="Red social"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Columna 4 */}
          <div className="flex justify-center sm:justify-start">
            <div
              className={`w-full max-w-xs p-5 rounded-xl border ${cardBorder} ${cardBg} shadow-xl shadow-[#00C8D7]/30 transition-all duration-500 hover:shadow-[#00C8D7]/70 hover:scale-[1.02]`}
            >
              <h3
                className="text-lg sm:text-xl font-extrabold mb-2 flex items-center gap-2"
                style={{ color: accentColor }}
              >
                <FaRocket />
                ¡Próximamente!
              </h3>

              <p
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                MANGAVERSO. Tu portal de anime y manga. ¡Lanzamiento en 2026!
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
