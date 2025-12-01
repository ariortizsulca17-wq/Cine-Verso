// ✅ src/Paginas/Dashboard.jsx
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";

export default function Dashboard() {
    const { user, updateProfileData } = useAuth();

    const [nombre, setNombre] = useState(user?.username || "");
    const [apellido, setApellido] = useState(user?.lastName || "");
    const [gender, setGender] = useState(user?.gender || "");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    const guardarCambios = async () => {
        setSaving(true);
        setMsg("");

        try {
            await updateProfileData({
                nombre,
                apellido,
                gender,
            });

            setMsg("Datos actualizados correctamente");
        } catch (error) {
            console.error(error);
            setMsg("Error al actualizar");
        }

        setSaving(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Mi Cuenta</h2>

            <div className="space-y-5 bg-gray-800 p-6 rounded-lg shadow-xl">

                {/* Nombre */}
                <div>
                    <label className="font-semibold">Nombre</label>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    />
                </div>

                {/* Apellido */}
                <div>
                    <label className="font-semibold">Apellido</label>
                    <input
                        type="text"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    />
                </div>

                {/* ⭐ SELECTOR DE GÉNERO */}
                <div>
                    <label className="font-semibold">Género</label>

                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full mt-1 px-4 py-2 rounded bg-gray-700 border border-gray-600"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                {/* BOTÓN GUARDAR */}
                <button
                    onClick={guardarCambios}
                    disabled={saving}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 transition py-2 rounded font-bold mt-4"
                >
                    {saving ? "Guardando..." : "Guardar cambios"}
                </button>

                {/* MENSAJE */}
                {msg && (
                    <p className="text-center mt-3 text-green-300 font-semibold">{msg}</p>
                )}
            </div>
        </div>
    );
}
