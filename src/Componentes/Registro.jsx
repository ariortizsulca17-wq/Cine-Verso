import { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/AuthContext.jsx";

export default function Registro({ onRegistroExitoso, onLoginExitoso, irALogin }) {
    const { register, loginWithGoogle } = useAuth();

    const [username, setUsername] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const emailRef = useRef(null);

    useEffect(() => {
        if (emailRef.current) emailRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(email, password, { username, avatarFile });
            if (onRegistroExitoso) onRegistroExitoso();
        } catch (err) {
            setError(traducirError(err.code));
        }
    };

    const handleGoogle = async () => {
        setError("");
        try {
            await loginWithGoogle();
            if (onLoginExitoso) onLoginExitoso();
        } catch (err) {
            setError(traducirError(err.code));
        }
    };

    function traducirError(code) {
        switch (code) {
            case "auth/email-already-in-use":
                return "Este correo ya está registrado.";
            case "auth/invalid-email":
                return "El correo no es válido.";
            case "auth/weak-password":
                return "La contraseña es muy débil.";
            default:
                return "Ocurrió un error. Intenta nuevamente.";
        }
    }

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold text-center mb-6 text-cyan-300 tracking-wide">
                Crear cuenta
            </h1>

            {error && (
                <p className="mb-3 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded p-2">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-800 overflow-hidden border-2 border-gray-600">
                        {avatarPreview ? (
                            <img src={avatarPreview} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Sin foto
                            </div>
                        )}
                    </div>
                    <label className="mt-2 text-sm text-gray-300">Avatar</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="text-sm mt-1"
                        onChange={handleAvatarChange}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-gray-300">
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm
                                   focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ej: abigail_27"
                        required
                    />
                </div>

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
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </div>

                <div className="flex gap-3 pt-3">
                    <button
                        type="submit"
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-2 rounded-lg transition font-medium"
                    >
                        Registrarse
                    </button>
                    <button
                        type="button"
                        onClick={irALogin}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition font-medium"
                    >
                        Iniciar sesión
                    </button>
                </div>
            </form>

            <button
                type="button"
                onClick={handleGoogle}
                className="mt-6 w-full bg-gray-800 border border-gray-700 rounded-lg py-2 hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
                🌐 Continuar con Google
            </button>
        </div>
    );
}
