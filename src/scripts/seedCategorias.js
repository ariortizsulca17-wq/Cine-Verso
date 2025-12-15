import { db } from "./firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const categorias = [
  {
    id: "kids-familiar",
    nombre: "Kids/Familiar",
    generos: [
      "Animación / Aventura",
      "Animación / Familiar",
      "Animación / Comedia",
      "Musical",
      "Animación / Superhéroes",
      "Animación / Fantasía",
      "Animación / Emocional",
      "Animación / Amistad",
      "Musical / Fantasía",
    ],
  },
  {
    id: "top-10",
    nombre: "Top 10",
    generos: [
      "Animación / Aventura / Fantasía",
      "Acción / Superhéroes / Ciencia Ficción",
      "Suspenso / Misterio / Drama",
      "Acción / Crimen / Thriller",
      "Acción / Superhéroes / Marvel",
      "Superhéroes / Ciencia Ficción / Aventura",
      "Acción / Espionaje / Aventura",
      "Acción / Terror / Fantasía Oscura",
      "Acción / Deporte / Drama",
    ],
  },
  {
    id: "asiaticas-anime",
    nombre: "Asiáticas/Anime",
    generos: [
      "Thriller / Drama",
      "Terror / Acción",
      "Acción / Drama",
      "Drama / Venganza",
      "Romance / Fantasía",
      "Drama / Romance",
      "Fantasía / Aventura",
      "Acción / Suspenso",
      "Terror / Escolar",
      "Anime / Romance",
      "Anime / Drama",
      "Anime / Fantasía",
      "Anime / Acción",
      "Anime / Épico",
      "Anime / Fantasía / Drama",
      "Anime / Fantasía / Aventura / Drama",
      "Anime / Sobrenatural",
      "Anime / Musical",
      "Anime / Acción / Fantasía",
    ],
  },
  {
    id: "documentales",
    nombre: "Documentales",
    generos: [
      "Naturaleza / Ciencia",
      "Animales / Denuncia",
      "Océanos / Ecología",
      "Naturaleza / Reflexión",
      "Naturaleza / Vida Marina",
      "Aventura / Océano",
      "Ciencia / Espacio",
      "Naturaleza / Mundo",
      "Tecnología / Sociedad",
      "Crimen / Real",
      "Sociedad / Política",
      "Trabajo / Sociedad",
      "Derechos Humanos / Historia",
      "Economía / Política",
      "Tecnología / Privacidad",
      "Religión / Misterio",
      "Deporte / Biografía",
      "Biografía / Superación",
      "Música / Juventud",
      "Música / Inspiración",
      "Desastre / Testimonio",
    ],
  },
  {
    id: "basadas-en-libros",
    nombre: "Basadas en Libros",
    generos: [
      "Fantasía / Aventura",
      "Romance / Drama",
      "Fantasía / Épico",
      "Romance / Fantasía",
      "Crimen / Drama",
      "Ciencia Ficción / Acción",
      "Drama / Romance",
      "Terror / Suspenso",
      "Misterio / Thriller",
      "Drama / Adolescente",
    ],
  },
];

export const seedCategorias = async () => {
  const ref = collection(db, "categorias");

  for (const cat of categorias) {
    await setDoc(doc(ref, cat.id), {
      nombre: cat.nombre,
      generos: cat.generos,
    });
  }

  console.log("✅ Categorías y géneros cargados");
};
