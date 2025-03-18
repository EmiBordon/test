// notes.tsx
export interface Note {
  id: number;
  title: string;
  content?: string;
  image?: any; // Puedes cambiar 'any' por un tipo más específico si quieres, como 'ImageSourcePropType' en React Native
}

// Aquí podrías importar imágenes si las tienes
import img1 from '../../images/garabato.jpg';


export const NOTES: Note[] = [
  { id: 1, title: "Tutorial de Matt", image: img1 },
  { id: 2, title: "Título 2", content: "Este es el contenido de la nota 2." },
  { id: 3, title: "Título 3", content: "Este es el contenido de la nota 3."},
  { id: 4, title: "Título 4", content: "Este es el contenido de la nota 4." },
  { id: 5, title: "Título 5", content: "Este es el contenido de la nota 5." },
  { id: 6, title: "Título 6", content: "Este es el contenido de la nota 6." },
  { id: 7, title: "Título 7", content: "Este es el contenido de la nota 7." },
  { id: 8, title: "Título 8", content: "Este es el contenido de la nota 8." },
  { id: 9, title: "Título 9", content: "Este es el contenido de la nota 9." },
  { id: 10, title: "Título 10", content: "Este es el contenido de la nota 10." },
  { id: 11, title: "Título 11", content: "Este es el contenido de la nota 11." },
  { id: 12, title: "Título 12", content: "Este es el contenido de la nota 12." },
];
