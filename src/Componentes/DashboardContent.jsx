import React, { useEffect, useState } from "react";
import { Calendar, Camera, Loader2, CheckCircle } from "lucide-react";
import Favoritos from "./Favoritos";
import Compras from "./Compras";
import { useTheme } from "../Context/ThemeContext";

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
  const { theme } = useTheme();
  const getAvatarUrl = () => user?.photoURL || user?.avatar;
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const inputClasses = `w-full p-3 rounded-lg border text-sm transition-colors placeholder-gray-400 
    ${theme === "dark"
      ? "bg-gray-700 text-white border-transparent focus:border-cyan-500"
      : "bg-gray-200 text-gray-900 border-gray-300 focus:border-cyan-600"}`;

  const labelClasses = `text-xs font-semibold mb-1 block uppercase tracking-wider
    ${theme === "dark" ? "text-cyan-400" : "text-cyan-700"}`;

  const containerClasses = `
    rounded-xl shadow-2xl border 
    p-4 sm:p-6 md:p-8 lg:p-12 
    min-h-[60vh]
    ${theme === "dark"
      ? "bg-gray-800 border-gray-700 shadow-gray-950/70"
      : "bg-white border-gray-300 shadow-gray-400/50"}
  `;

  const renderProfileForm = () => (
    <div>
      {/* HEADER */}
      <header className="text-center mb-8 sm:mb-10">
        <h1
          className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-widest border-b-2 pb-3 inline-block
            ${theme === "dark"
              ? "text-white border-cyan-600"
              : "text-gray-900 border-cyan-700"}`}
        >
          Mi Perfil
        </h1>
      </header>

      {/* AVATAR */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-4">
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
            className="absolute bottom-0 right-0 p-2 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-700 transition border-2 border-gray-800"
          >
            <Camera className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs sm:text-sm italic text-gray-500 dark:text-gray-400 text-center">
          Haz clic en el icono para cambiar la foto
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Nombre completo</label>
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Correo electrónico</label>
          <input
            value={formData.email}
            disabled
            className={`w-full p-3 rounded-lg text-sm cursor-not-allowed 
              ${theme === "dark"
                ? "bg-gray-600 text-gray-400"
                : "bg-gray-200 text-gray-500"}`}
          />
        </div>

        <div>
          <label className={labelClasses}>Teléfono</label>
          <input
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Género</label>
          <input
            value={formData.gender || user?.gender || "No especificado"}
            disabled
            className={`w-full p-3 rounded-lg text-sm cursor-not-allowed 
              ${theme === "dark"
                ? "bg-gray-600 text-gray-400"
                : "bg-gray-200 text-gray-500"}`}
          />
        </div>

        <div className="md:col-span-2">
          <label className={labelClasses}>Fecha de nacimiento</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-cyan-500" />
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {error && (
          <div className="md:col-span-2 p-4 rounded-xl border bg-red-500/10 border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="md:col-span-2 flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 rounded-lg font-bold bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Guardando…
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
      const t = setTimeout(() => setShowSuccessModal(false), 3000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  return (
    <>
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className={`rounded-2xl p-6 sm:p-8 w-full max-w-sm text-center border
            ${theme === "dark" ? "bg-gray-900 border-cyan-500/30" : "bg-white border-cyan-600"}`}>
            <CheckCircle className="mx-auto w-14 h-14 text-cyan-500 mb-4" />
            <h2 className="text-lg sm:text-xl font-bold mb-2">¡Datos actualizados!</h2>
            <p className="text-sm text-gray-500 mb-6">
              Tu información se guardó correctamente.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white"
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
