import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

// =============================
// 💾 DATA
// =============================
const estrenos = [
    {
        id: 1,
        titulo: "Five Nights At Freddy's 2",
        portada:
            "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002582?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/LoAAcplDODU?si=SyY-u06WQaPpywqb",
        descripcion:
            "Ha pasado un año desde la pesadilla sobrenatural en Freddy Fazbear’s Pizza. Las historias sobre lo que ocurrió allí se han vuelto una leyenda local, que han inspirado al primer Fazfest del pueblo. El ex guardia de seguridad Mike (Josh Hutcherson) y la oficial de policía Vanessa (Elizabeth Lail) han mantenido en secreto la verdad sobre el destino de sus amigos animatrónicos a Abby (Piper Rubio), la hermana de 11 años de Mike. Pero cuando Abby se escapa para reencontrarse con Freddy, Bonnie, Chica y Foxy, desatará una aterradora cadena de eventos que revelará oscuros secretos sobre el verdadero origen de Freddy’s y despertará un horror olvidado que llevaba décadas oculto.",
        fecha: "4 de Diciembre 2025",
        lugar: "Cineplanet - Estreno mundial",
    },

    {
        id: 2,
        titulo: "Zootopia 2",
        portada:
            "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002477?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/4_KaABhCPPk?si=vpymVFbT3KQT5nPF",
        descripcion:
            "En ZOOTOPIA 2, los ahora inseparables detectives Judy Hopps y Nick Wilde se enfrentan a su misión más salvaje: un misterioso reptil ha llegado a la ciudad y está poniendo patas arriba a toda la metrópoli animal. Para atraparlo, la dupla deberá infiltrarse en rincones nunca antes vistos, desde barrios extravagantes hasta zonas llenas de sorpresas. En esta nueva aventura, la complicidad entre Judy y Nick será puesta a prueba como nunca… y solo juntos podrán evitar que el caos se apodere de la ciudad.",
        disponible: "REGULAR, 3D, 2D, PRIME, XTREME",
        formato: "IMAX disponible",
    },

    {
        id: 3,
        titulo: "No Alimentes a los Niños",
        portada:
            "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002670?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/TIlXmSeka84?si=q63AjifbgSc2l53z",
        descripcion:
            "Tras un virus que mata a la mayoría de los adultos, unos niños huérfanos viajan al sur, donde se enfrentan a una mujer psicópata que oculta un oscuro secreto.",
        fecha: "Estreno confirmado para este mes",
    },

    {
        id: 4,
        titulo: "Wicked",
        portada:
            "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002581?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/-yTj17U-rvw?si=bwux7vZaIzFh8aQa",
        descripcion:
            "Tras la primera parte de esta aventura, Elphaba enfrenta su destino como Bruja Mala del Oeste, mientras Glinda es nombrada defensora de Oz. Ambas deben tomar decisiones cruciales que marcarán sus futuros.",
        lugar: "Cines en todo el país",
    },

    {
        id: 5,
        titulo: "La Ultima Posesion",
        portada:
            "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002688?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/m7cBleDtf2M?si=o2h5e10b_fAXwDJU",
        descripcion:
            "Un cirujano muy famoso pierde trágicamente a su hija durante un trasplante de corazón que él mismo intenta realizar. Consumido por la culpa y el dolor, busca cualquier método para devolverle la vida, incluso practicando un antiguo exorcismo que parece fallar. Sin embargo, durante el funeral, ella vuelve a levantarse, sin que él note de inmediato que no es su hija quien ha regresado, sino un demonio.",
        fecha: "Estreno confirmado para este mes",
        disponible: "REGULAR, 2D",
    },

    {
        id: 6,
        titulo: "Nada es lo que Parece 3",
        portada:
            "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002476?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/2dGUyKN1Zxk?si=Tsof08mBgjd1YH8W",
        descripcion:
            "Los Cuatro Jinetes están de regreso… y no vienen solos. Una nueva generación de ilusionistas se une al equipo para llevar la magia al siguiente nivel. Más giros, más trampas, más espectáculo. Nada es lo que parece... y esta vez, menos que nunca.",
        fecha: "13 de Noviembre 2025",
        disponible: "REGULAR, 2D, PRIME",
    },
    {
        id: 7,
        titulo: "Un Buen Ladrón",
        portada:"https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002661?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/ipKgT9bH83U?si=NPSXw7S44GpVMbXd",
        descripcion:
            "Inspirada en una historia real, Roofman presenta a Jeffrey Manchester (Channing Tatum), un carismático veterano del ejército que lleva una vida tan arriesgada como fascinante. Todo cambia cuando conoce a Leigh Wainscott (Kirsten Dunst), quien despierta en él sentimientos que pondrán a prueba su ingenio y su secreto mejor guardado. Una historia de amor, redención y segundas oportunidades, contada con suspenso y un toque de humor.",
        fecha: "27 de noviembre de 2025",
        disponible: "REGULAR, 2D",
    },
];
// ======================================
// 🍿 EFECTO PALOMITAS — 2 SEGUNDOS
// ======================================
const lanzarPalomitas = () => {
    const end = Date.now() + 2000;

    (function frame() {
        confetti({
            particleCount: 4,
            startVelocity: 12,
            spread: 360,
            ticks: 220,
            shapes: ["circle"],
            scalar: 1.3,
            origin: { x: Math.random(), y: -0.1 },
            colors: ["#d7ecff", "#a7d8ff", "#cfeaff"],
        });

        if (Date.now() < end) requestAnimationFrame(frame);
    })();
};

