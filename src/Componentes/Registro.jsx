// ✅ src/Componentes/Registro.jsx
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { useTheme } from "../Context/ThemeContext.jsx"; // <-- Importamos ThemeContext
import { Camera, UserCircle } from "lucide-react";
import { User, UserCircle2 } from "lucide-react";

export default function Registro({ onRegistroExitoso, onLoginExitoso, irALogin }) {
    const { register, loginWithGoogle } = useAuth();
    const { theme } = useTheme(); // <-- Extraemos theme

    const [username, setUsername] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [error, setError] = useState("");

    const emailRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (emailRef.current) emailRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(email, password, {
                username,
                avatarFile,
                gender,
            });

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
        } else {
            setAvatarPreview(null);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    // --- Clases dinámicas según theme ---
    const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';
    const inputBg = theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-600';
    const btnPrimary = theme === 'dark' ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white';
    const btnSecondary = theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white';
    const btnGoogle = theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' : 'bg-gray-200 border-gray-300 text-gray-900 hover:bg-gray-300';
    const errorClass = theme === 'dark' ? 'text-red-400 bg-red-900/30 border-red-700' : 'text-red-700 bg-red-200 border-red-400';
    const labelClass = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
    const avatarBg = theme === 'dark' ? 'bg-gray-800 border-cyan-500/50' : 'bg-gray-200 border-cyan-500/50';

    return (
        <div 
            className={`max-h-[88vh] overflow-y-auto pr-2 max-w-lg mx-auto ${bgClass}`}
            style={{ scrollbarWidth: "thin", scrollbarColor: "#4b5563 #1f2937" }}
        >
            <h1 className="text-3xl font-bold text-center mb-5 text-cyan-300 tracking-wide">
                Crear cuenta
            </h1>

            {error && (
                <p className={`mb-4 text-sm rounded p-2 border ${errorClass}`}>
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Avatar */}
                <div className={`flex items-center gap-4 p-3 border rounded-lg ${avatarBg}`}>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <UserCircle className="w-10 h-10 text-gray-600" />
                            </div>
                        )}
                        <div
                            className="absolute bottom-0 right-0 p-1 bg-cyan-600 rounded-full border-2 border-gray-900 cursor-pointer hover:bg-cyan-500 transition"
                            onClick={handleButtonClick}
                            title={avatarPreview ? "Cambiar foto" : "Subir foto"}
                        >
                            <Camera className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    <div className="flex-1">
                        <label className={`block text-sm mb-1 ${labelClass}`}>
                            Foto de Perfil (Opcional)
                        </label>
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className={`w-full text-left px-3 py-1 rounded-lg text-sm font-medium hover:opacity-80 transition shadow-sm border truncate ${avatarBg}`}
                        >
                            {avatarFile ? `Archivo: ${avatarFile.name}` : "Seleccionar un archivo..."}
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />
                </div>

                {/* Nombre de usuario */}
                <div>
                    <label className={`block text-sm mb-1 ${labelClass}`}>Nombre de usuario</label>
                    <input
                        type="text"
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${inputBg}`}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ej: abigail_27"
                        required
                    />
                </div>

                {/* Email */}
                <div>
                    <label className={`block text-sm mb-1 ${labelClass}`}>Correo electrónico</label>
                    <input
                        ref={emailRef}
                        type="email"
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${inputBg}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        required
                    />
                </div>

                {/* Contraseña */}
                <div>
                    <label className={`block text-sm mb-1 ${labelClass}`}>Contraseña</label>
                    <input
                        type="password"
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${inputBg}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </div>

                {/* Género */}
                <div>
                    <label className={`block text-sm mb-2 ${labelClass}`}>Género (opcional)</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setGender("Femenino")}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm transition
                                ${gender === "Femenino" ? "border-pink-500 bg-pink-600/30 text-pink-300" : "border-gray-600 bg-gray-800 text-gray-300"}`}
                        >
                            <UserCircle2 className="w-5 h-5" /> Mujer
                        </button>
                        <button
                            type="button"
                            onClick={() => setGender("Masculino")}
                            className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm transition
                                ${gender === "Masculino" ? "border-blue-500 bg-blue-600/30 text-blue-300" : "border-gray-600 bg-gray-800 text-gray-300"}`}
                        >
                            <User className="w-5 h-5" /> Hombre
                        </button>
                    </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-3">
                    <button type="submit" className={`flex-1 py-2 rounded-lg transition font-medium ${btnPrimary}`}>
                        Registrarse
                    </button>
                    <button type="button" onClick={irALogin} className={`flex-1 py-2 rounded-lg transition font-medium ${btnSecondary}`}>
                        Iniciar sesión
                    </button>
                </div>
            </form>

            {/* Google Login */}
            <div className="mt-4">
                <button
                    type="button"
                    onClick={handleGoogle}
                    className={`w-full border rounded-md py-2 text-sm flex items-center justify-center gap-2 ${btnGoogle}`}
                    style={{ maxWidth: "260px", margin: "0 auto" }}
                >
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                        alt="Google Logo"
                        className="w-4 h-4"
                    />
                    Continuar con Google
                </button>
            </div>
        </div>
    );
}
