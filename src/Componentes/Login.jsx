// src/Componentes/Login.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext.jsx";

export default function Login({ onLoginExitoso, irARegistro }) {
    const { login, resetPassword, loginWithGoogle } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [error, setError] = useState("");

    const emailRef = useRef(null);

    useEffect(() => {
        if (emailRef.current) emailRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMensaje("");

        try {
            await login(email, password);
            if (onLoginExitoso) onLoginExitoso();
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
            onLoginExitoso();
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

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300 tracking-wide">
                Iniciar sesión
            </h1>

            {error && (
                <p className="mb-3 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded p-2">
                    {error}
                </p>
            )}

            {mensaje && (
                <p className="mb-3 text-sm text-green-400 bg-green-900/30 border border-green-700 rounded p-2">
                    {mensaje}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm mb-1 text-gray-300">
                        Correo electrónico
                    </label>
                    <input
                        ref={emailRef}
                        type="email"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tu contraseña"
                        required
                    />
                </div>

                <div className="flex gap-3 pt-3">
                    <button
                        type="submit"
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg transition font-medium"
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        onClick={irARegistro}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition font-medium"
                    >
                        Registrarse
                    </button>
                </div>
            </form>

            <div className="mt-5 flex justify-between items-center text-sm">
                <button
                    type="button"
                    onClick={handleReset}
                    className="text-cyan-400 hover:text-cyan-300 underline"
                >
                    ¿Olvidaste tu contraseña?
                </button>

                <button
                    type="button"
                    onClick={handleGoogle}
                    className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                    <span className="text-white">🌐</span>
                    Google
                </button>
            </div>
        </div>
    );
}
