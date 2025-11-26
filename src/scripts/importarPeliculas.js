import { collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";
import  peliculas  from "../Componentes/PeliculasData"

// Esta función la llamaremos una sola vez
export async function importarPeliculas() {
  const batch = writeBatch(db);
  const coleccionRef = collection(db, "peliculas"); // nombre de tu colección

  peliculas.forEach((pelicula) => {
    // OPCIÓN 1: id automático (se duplican si ejecutas 2 veces)
    // const docRef = doc(coleccionRef);

    // OPCIÓN 2: usar el campo id de tu data como id del documento
    // (así si ejecutas dos veces, solo se sobreescriben)
    const docId = pelicula.id ? String(pelicula.id) : undefined;
    const docRef = doc(coleccionRef, docId);

    batch.set(docRef, pelicula);
  });

  await batch.commit();
}