// ======================================
// ⭐ COMPONENTE PRINCIPAL
// ======================================
export default function Estreno() {
    const [peliculaActiva, setPeliculaActiva] = useState(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const star = document.createElement("div");
            star.className = "estrella";
            star.style.left = Math.random() * 100 + "vw";
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 4000);
        }, 300);

        return () => clearInterval(interval);
    }, []);

    const abrirModal = (peli) => {
        setPeliculaActiva(peli);
        lanzarPalomitas();
    };

    return (
        <>
            <div className={`estrenos-container ${peliculaActiva ? "modal-abierto" : ""}`}>
                <h1 className="titulo">Estrenos del Momento</h1>

                <div className="carrusel">
                    {estrenos.map((peli) => (
                        <div
                            key={peli.id}
                            className="card"
                            onClick={() => abrirModal(peli)}
                        >
                            <span className="etiqueta-estreno">Estreno</span>

                            <img src={peli.portada} alt={peli.titulo} />
                            <div className="card-info">
                                <h3>{peli.titulo}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                {peliculaActiva && (
                    <div
                        className="modal-overlay"
                        onClick={() => setPeliculaActiva(null)}
                    >
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <iframe
                                src={peliculaActiva.trailer}
                                allowFullScreen
                                title="Trailer"
                            ></iframe>

                            <h2>{peliculaActiva.titulo}</h2>
                            <p>{peliculaActiva.descripcion}</p>

                            {peliculaActiva.fecha && (
                                <p>
                                    <strong>📅 Fecha:</strong> {peliculaActiva.fecha}
                                </p>
                            )}

                            {peliculaActiva.lugar && (
                                <p>
                                    <strong>📍 Lugar:</strong> {peliculaActiva.lugar}
                                </p>
                            )}

                            {peliculaActiva.disponible && (
                                <p>
                                    <strong>🎬 Disponible en:</strong> {peliculaActiva.disponible}
                                </p>
                            )}

                            {peliculaActiva.formato && (
                                <p>
                                    <strong>🎥 Formato:</strong> {peliculaActiva.formato}
                                </p>
                            )}

                            <button
                                className="cerrar"
                                onClick={() => setPeliculaActiva(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
/* 💥 OCULTAR LA ETIQUETA AUTOMÁTICAMENTE CUANDO HAY MODAL */
.modal-abierto .etiqueta-estreno {
  display: none !important;
}

/* ⭐ ETIQUETA ESTRENO */
.etiqueta-estreno {
  position: absolute;
  top: 15px;
  left: -40px;
  background: #ec4899;
  padding: 6px 40px;
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  transform: rotate(-45deg);
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  pointer-events: none;
  z-index: 10;
  animation: pulso 1.5s infinite ease-in-out, brillo 2.5s infinite alternate;
}

@keyframes pulso {
  0% { transform: rotate(-45deg) scale(1); }
  50% { transform: rotate(-45deg) scale(1.1); }
  100% { transform: rotate(-45deg) scale(1); }
}

@keyframes brillo {
  0% { box-shadow: 0 0 8px rgba(255,255,255,0.3); }
  100% { box-shadow: 0 0 20px rgba(255,255,255,0.8); }
}

body {
  overflow-x: hidden;
}

.estrenos-container {
  padding: 30px;
  background: #000;
  color: white;
  min-height: 100vh;
}

.titulo {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #3b82f6;
  text-shadow: 0 0 25px #60a5fa;
}

/* 🔵 AQUÍ SE VUELVE GRID RESPONSIVO (no eliminé nada, solo reemplazado flex→grid) */
.carrusel {
  display: grid;
  gap: 20px;
  padding: 10px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

/* 📱 Ajuste opcional para pantallas pequeñas */
@media (max-width: 500px) {
  .card {
    min-width: 150px;
    height: 230px;
  }
}

.card {
  position: relative;
  min-width: 180px;
  height: 270px;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
  box-shadow: 0 0 18px rgba(59,130,246,0.3);
}

.card:hover {
  transform: scale(1.08);
  box-shadow: 0 0 35px #3b82f6;
}

.card-info {
  position: absolute;
  bottom: 0;
  padding: 10px;
  background: linear-gradient(transparent, black);
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,20,0.85);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 700px;
  background: #0d0f18;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 40px #3b82f6;
  margin-top: 80px;
}

.modal iframe {
  width: 99%;
  height: 250px;
  border-radius: 10px;
}

.modal p {
  font-size: 0.85rem;
  line-height: 1.3;
}

.cerrar {
  margin-top: 15px;
  padding: 10px;
  background: #3b82f6;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
}

.estrella {
  position: fixed;
  top: -10px;
  width: 5px;
  height: 5px;
  background: #93c5fd;
  border-radius: 50%;
  animation: caer 4s linear forwards;
}

@keyframes caer {
  to {
    transform: translateY(100vh);
    opacity: 0;
  }
}
`}</style>

</>);
}