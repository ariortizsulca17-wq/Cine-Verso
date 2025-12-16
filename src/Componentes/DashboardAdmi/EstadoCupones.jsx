// src/Componentes/DashboardAdmi/EstadosCupones.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Percent,
  Tag,
  Calendar,
  RefreshCw
} from "lucide-react";
import { useTheme } from "../../Context/ThemeContext";

export default function EstadosCupones() {
  const { theme } = useTheme();
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "cupones"),
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setCupones(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error al obtener cupones:", err);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleEstado = async (cupon) => {
    try {
      await updateDoc(doc(db, "cupones", cupon.id), {
        activo: !cupon.activo,
      });
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  if (loading) {
    return (
      <div className={`p-8 text-center flex flex-col items-center ${theme === "dark" ? "text-gray-400" : "text-gray-700"}`}>
        <RefreshCw className="w-6 h-6 animate-spin mb-2" />
        Cargando cupones...
      </div>
    );
  }

  // Colores dinámicos según tema
  const bgCard = theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-300";
  const textPrimary = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondary = theme === "dark" ? "text-gray-400" : "text-gray-600";
  const bgButton = theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300";

  return (
    <div className={`p-6 md:p-10 min-h-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <h1 className={`text-4xl font-extrabold mb-3 border-b pb-3 ${theme === "dark" ? "border-gray-700 text-white" : "border-gray-300 text-gray-900"}`}>
        Estados de Cupones
      </h1>
      <p className={`${textSecondary} mb-6`}>
        Administra y controla los cupones activos e inactivos.
      </p>

      <div className="space-y-4">
        {cupones.map((cupon) => {
          const fechaExp = cupon.expiracion?.toDate
            ? cupon.expiracion.toDate().toLocaleDateString()
            : "—";

          return (
            <div
              key={cupon.id}
              className={`rounded-xl p-5 flex items-center justify-between shadow-md border ${bgCard}`}
            >
              <div>
                <h2 className={`text-xl font-bold flex items-center gap-2 ${textPrimary}`}>
                  <Tag className={`w-5 h-5 text-cyan-400`} />
                  {cupon.codigo}
                </h2>

                <p className={`flex items-center gap-2 mt-1 ${textSecondary}`}>
                  <Percent className="w-4 h-4" />
                  Descuento: <span className={textPrimary}>{cupon.descuento}%</span>
                </p>

                <p className={`flex items-center gap-2 ${textSecondary}`}>
                  <Calendar className="w-4 h-4" />
                  Expira: <span className={textPrimary}>{fechaExp}</span>
                </p>

                <p className={textSecondary}>
                  Usos: <span className={textPrimary}>{cupon.usosActuales} / {cupon.limiteUso === 0 ? "∞" : cupon.limiteUso}</span>
                </p>
              </div>

              <div className="flex flex-col items-center">
                {cupon.activo ? (
                  <span className="flex items-center text-green-400 text-sm font-semibold mb-2">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    ACTIVO
                  </span>
                ) : (
                  <span className="flex items-center text-red-400 text-sm font-semibold mb-2">
                    <XCircle className="w-4 h-4 mr-1" />
                    INACTIVO
                  </span>
                )}

                <button
                  onClick={() => toggleEstado(cupon)}
                  className={`p-2 rounded-full transition shadow ${bgButton}`}
                >
                  {cupon.activo ? (
                    <ToggleRight className="w-7 h-7 text-green-400" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-red-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
