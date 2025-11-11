import React, { useEffect, useState } from 'react';
import { Calendar, Camera, Loader2, Heart, ShoppingBag } from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// 🛒 Componente interno para mostrar las compras del usuario
function RenderPurchases({ user }) {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "compras"), where("uid", "==", user.uid), orderBy("fecha", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCompras(data);
    });

    return () => unsub();
  }, [user]);

  if (compras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-full py-10">
        <ShoppingBag className="text-cyan-600 w-16 h-16 mb-4" />
        <p className="text-gray-400 text-lg mb-2">Aún no tienes compras registradas.</p>
        <p className="text-gray-500 italic">
          Cuando compres, aparecerán aquí tus tickets 🎟️
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white border-b-2 border-cyan-600 pb-3 inline-block">
        MIS COMPRAS
      </h1>

      {compras.map((compra) => (
        <div
          key={compra.id}
          className="bg-gray-800/80 rounded-xl shadow-xl border border-gray-700 p-6 backdrop-blur-md"
        >
          {/* 🕓 Encabezado */}
          <div className="flex justify-between items-center mb-5 border-b border-gray-600 pb-3">
            <div>
              <p className="text-sm text-cyan-400 uppercase tracking-wide font-semibold">
                {compra.fecha?.toDate
                  ? format(compra.fecha.toDate(), "dd 'de' MMMM yyyy, HH:mm", { locale: es })
                  : "—"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Total de películas:{" "}
                <span className="font-semibold text-white">{compra.cantidad}</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <ShoppingBag className="w-4 h-4 text-cyan-500" />
              <span>Compra #{compra.id.slice(-5)}</span>
            </div>
          </div>

          {/* 🎬 Películas */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {compra.items.map((item, idx) => {
              const titulo = typeof item === "string" ? item : item.titulo || "Película";
              const imagen =
                typeof item === "object" && item.imagen
                  ? item.imagen
                  : "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬";

              return (
                <div
                  key={idx}
                  className="relative group rounded-lg overflow-hidden shadow-lg hover:shadow-cyan-600/30 border border-gray-700 bg-gray-900/80 transition-transform transform hover:-translate-y-1"
                >
                  <img
                    src={imagen}
                    alt={titulo}
                    className="w-full h-56 object-cover rounded-t-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://via.placeholder.com/200x300/1f2937/67e8f9?text=🎬";
                    }}
                  />
                  <div className="p-3 text-center bg-gray-800/80">
                    <p className="text-gray-100 font-semibold text-sm truncate">
                      {titulo}
                    </p>
                  </div>

                  {/* ✨ Hover Overlay */}
                  <div className="absolute inset-0 bg-cyan-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <p className="text-white text-xs font-semibold uppercase tracking-wide">
                      Ver Detalles
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}



export default function DashboardContent({
    activeTab, formData, handleChange, handleFileChange, handleSubmit,
    isSaving, error, successMsg, newAvatarFile, user
}) {
    const getAvatarUrl = () => user?.photoURL || user?.avatar;
    const inputClasses = "w-full p-3 rounded-lg bg-gray-700 border border-transparent text-white focus:border-cyan-500 transition-colors placeholder-gray-400";
    const labelClasses = "text-xs font-semibold text-cyan-400 mb-1 block uppercase tracking-wider";

    // 🧍 Mi Perfil
    const renderProfileForm = () => (
        <div className="pt-2">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white border-b-2 border-cyan-600 pb-3 inline-block">
                    MI PERFIL
                </h1>
            </header>

            <div className="flex flex-col items-center justify-center mb-10">
                <div className="relative w-32 h-32 mb-4">
                    <img
                        src={newAvatarFile ? URL.createObjectURL(newAvatarFile) : getAvatarUrl() || 'https://via.placeholder.com/150/4B5563/FFFFFF?text=U'}
                        alt="Foto de perfil"
                        className="w-full h-full rounded-full object-cover border-4 border-cyan-500 shadow-lg"
                    />
                    <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-700 transition transform translate-x-1 translate-y-1 border-2 border-gray-800">
                        <Camera className="text-white w-5 h-5" />
                        <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                </div>
                <p className="text-gray-400 text-sm italic">Haz click en el icono para cambiar la foto.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClasses}>Nombre*</label>
                        <input name="nombre" value={formData.nombre} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Apellido*</label>
                        <input name="apellido" value={formData.apellido} onChange={handleChange} required className={inputClasses} />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Correo electrónico</label>
                    <input name="email" value={formData.email} readOnly className={`${inputClasses} opacity-60 cursor-not-allowed`} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <label className={labelClasses}>Fecha de nacimiento*</label>
                        <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className={`${inputClasses} pr-10`} />
                        <Calendar className="absolute right-3 top-2/3 transform -translate-y-1/2 text-cyan-500" />
                    </div>
                    <div>
                        <label className={labelClasses}>Celular*</label>
                        <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required className={inputClasses} />
                    </div>
                    <div>
                        <label className={labelClasses}>Cine Favorito</label>
                        <select name="cineFavorito" value={formData.cineFavorito} onChange={handleChange} className={`${inputClasses} appearance-none`}>
                            <option value="">Selecciona tu cine</option>
                            <option value="Sabaneta">Sabaneta</option>
                            <option value="Envigado">Envigado</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelClasses}>Género*</label>
                        <select name="genero" value={formData.genero} onChange={handleChange} required className={`${inputClasses} appearance-none`}>
                            <option value="">Selecciona</option>
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
                            <option value="No Binario">No Binario</option>
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-400 text-center font-semibold mt-4 bg-red-900/30 p-2 rounded-lg border border-red-800">{error}</p>}
                {successMsg && <p className="text-green-400 text-center font-semibold mt-4 bg-green-900/30 p-2 rounded-lg border border-green-800">{successMsg}</p>}

                <button type="submit" disabled={isSaving} className="w-full py-3 flex items-center justify-center space-x-2 text-lg font-bold uppercase rounded-lg bg-cyan-600 text-gray-900 hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-900/50 disabled:bg-gray-700 disabled:text-gray-400 disabled:shadow-none">
                    {isSaving && <Loader2 className="animate-spin w-5 h-5" />}
                    <span>{isSaving ? 'ACTUALIZANDO...' : 'GUARDAR CAMBIOS'}</span>
                </button>
            </form>
        </div>
    );

    // ❤️ Favoritos
    const renderFavorites = () => (
        <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white border-b-2 border-cyan-600 pb-3 inline-block mb-8">
                MIS FAVORITOS
            </h1>
            <Heart className="text-cyan-600 w-16 h-16 mb-4" />
            <p className="text-gray-400 text-lg mb-2">Aquí verás tus películas o cines favoritos.</p>
            <p className="text-gray-500 italic">Esta sección está en desarrollo. ¡Vuelve pronto!</p>
        </div>
    );

    // 🛒 Mis Compras
    const renderPurchases = () => (<RenderPurchases user={user} />

    );

    return (
        <div className="md:col-span-3 lg:col-span-4 bg-gray-800 rounded-xl shadow-2xl shadow-gray-950/70 p-8 md:p-12 border border-gray-700 min-h-[70vh]">
            {activeTab === 'profile' && renderProfileForm()}
            {activeTab === 'favorites' && renderFavorites()}
            {activeTab === 'purchases' && renderPurchases()}
        </div>
    );
}
