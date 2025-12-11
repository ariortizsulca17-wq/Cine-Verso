import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../Context/AuthContext";

// Nuevo import correcto de tsParticles
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

// Iconos
import { Clapperboard, Star } from "lucide-react";

export default function Bienvenido() {
  const { user, esNuevo, setEsNuevo } = useAuth();

  const [activarParticulas, setActivarParticulas] = useState(false);

  // ================================================
  // ⭐ INICIALIZAR PARTICULAS
  // ================================================
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // ✨ Partículas estilo “palomitas” en vez de confetti
  const opcionesPopcorn = {
    fullScreen: { enable: true, zIndex: 1 },
    particles: {
      number: { value: 0 },
      shape: { type: "circle" },
      color: { value: ["#FFD700", "#FFEF9F"] }, // Amarillo palomita
      opacity: {
        value: { min: 0.5, max: 1 },
      },
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

  // ================================================
  // 🎬 MOSTRAR TARJETA MENOS TIEMPO (2s)
  // ================================================
  useEffect(() => {
    if (esNuevo) {
      const t = setTimeout(() => {
        setEsNuevo(false);
        setActivarParticulas(true); // activa el efecto “palomitas”
      }, 2000);

      return () => clearTimeout(t);
    }
  }, [esNuevo]);

  // Si ya terminó la tarjeta, mostramos partículas de palomitas
  if (!esNuevo) {
    return (
      <>
        {activarParticulas && (
          <Particles id="tsparticles" init={particlesInit} options={opcionesPopcorn} />
        )}
      </>
    );
  }

  // ================================================
  // 🎬 TARJETA DE BIENVENIDA (sin emojis)
  // ================================================
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[999] animate-fadeIn">

      <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-8 rounded-2xl w-[90%] max-w-md text-center animate-scaleIn">

        <div className="w-20 h-20 mx-auto bg-white/50 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pop">
          <Clapperboard size={48} className="text-white" />
        </div>

        <h1 className="text-3xl font-bold text-white drop-shadow mb-2">
          ¡Bienvenido/a {user?.username || user?.displayName || ""}!
        </h1>

        <p className="text-white/90 text-lg flex items-center justify-center gap-2">
          Preparamos tu experiencia en CineVerso
          <Star size={22} className="text-yellow-400" />
        </p>

        <p className="mt-2 text-white/60 text-sm">
          Cargando tu universo de películas...
        </p>
      </div>

      {/* ANIMACIONES */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn { animation: fadeIn .3s ease-out; }

        @keyframes scaleIn {
          from { transform: scale(0.7); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
        .animate-scaleIn { animation: scaleIn .35s ease-out; }

        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-pop { animation: pop .4s ease-out; }
      `}</style>
    </div>
  );
}
