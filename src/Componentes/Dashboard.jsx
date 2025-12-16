import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import { useTheme } from '../Context/ThemeContext';
import DashboardNav from './DashboardNav';
import DashboardContent from './DashboardContent';

export default function Dashboard() {
  const { user, loading, updateProfileData, updateAvatar } = useAuth();
  const { theme } = useTheme();

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
    <div
      className={`min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10
        ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
    >
      <div className="max-w-6xl mx-auto">

        {/* TÍTULO SOLO EN MÓVIL */}
        <h1
          className={`text-2xl sm:text-3xl font-extrabold uppercase tracking-widest mb-6 md:hidden text-center
            ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Mi Cuenta
        </h1>

        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* SIDEBAR */}
          <div className="md:col-span-1">
            <DashboardNav
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              theme={theme}
            />
          </div>

          {/* CONTENIDO */}
          <div className="md:col-span-3 lg:col-span-4">
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
              theme={theme}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
