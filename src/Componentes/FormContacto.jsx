// src/Componentes/FormContacto.jsx
import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send, CheckCircle, X } from 'lucide-react';

// --- COMPONENTE MODAL DE CONFIRMACIÓN ---
const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Contenido del Modal */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-sm w-full border border-green-500/50 relative text-center">
        
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce-slow" />
        
        <h3 className="text-xl font-bold text-white mb-2">
          ¡Mensaje Enviado con Éxito!
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          Gracias por contactarnos. Responderemos a tu consulta a la brevedad posible.
        </p>
        
        <button
          onClick={onClose}
          className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-500 transition shadow-md"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL FORMULARIO DE CONTACTO ---
export function FormContacto() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);

    // --- SIMULACIÓN DE ENVÍO DE DATOS ---
    try {
      // Simular una llamada API o envío a Firebase/otra plataforma
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      console.log("Datos enviados:", formData);

      // Limpiar formulario y abrir modal
      setFormData({ name: '', email: '', message: '' });
      setIsModalOpen(true);

    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      // Aquí se podría poner un modal de error
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-2xl border border-cyan-600/30">
        
        {/* Campo Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            <User className="w-4 h-4 inline mr-1 text-cyan-400" /> Nombre Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-sm"
            placeholder="Tu nombre"
            disabled={isSending}
          />
        </div>

        {/* Campo Correo Electrónico */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            <Mail className="w-4 h-4 inline mr-1 text-cyan-400" /> Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-sm"
            placeholder="ejemplo@dominio.com"
            disabled={isSending}
          />
        </div>

        {/* Campo Mensaje */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            <MessageSquare className="w-4 h-4 inline mr-1 text-cyan-400" /> Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500 transition duration-150 text-sm resize-none"
            placeholder="Escribe aquí tu duda o sugerencia..."
            disabled={isSending}
          ></textarea>
        </div>

        {/* Botón de Envío */}
        <button
          type="submit"
          disabled={isSending}
          className={`w-full flex items-center justify-center font-bold py-3 px-4 rounded-lg transition duration-300 uppercase tracking-wider text-sm ${
            isSending 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-cyan-600 text-gray-900 hover:bg-cyan-500 shadow-lg shadow-cyan-500/50'
          }`}
        >
          {isSending ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensaje
            </>
          )}
        </button>
      </form>

      {/* Modal de Confirmación */}
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}