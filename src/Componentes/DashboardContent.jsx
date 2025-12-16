import React, { useEffect, useState } from "react";
import { Calendar, Camera, Loader2, CheckCircle } from "lucide-react";
import Favoritos from "./Favoritos";
import Compras from "./Compras";
import { useTheme } from "../Context/ThemeContext"; // <-- Importamos ThemeContext

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
  const { theme } = useTheme(); // <-- Extraemos theme
  const getAvatarUrl = () => user?.photoURL || user?.avatar;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Clases condicionales según theme
  const inputClasses = `w-full p-3 rounded-lg border text-sm transition-colors placeholder-gray-400 
    ${theme === "dark" ? "bg-gray-700 text-white border-transparent focus:border-cyan-500" 
    : "bg-gray-200 text-gray-900 border-gray-300 focus:border-cyan-600"}`;

  const labelClasses = `text-xs font-semibold mb-1 block uppercase tracking-wider
    ${theme === "dark" ? "text-cyan-400" : "text-cyan-700"}`;

  const containerClasses = `md:col-span-3 lg:col-span-4 rounded-xl shadow-2xl p-8 md:p-12 border min-h-[70vh] 
    ${theme === "dark" ? "bg-gray-800 border-gray-700 shadow-gray-950/70" 
    : "bg-white border-gray-300 shadow-gray-400/50"}`;

  const renderProfileForm = () => (
    <div className="pt-2">
      <header className="text-center mb-10">
        <h1 className={`text-3xl font-extrabold uppercase tracking-widest border-b-2 pb-3 inline-block
          ${theme === "dark" ? "text-white border-cyan-600" : "text-gray-900 border-cyan-700"}`}>
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
                : getAvatarUrl() || "https://placehold.co/150x150/4B5563/FFFFFF?text=U"
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
        <p className={theme === "dark" ? "text-gray-400 text-sm italic" : "text-gray-600 text-sm italic"}>
          Haz click en el icono para cambiar la foto.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre" className={labelClasses}>Nombre completo</label>
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
          <label htmlFor="email" className={labelClasses}>Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            disabled
            className={`w-full p-3 rounded-lg border text-sm cursor-not-allowed 
              ${theme === "dark" ? "bg-gray-600 text-gray-400 border-transparent" 
              : "bg-gray-200 text-gray-500 border-gray-300"}`}
          />
        </div>

        <div>
          <label htmlFor="telefono" className={labelClasses}>Teléfono</label>
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

        <div>
          <label htmlFor="gender" className={labelClasses}>Género</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender || user?.gender || "No especificado"}
            disabled
            className={`w-full p-3 rounded-lg border text-sm cursor-not-allowed 
              ${theme === "dark" ? "bg-gray-600 text-gray-400 border-transparent" 
              : "bg-gray-200 text-gray-500 border-gray-300"}`}
          />
        </div>

        <div>
          <label htmlFor="fechaNacimiento" className={labelClasses}>Fecha de nacimiento</label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-3 w-5 h-5 ${theme === "dark" ? "text-cyan-400" : "text-cyan-700"}`} />
            <input
              type="date"
              id="fechaNacimiento"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className={inputClasses + " pl-10"}
            />
          </div>
        </div>

        {error && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${theme === "dark" ? "bg-red-900/30 border-red-700/50" : "bg-red-200/30 border-red-400/50"}`}>
            <div className="w-2 h-2 mt-2 rounded-full bg-red-400" />
            <p className={theme === "dark" ? "text-red-300 text-sm leading-relaxed" : "text-red-700 text-sm leading-relaxed"}>
              {error}
            </p>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition shadow-md 
              ${theme === "dark" ? "bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-700/30 disabled:opacity-60" 
              : "bg-cyan-500 hover:bg-cyan-600 text-white shadow-cyan-400/30 disabled:opacity-60"}`}
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
      const timer = setTimeout(() => setShowSuccessModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className={`rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl animate-fade-in border 
            ${theme === "dark" ? "bg-gray-900 border-cyan-500/30" : "bg-white border-cyan-600"}`}>
            <CheckCircle className={`mx-auto w-16 h-16 mb-4 ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`} />
            <h2 className={theme === "dark" ? "text-xl font-bold text-white mb-2" : "text-xl font-bold text-gray-900 mb-2"}>
              ¡Datos actualizados!
            </h2>
            <p className={theme === "dark" ? "text-gray-400 text-sm mb-6" : "text-gray-700 text-sm mb-6"}>
              Tu información se guardó correctamente.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className={`px-6 py-2 rounded-lg font-semibold transition
                ${theme === "dark" ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "bg-cyan-500 hover:bg-cyan-600 text-white"}`}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      <div className={containerClasses}>
        {activeTab === "profile" && renderProfileForm()}
        {activeTab === "favorites" && <Favoritos user={user} theme={theme} />}
        {activeTab === "purchases" && <Compras user={user} theme={theme} />}
      </div>
    </>
  );
}
