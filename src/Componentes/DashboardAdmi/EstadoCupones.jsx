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

export default function EstadosCupones() {
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

  // Cambiar estado de ACTIVO / INACTIVO
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
      <div className="p-8 text-center text-gray-400 flex flex-col items-center">
        <RefreshCw className="w-6 h-6 animate-spin mb-2" />
        Cargando cupones...
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-full text-white">
      <h1 className="text-4xl font-extrabold mb-3 border-b border-gray-700 pb-3">
        Estados de Cupones
      </h1>
      <p className="text-gray-500 mb-6">
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
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex items-center justify-between shadow-md"
            >
              {/* Info principal */}
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Tag className="w-5 h-5 text-cyan-400" />
                  {cupon.codigo}
                </h2>

                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <Percent className="w-4 h-4" />
                  Descuento: <span className="text-white">{cupon.descuento}%</span>
                </p>

                <p className="text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Expira:{" "}
                  <span className="text-white">
                    {fechaExp}
                  </span>
                </p>

                <p className="text-gray-400">
                  Usos:{" "}
                  <span className="text-white">
                    {cupon.usosActuales} / {cupon.limiteUso === 0 ? "∞" : cupon.limiteUso}
                  </span>
                </p>
              </div>

              {/* Estado + botón */}
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
                  className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition shadow"
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
