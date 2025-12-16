import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext"; // 🔑 Import theme
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Clapperboard, Star } from "lucide-react";

export default function Bienvenido() {
  const { user, esNuevo, setEsNuevo } = useAuth();
  const { theme } = useTheme(); // 🔑 Tema
  const [activarParticulas, setActivarParticulas] = useState(false);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const opcionesPopcorn = {
    fullScreen: { enable: true, zIndex: 1 },
    particles: {
      number: { value: 0 },
      shape: { type: "circle" },
      color: { value: ["#FFD700", "#FFEF9F"] },
      opacity: { value: { min: 0.5, max: 1 } },
      size: { value: { min: 4, max: 9 } },
      move: {
        enable: true,
        speed: { min: 6, max: 12 },
        gravity: { enable: true, acceleration: 3 },
        decay: 0.11,
        outModes: { default: "destroy" }
      }
    },
    emitters: {
      direction: "none",
      rate: { delay: 0.12, quantity: 12 },
      life: { duration: 1.8, count: 1 },
      size: { width: 0, height: 0 }
    }
  };

  useEffect(() => {
    if (esNuevo) {
      const t = setTimeout(() => {
        setEsNuevo(false);
        setActivarParticulas(true);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [esNuevo]);

  if (!esNuevo) {
    return activarParticulas ? (
      <Particles id="tsparticles" init={particlesInit} options={opcionesPopcorn} />
    ) : null;
  }

  const bgCard = theme === "dark" ? "bg-gray-900/60 border-gray-700" : "bg-white/20 border-white/30";
  const textMain = theme === "dark" ? "text-white" : "text-white"; // puedes ajustar colores para light

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md z-[999] animate-fadeIn bg-black/60">
      <div className={`relative p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center animate-scaleIn ${bgCard} border`}>
        <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-lg animate-pop bg-white/50">
          <Clapperboard size={48} className="text-white" />
        </div>

        <h1 className={`text-3xl font-bold drop-shadow mb-2 ${textMain}`}>
          ¡Bienvenido/a {user?.username || user?.displayName || ""}!
        </h1>

        <p className="text-white/90 text-lg flex items-center justify-center gap-2">
          Preparamos tu experiencia en CineVerso
          <Star size={22} className="text-yellow-400" />
        </p>

        <p className="mt-2 text-white/60 text-sm">Cargando tu universo de películas...</p>

        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          .animate-fadeIn { animation: fadeIn .3s ease-out; }
          @keyframes scaleIn { from { transform: scale(0.7); opacity: 0 } to { transform: scale(1); opacity: 1 } }
          .animate-scaleIn { animation: scaleIn .35s ease-out; }
          @keyframes pop { 0% { transform: scale(0.5); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
          .animate-pop { animation: pop .4s ease-out; }
        `}</style>
      </div>
    </div>
  );
}
