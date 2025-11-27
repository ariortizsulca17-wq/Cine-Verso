import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// Íconos importados para un diseño limpio
import { Tag, Calendar, Percent, Save, Loader, CheckCircle, XCircle, BarChart } from 'lucide-react'; 

export default function GenerarCupon() {
    // 1. Estados del Formulario
    const [formData, setFormData] = useState({
        codigo: '',
        descuento: 10, // Porcentaje predeterminado
        expiracion: '',
        limiteUso: 100, // Límite de usos predeterminado
    });
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: null, message: '' }); // Un solo estado para mensajes

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: null, message: '' });

        // Validación Básica
        if (!formData.codigo || !formData.expiracion || !formData.descuento) {
            setStatusMessage({ type: 'error', message: 'ERROR: Por favor, complete todos los campos obligatorios.' });
            setLoading(false);
            return;
        }

        const cuponData = {
            codigo: formData.codigo.toUpperCase().trim(),
            descuento: parseInt(formData.descuento), 
            expiracion: new Date(formData.expiracion), 
            limiteUso: parseInt(formData.limiteUso) || 0, // 0 = Ilimitado
            usosActuales: 0,
            activo: true, 
            fechaCreacion: serverTimestamp(),
        };

        try {
            const docRef = await addDoc(collection(db, "cupones"), cuponData);
            
            // ⭐ MENSAJE DE ÉXITO (Requerido por el usuario)
            setStatusMessage({ 
                type: 'success', 
                message: `✅ Cupón "${cuponData.codigo}" creado exitosamente. ID de Referencia: ${docRef.id.substring(0, 8)}...` 
            });
            
            // Limpiar formulario después del éxito
            setFormData({
                codigo: '',
                descuento: 10,
                expiracion: '',
                limiteUso: 100,
            });

        } catch (err) {
            console.error("Error al crear el cupón:", err);
            setStatusMessage({ 
                type: 'error', 
                message: "❌ Error: No se pudo guardar el cupón en la base de datos." 
            });
        } finally {
            setLoading(false);
        }
    };
    
    const today = new Date().toISOString().split('T')[0];

    // Estilos condicionales para el mensaje de estado
    const messageClasses = statusMessage.type === 'success'
        ? 'bg-green-800/50 border-green-500 text-green-300'
        : 'bg-red-800/50 border-red-500 text-red-300';
        
    const MessageIcon = statusMessage.type === 'success' ? CheckCircle : XCircle;

    return (
        <div className="p-6 md:p-10 bg-gray-900 min-h-full text-white">
            <h1 className="text-4xl font-extrabold mb-2 text-white border-b border-gray-700 pb-3">
                Generador de Cupones 
            </h1>
            <p className="text-gray-500 mb-8">
                Crea, configura y activa nuevos códigos promocionales para los clientes.
            </p>

            <form onSubmit={handleSubmit} className="max-w-xl bg-gray-800 p-8 rounded-xl shadow-2xl border border-cyan-700/50 space-y-6">
                
                {/* Título del Formulario */}
                <h2 className="text-2xl font-semibold text-cyan-400 flex items-center mb-4">
                    <BarChart className="w-6 h-6 mr-2" />
                    Detalles del Descuento
                </h2>
                
                {/* Código del Cupón */}
                <div className="group">
                    <label htmlFor="codigo" className="block text-sm font-medium text-gray-300 flex items-center mb-1 group-focus-within:text-cyan-400 transition-colors">
                        <Tag className="w-4 h-4 mr-2" /> Código (Ej. CUPON10, BLACKFRIDAY)
                    </label>
                    <input
                        type="text"
                        name="codigo"
                        id="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        required
                        maxLength="20" // Limita la longitud del código
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 uppercase shadow-inner shadow-black/20"
                        placeholder="INGRESE CÓDIGO"
                    />
                </div>

                {/* Descuento y Expiración (Grid) */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="group">
                        <label htmlFor="descuento" className="block text-sm font-medium text-gray-300 flex items-center mb-1 group-focus-within:text-green-400 transition-colors">
                            <Percent className="w-4 h-4 mr-2" /> Porcentaje de Descuento (%)
                        </label>
                        <input
                            type="number"
                            name="descuento"
                            id="descuento"
                            value={formData.descuento}
                            onChange={handleChange}
                            min="1"
                            max="100"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-green-500 focus:border-green-500 shadow-inner shadow-black/20"
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="expiracion" className="block text-sm font-medium text-gray-300 flex items-center mb-1 group-focus-within:text-red-400 transition-colors">
                            <Calendar className="w-4 h-4 mr-2" /> Fecha de Expiración
                        </label>
                        <input
                            type="date"
                            name="expiracion"
                            id="expiracion"
                            value={formData.expiracion}
                            onChange={handleChange}
                            min={today}
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-red-500 focus:border-red-500 shadow-inner shadow-black/20"
                        />
                    </div>
                </div>

                {/* Límite de Uso */}
                <div className="group">
                    <label htmlFor="limiteUso" className="block text-sm font-medium text-gray-300 flex items-center mb-1 group-focus-within:text-yellow-400 transition-colors">
                        <Tag className="w-4 h-4 mr-2" /> Límite de Usos (0 = Ilimitado)
                    </label>
                    <input
                        type="number"
                        name="limiteUso"
                        id="limiteUso"
                        value={formData.limiteUso}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-yellow-500 focus:border-yellow-500 shadow-inner shadow-black/20"
                        placeholder="100"
                    />
                </div>

                {/* Mensaje de Estado (Éxito o Error) */}
                {statusMessage.type && (
                    <div className={`p-3 text-sm font-semibold rounded-lg border flex items-center ${messageClasses}`}>
                        <MessageIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                        {statusMessage.message}
                    </div>
                )}

                {/* Botón de Envío */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg shadow-xl text-white bg-cyan-600 hover:bg-cyan-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <><Loader className="w-5 h-5 mr-2 animate-spin" /> Procesando...</>
                    ) : (
                        <><Save className="w-5 h-5 mr-2" /> Generar y Guardar Cupón</>
                    )}
                </button>
            </form>
        </div>
    );
}