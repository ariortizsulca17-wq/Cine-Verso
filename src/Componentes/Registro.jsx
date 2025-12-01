import { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/AuthContext.jsx";
import { Camera, UserCircle } from "lucide-react";

export default function Registro({ onRegistroExitoso, onLoginExitoso, irALogin }) {
    const { register, loginWithGoogle } = useAuth();

    const [username, setUsername] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [gender, setGender] = useState(""); // ⭐ Agregado del componente de tu compañera

    const [error, setError] = useState("");

    const emailRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (emailRef.current) emailRef.current.focus();
    }, []);

    // ============================
    //   ENVÍO DEL FORMULARIO
    // ============================
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(email, password, {
                username,
                avatarFile,
                gender, // ⭐ Se envía correctamente a Firebase
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

    // ============================
    //       TRADUCCIÓN ERRORES
    // ============================
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

    // ============================
    //      MANEJO DEL AVATAR
    // ============================
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

    // ============================
    //          JSX
    // ============================
    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold text-center mb-5 text-cyan-300 tracking-wide">
                Crear cuenta
            </h1>

            {error && (
                <p className="mb-4 text-sm text-red-400 bg-red-900/30 border border-red-700 rounded p-2">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* === SECCIÓN AVATAR COMPACTA === */}
                <div className="flex items-center gap-4 p-3 border border-gray-700/50 rounded-lg bg-gray-900/50">
                    
                    {/* Previsualización + botón cámara */}
                    <div className="relative w-16 h-16 rounded-full bg-gray-800 overflow-hidden border-2 border-cyan-500/50 flex-shrink-0"> 
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
                    
                    {/* Botón para seleccionar archivo */}
                    <div className="flex-1">
                        <label className="block text-sm mb-1 text-gray-300">
                            Foto de Perfil (Opcional)
                        </label>
                        <button
                            type="button"
                            onClick={handleButtonClick}
                            className="w-full text-left px-3 py-1 bg-gray-700 text-cyan-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition shadow-sm border border-gray-600 truncate"
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

                {/* === NOMBRE DE USUARIO === */}
                <div>
                    <label className="block text-sm mb-1 text-gray-300">
                        Nombre de usuario
                    </label>
                    <input
                        type="text"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="ej: abigail_27"
                        required
                    />
                </div>

                {/* === EMAIL === */}
                <div>
                    <label className="block text-sm mb-1 text-gray-300">Correo electrónico</label>
                    <input
                        ref={emailRef}
                        type="email"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        required
                    />
                </div>

                {/* === CONTRASEÑA === */}
                <div>
                    <label className="block text-sm mb-1 text-gray-300">Contraseña</label>
                    <input
                        type="password"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                </div>

                {/* === GÉNERO (ROBLOX STYLE) === */}
                <div>
                    <label className="block text-sm mb-2 text-gray-300">Género (opcional)</label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setGender("girl")}
                            className={`py-3 rounded-lg border transition
                                ${gender === "girl"
                                    ? "border-pink-500 bg-pink-600/40"
                                    : "border-gray-600 bg-gray-800"}`}
                        >
                            👧 Niña
                        </button>

                        <button
                            type="button"
                            onClick={() => setGender("boy")}
                            className={`py-3 rounded-lg border transition
                                ${gender === "boy"
                                    ? "border-blue-500 bg-blue-600/40"
                                    : "border-gray-600 bg-gray-800"}`}
                        >
                            👦 Niño
                        </button>
                    </div>
                </div>

                {/* === BOTONES === */}
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

            {/* === GOOGLE LOGIN === */}
            <button
                type="button"
                onClick={handleGoogle}
                className="mt-4 w-full bg-gray-800 border border-gray-700 rounded-lg py-2 hover:bg-gray-700 transition flex items-center justify-center gap-2"
            >
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
                    alt="Google Logo"
                    className="w-5 h-5"
                />
                Continuar con Google
            </button>
        </div>
    );
}
