import React, { useEffect, useState } from "react";
import { Calendar, Camera, Loader2, CheckCircle } from "lucide-react";
import Favoritos from "./Favoritos";
import Compras from "./Compras";



export default function DashboardContent({
  activeTab,
  formData,
  handleChange,
  handleFileChange,
  handleSubmit,
  isSaving,
  error,
  successMsg,
  newAvatarFile,
  user,
}) {
  const getAvatarUrl = () => user?.photoURL || user?.avatar;
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const inputClasses =
    "w-full p-3 rounded-lg bg-gray-700 border border-transparent text-white focus:border-cyan-500 transition-colors placeholder-gray-400";
  const labelClasses =
    "text-xs font-semibold text-cyan-400 mb-1 block uppercase tracking-wider";

  const renderProfileForm = () => (
    <div className="pt-2">
      {/* Título */}
      <header className="text-center mb-10">
        <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white border-b-2 border-cyan-600 pb-3 inline-block">
          MI PERFIL
        </h1>
      </header>

      {/* Foto de perfil */}
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="relative w-32 h-32 mb-4">
          <img
            src={
              newAvatarFile
                ? URL.createObjectURL(newAvatarFile)
                : getAvatarUrl() ||
                "https://placehold.co/150x150/4B5563/FFFFFF?text=U"
            }
            alt="Foto de perfil"
            className="w-full h-full rounded-full object-cover border-4 border-cyan-500 shadow-lg"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-700 transition transform translate-x-1 translate-y-1 border-2 border-gray-800"
          >
            <Camera className="text-white w-5 h-5" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-gray-400 text-sm italic">
          Haz click en el icono para cambiar la foto.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre" className={labelClasses}>
            Nombre completo
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full p-3 rounded-lg bg-gray-600 border border-transparent text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="telefono" className={labelClasses}>
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej. +51 987654321"
            className={inputClasses}
          />
        </div>

        {/* === GÉNERO (SOLO LECTURA) === */}
        <div>
          <label htmlFor="gender" className={labelClasses}>
            Género
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender || user?.gender || "No especificado"}
            disabled
            className="w-full p-3 rounded-lg bg-gray-600 border border-transparent text-gray-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label htmlFor="fechaNacimiento" className={labelClasses}>
            Fecha de nacimiento
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-cyan-400 w-5 h-5" />
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="w-full pl-10 p-3 rounded-lg bg-gray-700 border border-transparent text-white focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Mensajes de error o éxito */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-900/30 border border-red-700/50 rounded-xl">
            <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
            <p className="text-red-300 text-sm leading-relaxed">
              {error}
            </p>
          </div>
        )}


        {/* Botón guardar */}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg shadow-md shadow-cyan-700/30 flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );

  useEffect(() => {
    if (successMsg) {
      setShowSuccessModal(true);

      const timer = setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000); // se cierra solo en 3s

      return () => clearTimeout(timer);
    }
  }, [successMsg]);


  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl animate-fade-in">
            <CheckCircle className="mx-auto text-cyan-400 w-16 h-16 mb-4" />

            <h2 className="text-xl font-bold text-white mb-2">
              ¡Datos actualizados!
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Tu información se guardó correctamente.
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className="md:col-span-3 lg:col-span-4 bg-gray-800 rounded-xl shadow-2xl shadow-gray-950/70 p-8 md:p-12 border border-gray-700 min-h-[70vh]">
        {activeTab === "profile" && renderProfileForm()}
        {activeTab === "favorites" && <Favoritos user={user} />}
        {activeTab === "purchases" && <Compras user={user} />}
      </div>
    </>
  );
}

