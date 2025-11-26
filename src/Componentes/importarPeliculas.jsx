import { useState } from "react";
import { importarPeliculas } from "../scripts/importarPeliculas";

function ImportarPeliculas() {
  const [estado, setEstado] = useState("idle"); // idle | cargando | ok | error
  const [mensajeError, setMensajeError] = useState("");

  const handleImportar = async () => {
    setEstado("cargando");
    setMensajeError("");

    try {
      await importarPeliculas();
      setEstado("ok");
    } catch (error) {
      console.error(error);
      setMensajeError(error.message);
      setEstado("error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Importar películas a Firestore</h2>

      <button onClick={handleImportar} disabled={estado === "cargando"}>
        {estado === "cargando" ? "Importando..." : "Importar películas"}
      </button>

      {estado === "ok" && (
        <p style={{ color: "green" }}>
          ✅ Películas importadas correctamente.
        </p>
      )}

      {estado === "error" && (
        <p style={{ color: "red" }}>
          ❌ Error al importar: {mensajeError}
        </p>
      )}
    </div>
  );
}

export default ImportarPeliculas;
