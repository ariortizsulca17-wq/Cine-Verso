// ✅ src/Componentes/Dashboard.jsx (MODIFICADO A PÁGINA COMPLETA)

import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';

import { FaCalendarAlt, FaCamera } from 'react-icons/fa'; 

// Componente principal del formulario de Mi Perfil (Ahora es una página)
export default function Dashboard() {
    const { user, loading, updateProfileData, updateAvatar } = useAuth();
    
    
    // --- ESTADO Y LÓGICA DEL FORMULARIO (Sin cambios) ---
    const [formData, setFormData] = useState({
        nombre: '', apellido: '', email: '', fechaNacimiento: '', 
        celular: '', cineFavorito: '', genero: '', 
    });
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (user && !loading) {
            const [firstName = '', lastName = ''] = user.displayName?.split(' ') || ['', ''];

            setFormData({
                nombre: user.username || firstName,
                apellido: user.lastName || lastName,
                email: user.email || '',
                fechaNacimiento: user.fechaNacimiento || '', 
                celular: user.celular || '', 
                cineFavorito: user.cineFavorito || '', 
                genero: user.genero || '', 
            });
        }
    }, [user, loading]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSuccessMsg(''); 
    };

    const handleFileChange = (e) => {
        setNewAvatarFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);
        setError('');
        setSuccessMsg('');

        try {
            await updateProfileData(formData); 
            
            if (newAvatarFile) {
                await updateAvatar(newAvatarFile);
                setNewAvatarFile(null); 
            }

            setSuccessMsg('✅ ¡Datos actualizados con éxito!');
        } catch (err) {
            console.error('Error al actualizar:', err);
            setError('❌ Error al actualizar los datos. Inténtalo de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    const getAvatarUrl = () => user?.photoURL || user?.avatar;

    // ❌ ELIMINADA: La función handleClose que cerraba el panel ya no es necesaria.
    
    if (loading || !user) {
        return null;
    }

    // --- Renderizado de la Página ---
    const inputClasses = "w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500 transition-colors placeholder-gray-500";
    const labelClasses = "text-sm text-gray-400 mb-1 block";

    return (
        // 🎯 CAMBIO CLAVE: Contenedor que centra el formulario en la página
        // Elimina fixed inset-0, bg-black/50, y justify-end
        <div className="flex justify-center items-start py-10 px-4">
            
            {/* Panel de Perfil Centrado */}
            <div 
                // Ajustamos el tamaño a un formulario de página completa y le damos el fondo
                className="w-full max-w-2xl bg-gray-900 rounded-lg shadow-2xl p-6 md:p-10"
            >
                <div className="p-4 md:p-6">
                    
                    {/* Cabecera del Panel (Ajustada) */}
                    <header className="flex items-center justify-center pb-4 border-b border-gray-800">
                        {/* ❌ ELIMINADOS: Los botones de cerrar/retroceso ya que la navegación es con la Navbar */}
                        <h1 className="text-2xl font-bold uppercase tracking-wider text-white">
                            MI PERFIL
                        </h1>
                    </header>

                    {/* Contenido del formulario */}
                    <div className="pt-8">
                        
                        {/* 🖼️ Foto de Perfil */}
                        <div className="flex flex-col items-center justify-center mb-8">
                            <div className="relative w-24 h-24 mb-3">
                                <img 
                                    src={newAvatarFile ? URL.createObjectURL(newAvatarFile) : getAvatarUrl() || 'https://via.placeholder.com/150/4B5563/FFFFFF?text=U'} 
                                    alt="Foto de perfil"
                                    className="w-full h-full rounded-full object-cover border-4 border-gray-700"
                                />
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-1 bg-cyan-600 rounded-full cursor-pointer hover:bg-cyan-700 transition">
                                    <FaCamera className="text-white w-4 h-4" />
                                    <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* --- FORMULARIO --- */}
                        <h2 className="text-lg font-bold text-white uppercase mb-4">INFORMACIÓN PERSONAL</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* ... (Tus campos de formulario permanecen sin cambios) ... */}
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <label className={labelClasses}>Nombre*</label>
                                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={`${inputClasses} bg-transparent border-none p-0`} />
                            </div>

                            <div className="p-4 bg-gray-800 rounded-lg">
                                <label className={labelClasses}>Apellido*</label>
                                <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required className={`${inputClasses} bg-transparent border-none p-0`} />
                            </div>
                            
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <label className={labelClasses}>Correo electrónico</label>
                                <input type="email" name="email" value={formData.email} readOnly className={`${inputClasses} bg-transparent border-none p-0 opacity-70 cursor-not-allowed`} />
                            </div>

                            <div className="p-4 bg-gray-800 rounded-lg relative">
                                <label className={labelClasses}>Fecha de nacimiento*</label>
                                <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required className={`${inputClasses} bg-transparent border-none p-0`} />
                                <FaCalendarAlt className="absolute right-4 top-1/2 mt-2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                            
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <label className={labelClasses}>Celular*</label>
                                <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required className={`${inputClasses} bg-transparent border-none p-0`} />
                            </div>
                            
                            <div className="p-4 bg-gray-800 rounded-lg">
                                <label className={labelClasses}>Cine Favorito</label>
                                <select name="cineFavorito" value={formData.cineFavorito} onChange={handleChange} className={`${inputClasses} bg-transparent border-none p-0 appearance-none`}>
                                    <option value="">Selecciona tu cine</option>
                                    <option value="Sabaneta">Sabaneta</option>
                                    <option value="Envigado">Envigado</option>
                                </select>
                            </div>

                            <div className="p-4 bg-gray-800 rounded-lg">
                                <label className={labelClasses}>Género*</label>
                                <select name="genero" value={formData.genero} onChange={handleChange} required className={`${inputClasses} bg-transparent border-none p-0 appearance-none`}>
                                    <option value="">Selecciona</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="No Binario">No Binario</option>
                                </select>
                            </div>

                            {/* Mensajes y Botón */}
                            {error && <p className="text-red-400 text-center font-semibold mt-4">{error}</p>}
                            {successMsg && <p className="text-green-400 text-center font-semibold mt-4">{successMsg}</p>}

                            {/* 🎯 CAMBIO CLAVE: Eliminar `sticky bottom-0` y `shadow-top` */}
                            <div className="py-4"> 
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="w-full py-3 text-lg font-bold uppercase rounded-lg bg-cyan-600 text-gray-900 hover:bg-cyan-700 transition-colors disabled:bg-gray-600 disabled:text-gray-400"
                                >
                                    {isSaving ? 'ACTUALIZANDO...' : 'ACTUALIZAR MIS DATOS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}