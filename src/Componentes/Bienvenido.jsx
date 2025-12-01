import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import { useAuth } from "../Context/AuthContext";

// Nuevo import correcto de tsParticles
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function Bienvenido() {
  const { user, esNuevo, setEsNuevo } = useAuth();

  const [mostrarConfeti, setMostrarConfeti] = useState(false);
  const [activarEstrellas, setActivarEstrellas] = useState(false);

  // ================================================
  // ⭐ INICIALIZAR PARTICULAS
  // ================================================
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Opciones del efecto estrellas cine
  const opcionesEstrellas = {
    fullScreen: { enable: true, zIndex: 1 },
    particles: {
      number: { value: 0 },
      shape: { type: "star" },
      color: { value: ["#FFD700", "#FFF8DC", "#FFB300"] },
      opacity: {
        value: { min: 0.3, max: 1 },
        animation: { enable: true, speed: 1.5 }
      },
      size: { value: { min: 4, max: 8 } },
      move: {
        enable: true,
        gravity: { enable: true, acceleration: 4 },
        speed: { min: 5, max: 12 },
        decay: 0.08,
        outModes: { default: "destroy" }
      },
      rotate: {
        value: { min: 0, max: 360 },
        direction: "random",
        move: true,
        animation: { enable: true, speed: 40 }
      }
    },
    emitters: {
      direction: "none",
      rate: { delay: 0.1, quantity: 18 },
      life: { duration: 3, count: 1 },
      size: { width: 0, height: 0 }
    }
  };

  // ================================================
  // 🎬 MOSTRAR TARJETA 3 SEGUNDOS
  // ================================================
  useEffect(() => {
    if (esNuevo) {
      const t = setTimeout(() => {
        setEsNuevo(false);
        setMostrarConfeti(true);
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [esNuevo]);

  // ================================================
  // 🍿 CONFETI DE PALOMITAS (5s)
  // ================================================
  useEffect(() => {
    if (mostrarConfeti) {
      const duration = 5000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 6,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FFD700", "#FFF5C3"]
        });

        confetti({
          particleCount: 6,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FFD700", "#FFF5C3"]
        });

        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      const t = setTimeout(() => {
        setActivarEstrellas(true); // activa tsParticles ✨
      }, 5000);

      return () => clearTimeout(t);
    }
  }, [mostrarConfeti]);

  // Si ya terminó la tarjeta, mostramos partículas
  if (!esNuevo) {
    return (
      <>
        {activarEstrellas && (
          <Particles id="tsparticles" init={particlesInit} options={opcionesEstrellas} />
        )}
      </>
    );
  }

  // ================================================
  // 🎉 TARJETA DE BIENVENIDA
  // ================================================
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-[999] animate-fadeIn">

      <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl p-8 rounded-2xl w-[90%] max-w-md text-center animate-scaleIn">

        <div className="w-20 h-20 mx-auto bg-white/50 rounded-full flex items-center justify-center mb-4 shadow-lg animate-pop">
          <span className="text-4xl">🎬</span>
        </div>

        <h1 className="text-3xl font-bold text-white drop-shadow mb-2">
          ¡Bienvenido/a {user?.username || user?.displayName || ""}!
        </h1>

        <p className="text-white/90 text-lg">
          Preparamos tu experiencia en CineVerso ⭐🎥
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
        .animate-fadeIn { animation: fadeIn .4s ease-out; }

        @keyframes scaleIn {
          from { transform: scale(0.7); opacity: 0 }
          to { transform: scale(1); opacity: 1 }
        }
        .animate-scaleIn { animation: scaleIn .5s ease-out; }

        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0 }
          100% { transform: scale(1); opacity: 1 }
        }
        .animate-pop { animation: pop .5s ease-out; }
      `}</style>
    </div>
  );
}