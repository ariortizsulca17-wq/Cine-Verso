import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import DashboardNav from './DashboardNav';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
    const { user, loading, updateProfileData, updateAvatar } = useAuth();

    // --- 1. Estado principal (Solo los campos usados en el formulario) ---
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        nombre: '', 
        email: '', 
        fechaNacimiento: '', 
        telefono: '', // Usaremos 'telefono' en todo el componente para simplificar.
    });
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // --- 2. useEffect para Cargar Datos (Mapeo corregido) ---
    useEffect(() => {
        if (user && !loading) {
            // Extraer nombre/apellido (si se usa displayName)
            const [firstName = ''] = user.displayName?.split(' ') || [''];
            
            setFormData({
                // Prioriza user.username, luego firstName, si no existe usa cadena vacía.
                nombre: user.username || firstName || '', 
                
                email: user.email || '',
                
                // Mapeo unificado de teléfono: 
                // Prioriza user.telefono, luego user.celular. Si no existe, usa cadena vacía.
                telefono: user.telefono || user.celular || '', 
                
                fechaNacimiento: user.fechaNacimiento || '', 
                
                // NOTA: 'gender' no se incluye en formData ya que es de solo lectura 
                // y se puede acceder directamente desde la prop 'user' en el hijo.
            });
        }
    }, [user, loading]);

    // --- 3. Handlers ---
    const handleChange = (e) => {
        // [e.target.name] será 'nombre', 'email', 'telefono', etc., 
        // y coincidirá con las claves del estado formData.
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
            // Se envía solo los campos definidos en formData
            await updateProfileData(formData); 
            
            if (newAvatarFile) {
                await updateAvatar(newAvatarFile);
                setNewAvatarFile(null);
            }
            setSuccessMsg('✅ ¡Datos actualizados con éxito!');
        } catch (err) {
            console.error(err);
            setError('❌ Error al actualizar los datos.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) return null;

    return (
        <div className="flex justify-center items-start py-10 px-4 min-h-screen bg-gray-900">
            <div className="w-full max-w-6xl">
                <h1 className="text-3xl font-extrabold uppercase tracking-widest text-white mb-8 md:hidden">
                    Mi Cuenta
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
                    <DashboardContent 
                        activeTab={activeTab}
                        formData={formData}
                        // setFormData ya no es necesario pasarlo
                        newAvatarFile={newAvatarFile}
                        handleFileChange={handleFileChange}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        isSaving={isSaving}
                        error={error}
                        successMsg={successMsg}
                        user={user} // Pasamos 'user' para acceder a gender y otras props
                    />
                </div>
            </div>
        </div>
    );
}