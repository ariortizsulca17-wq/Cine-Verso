// src/Componentes/Login.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext";

export default function Login({ onLoginExitoso, irARegistro }) {
  const { login, resetPassword, loginWithGoogle } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      await login(email, password);
      onLoginExitoso?.();
    } catch (err) {
      setError(traducirError(err.code));
    }
  };

  const handleReset = async () => {
    setError("");
    setMensaje("");

    if (!email) {
      setError("Primero escribe tu correo para enviarte el enlace.");
      return;
    }

    try {
      await resetPassword(email);
      setMensaje("Te enviamos un correo para restablecer tu contraseña.");
    } catch (err) {
      setError(traducirError(err.code));
    }
  };

  const handleGoogle = async () => {
    setError("");
    setMensaje("");

    try {
      await loginWithGoogle();
      onLoginExitoso?.();
    } catch (err) {
      setError(traducirError(err.code));
    }
  };

  function traducirError(code) {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Correo o contraseña incorrectos.";
      case "auth/user-not-found":
        return "No existe una cuenta con este correo.";
      case "auth/invalid-email":
        return "El correo no es válido.";
      default:
        return "Ocurrió un error. Intenta nuevamente.";
    }
  }

  // 🎨 Clases por tema
  const bgInput =
    theme === "dark"
      ? "bg-gray-800 text-white border-gray-700"
      : "bg-gray-100 text-gray-900 border-gray-300";
  const hoverInput =
    theme === "dark" ? "focus:ring-cyan-500" : "focus:ring-cyan-600";
  const btnPrimary =
    theme === "dark"
      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
      : "bg-cyan-500 hover:bg-cyan-600 text-gray-900";
  const btnSecondary =
    theme === "dark"
      ? "bg-purple-600 hover:bg-purple-700 text-white"
      : "bg-purple-500 hover:bg-purple-600 text-gray-900";
  const googleBtn =
    theme === "dark"
      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
      : "bg-gray-100 border-gray-300 hover:bg-gray-200";
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";
  const labelColor = theme === "dark" ? "text-gray-300" : "text-gray-700";
  const errorColor =
    theme === "dark"
      ? "text-red-400 bg-red-900/30 border-red-700"
      : "text-red-700 bg-red-200 border-red-400";
  const successColor =
    theme === "dark"
      ? "text-green-400 bg-green-900/30 border-green-700"
      : "text-green-700 bg-green-200 border-green-400";

  return (
    <div className={`w-full ${textColor}`}>
      {/* TÍTULO */}
      <h1
        className={`text-2xl sm:text-3xl font-bold text-center mb-6 tracking-wide ${
          theme === "dark" ? "text-cyan-300" : "text-cyan-700"
        }`}
      >
        Iniciar sesión
      </h1>

      {/* MENSAJES */}
      {error && (
        <p
          className={`mb-3 text-sm rounded-lg p-2 border ${errorColor}`}
        >
          {error}
        </p>
      )}

      {mensaje && (
        <p
          className={`mb-3 text-sm rounded-lg p-2 border ${successColor}`}
        >
          {mensaje}
        </p>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-5"
      >
        <div>
          <label className={`block text-sm mb-1 ${labelColor}`}>
            Correo electrónico
          </label>
          <input
            ref={emailRef}
            type="email"
            className={`w-full ${bgInput} border rounded-lg px-3 py-3 sm:py-2 text-sm focus:outline-none focus:ring-2 ${hoverInput} transition`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
          />
        </div>

        <div>
          <label className={`block text-sm mb-1 ${labelColor}`}>
            Contraseña
          </label>
          <input
            type="password"
            className={`w-full ${bgInput} border rounded-lg px-3 py-3 sm:py-2 text-sm focus:outline-none focus:ring-2 ${hoverInput} transition`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            required
          />
        </div>

        {/* BOTONES */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            className={`w-full sm:flex-1 py-3 sm:py-2 rounded-lg transition font-semibold ${btnPrimary}`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={irARegistro}
            className={`w-full sm:flex-1 py-3 sm:py-2 rounded-lg transition font-semibold ${btnSecondary}`}
          >
            Registrarse
          </button>
        </div>
      </form>

      {/* ACCIONES EXTRA */}
      <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center text-sm">
        <button
          type="button"
          onClick={handleReset}
          className={`underline text-center sm:text-left ${
            theme === "dark"
              ? "text-cyan-400 hover:text-cyan-300"
              : "text-cyan-600 hover:text-cyan-500"
          }`}
        >
          ¿Olvidaste tu contraseña?
        </button>

        <button
          type="button"
          onClick={handleGoogle}
          className={`w-full sm:w-auto justify-center px-4 py-2 rounded-lg transition flex items-center gap-2 ${googleBtn}`}
        >
          <span className={textColor}>🌐</span>
          Google
        </button>
      </div>
    </div>
  );
}
