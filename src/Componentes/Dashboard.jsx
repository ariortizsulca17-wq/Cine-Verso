import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext'; // <-- Importamos ThemeContext
import DashboardNav from './DashboardNav';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
    const { user, loading, updateProfileData, updateAvatar } = useAuth();
    const { theme } = useTheme(); // <-- Extraemos theme

    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        nombre: '', 
        email: '', 
        fechaNacimiento: '', 
        telefono: '',
    });
    const [newAvatarFile, setNewAvatarFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (user && !loading) {
            const [firstName = ''] = user.displayName?.split(' ') || [''];
            setFormData({
                nombre: user.username || firstName || '', 
                email: user.email || '',
                telefono: user.telefono || user.celular || '', 
                fechaNacimiento: user.fechaNacimiento || '', 
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
            console.error(err);
            setError('❌ Error al actualizar los datos.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !user) return null;

    return (
        <div className={`flex justify-center items-start py-10 px-4 min-h-screen
            ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <div className="w-full max-w-6xl">
                <h1 className={`text-3xl font-extrabold uppercase tracking-widest mb-8 md:hidden
                    ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
                    Mi Cuenta
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
                    <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
                    <DashboardContent 
                        activeTab={activeTab}
                        formData={formData}
                        newAvatarFile={newAvatarFile}
                        handleFileChange={handleFileChange}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        isSaving={isSaving}
                        error={error}
                        successMsg={successMsg}
                        user={user}
                        theme={theme} // <-- Pasamos theme a hijos
                    />
                </div>
            </div>
        </div>
    );
}
