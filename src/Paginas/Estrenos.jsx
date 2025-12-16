import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { HiCalendar, HiFilm, HiBell, HiCheckCircle } from "react-icons/hi";


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
        portada: "https://cdn.apis.cineplanet.com.pe/CDN/media/entity/get/FilmPosterGraphic/HO00002661?referenceScheme=HeadOffice&allowPlaceHolder=true",
        trailer: "https://www.youtube.com/embed/ipKgT9bH83U?si=NPSXw7S44GpVMbXd",
        descripcion:
            "Inspirada en una historia real, Roofman presenta a Jeffrey Manchester (Channing Tatum), un carismático veterano del ejército que lleva una vida tan arriesgada como fascinante. Todo cambia cuando conoce a Leigh Wainscott (Kirsten Dunst), quien despierta en él sentimientos que pondrán a prueba su ingenio y su secreto mejor guardado. Una historia de amor, redención y segundas oportunidades, contada con suspenso y un toque de humor.",
        fecha: "27 de noviembre de 2025",
        disponible: "REGULAR, 2D",
    },
];



// =============================
// ⭐ COMPONENTE POPCORN
// =============================
function PopcornBackground() {
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {[...Array(14)].map((_, i) => (
                <span
                    key={i}
                    className="absolute bottom-[-20px] animate-popcorn opacity-40"
                    style={{
                        left: `${Math.random() * 100}%`,
                        fontSize: `${Math.random() * 14 + 14}px`,
                        animationDelay: `${Math.random() * 8}s`,
                        animationDuration: `${Math.random() * 14 + 14}s`,
                    }}
                >
                    🍿
                </span>
            ))}
        </div>
    );
}

// =============================
// ⭐ COMPONENTE PRINCIPAL
// =============================
export default function Estrenos() {
    const [activa, setActiva] = useState(null);
    const [notificada, setNotificada] = useState(false);
    const estrenoDestacado = estrenos[0];

    useEffect(() => {
        document.body.style.overflow = activa ? "hidden" : "auto";
        return () => (document.body.style.overflow = "auto");
    }, [activa]);

    // Guardar notificación en Firestore
    const handleNotificar = async (peli) => {
        await addDoc(collection(db, "estrenos"), {
            peliculaId: peli.id,
            titulo: peli.titulo,
            createdAt: serverTimestamp(),
        });
        setNotificada(true);
    };

    return (
        <section className="relative min-h-screen bg-slate-950 text-slate-100 px-6 py-20 overflow-hidden">
            <PopcornBackground />

            {/* HERO */}
            <header className="relative text-center mb-20">
                <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 drop-shadow-[0_0_40px_rgba(59,130,246,0.9)]">
                    Estrenos en Cartelera
                </h1>
                <p className="mt-6 text-slate-400 max-w-2xl mx-auto">
                    Vive primero las historias que están por llegar a la pantalla grande
                </p>
            </header>

            {/* DESTACADO */}
            <div className="max-w-6xl mx-auto mb-24 relative rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-500 animate-pulseGlow">
                <img
                    src={estrenoDestacado.portada}
                    alt={estrenoDestacado.titulo}
                    className="w-full h-[520px] md:h-[600px] object-cover rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-end p-10">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-pink-500 font-bold tracking-widest mb-2"
                    >
                        ⭐ ESTRENO DESTACADO
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl font-extrabold mb-4"
                    >
                        {estrenoDestacado.titulo}
                    </motion.h2>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        onClick={() => setActiva(estrenoDestacado)}
                        className="w-fit rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-500 transition"
                    >
                        Ver detalles del estreno
                    </motion.button>
                </div>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-12 max-w-7xl mx-auto">
                {estrenos.map((peli) => (
                    <article
                        key={peli.id}
                        onClick={() => setActiva(peli)}
                        className="group relative rounded-3xl overflow-hidden bg-black shadow-2xl cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-blue-500/40"
                    >
                        <span className="absolute top-5 left-5 z-10 rounded-full bg-pink-600 px-4 py-1 text-xs font-bold">
                            ESTRENO
                        </span>

                        <img
                            src={peli.portada}
                            className="h-[460px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-6">
                            <h3 className="text-xl font-bold mb-3">{peli.titulo}</h3>
                            <button className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold">
                                Ver detalles del estreno
                            </button>
                        </div>
                    </article>
                ))}
            </div>

            {/* MODAL */}
            <AnimatePresence>
                {activa && (
                    <motion.div
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => {
                            setActiva(null);
                            setNotificada(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.85, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.85, y: 40, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="relative bg-slate-900 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* X */}
                            <button
                                onClick={() => {
                                    setActiva(null);
                                    setNotificada(false);
                                }}
                                className="absolute top-4 right-4 text-2xl text-white/70 hover:text-white z-20"
                            >
                                ✕
                            </button>

                            <div className="overflow-y-auto p-8 max-h-[90vh] relative">
                                <iframe
                                    src={activa.trailer}
                                    title="Trailer"
                                    allowFullScreen
                                    className="w-full h-[260px] md:h-[420px] rounded-2xl mb-6"
                                />

                                <h2 className="text-4xl font-extrabold mb-4">{activa.titulo}</h2>
                                <p className="text-slate-300 mb-6">{activa.descripcion}</p>

                                {/* FECHA Y FORMATO */}
                                <div className="flex flex-wrap gap-6 text-sm text-slate-400 mb-6">
                                    {activa.fecha && (
                                        <span className="flex items-center gap-1">
                                            <HiCalendar className="w-5 h-5 text-blue-400" />
                                            Estreno: {activa.fecha}
                                        </span>
                                    )}
                                    {activa.formato && (
                                        <span className="flex items-center gap-1">
                                            <HiFilm className="w-5 h-5 text-purple-400" />
                                            {activa.formato}
                                        </span>
                                    )}
                                </div>

                                {/* INVITACIÓN */}
                                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-6 mb-6">
                                    <p className="text-base font-semibold">
                                        Mira esta película en estreno en Cineverso. Entérate cuando esté disponible.
                                    </p>
                                </div>

                                {/* NOTIFICACIÓN */}
                                <button
                                    onClick={() => handleNotificar(activa)}
                                    className={`w-full rounded-2xl py-3 font-bold transition flex items-center justify-center gap-2 ${notificada
                                        ? "bg-green-600"
                                        : "bg-pink-600 hover:bg-pink-500"
                                        }`}
                                >
                                    {notificada ? (
                                        <>
                                            <HiCheckCircle className="w-5 h-5" />
                                            Te notificaremos cuando esté disponible
                                        </>
                                    ) : (
                                        <>
                                            <HiBell className="w-5 h-5" />
                                            Notificarme cuando se estrene
                                        </>
                                    )}
                                </button>

                                {/* MENSAJE CONFIRMACIÓN */}
                                {notificada && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 text-center text-green-400 text-sm flex items-center justify-center gap-1"
                                    >
                                        <HiCheckCircle className="w-5 h-5" />
                                        Perfecto, te avisaremos apenas esté disponible en nuestro catálogo
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tailwind personalizado para animación glow */}
            <style jsx>{`
                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow: 0 0 15px rgba(236, 72, 153, 0.7), 0 0 30px rgba(236, 72, 153, 0.5);
                    }
                    50% {
                        box-shadow: 0 0 25px rgba(236, 72, 153, 1), 0 0 50px rgba(236, 72, 153, 0.7);
                    }
                }
                .animate-pulseGlow {
                    animation: pulseGlow 2s infinite;
                }
            `}</style>
        </section>
    );
}