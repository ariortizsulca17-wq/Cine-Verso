import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import DashboardNav from './DashboardNav';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
    const { user, loading, updateProfileData, updateAvatar } = useAuth();

    // --- Estado principal ---
    const [activeTab, setActiveTab] = useState('profile');
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
                        setFormData={setFormData}
                        newAvatarFile={newAvatarFile}
                        handleFileChange={handleFileChange}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        isSaving={isSaving}
                        error={error}
                        successMsg={successMsg}
                        user={user}
                    />
                </div>
            </div>
        </div>
    );
}
