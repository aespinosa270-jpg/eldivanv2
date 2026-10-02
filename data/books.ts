import type { Book } from "@/lib/types";

export const books: Book[] = [
  {
    id: "1",
    slug: "nacemos-para-siempre",
    title: "Nacemos para siempre",
    author: "Autor demostrativo",
    publisher: "ASMI",
    description:
      "Libro de demostración sobre prenatalidad, maternidad, vínculo y desarrollo temprano.",
    price: 480,
    year: 2025,
    available: true,
    stock: 12,
    isNew: true,
    featured: true,

    lifeStages: [
      "Prenatal y perinatal",
      "Bebés y primera infancia",
    ],

    clinicalTopics: [],

    theoreticalOrientations: [
      "Psicoanálisis contemporáneo",
    ],
  },

  {
    id: "2",
    slug: "adolescencia-cuerpo-y-alimentacion",
    title: "Adolescencia, cuerpo y alimentación",
    author: "Autor demostrativo",
    publisher: "Noveduc",
    description:
      "Libro de demostración sobre adolescencia, cuerpo y trastornos de la alimentación.",
    price: 520,
    year: 2026,
    available: true,
    stock: 7,
    isNew: true,

    lifeStages: [
      "Adolescencia",
    ],

    clinicalTopics: [
      "Trastornos de la alimentación",
      "Cuerpo y psicosomática",
    ],

    theoreticalOrientations: [
      "Psicoanálisis contemporáneo",
    ],
  },

  {
    id: "3",
    slug: "autismo-y-clinica-infantil",
    title: "Autismo y clínica infantil",
    author: "Donald Meltzer",
    publisher: "Letra Viva",
    description:
      "Libro de demostración vinculado con infancia, autismo y desarrollos de Meltzer.",
    price: 610,
    year: 2024,
    available: true,
    stock: 0,
    isNew: false,
    featured: true,

    lifeStages: [
      "Infancia",
    ],

    clinicalTopics: [
      "Autismo y psicosis infantil",
    ],

    theoreticalOrientations: [
      "Meltzer",
      "Melanie Klein y postkleinianos",
    ],
  },

  {
    id: "4",
    slug: "realidad-y-juego",
    title: "Realidad y juego",
    author: "Donald Winnicott",
    publisher: "Editorial demostrativa",
    description:
      "Juego, desarrollo emocional, creatividad y experiencia cultural.",
    price: 430,
    year: 2023,
    available: true,
    stock: 3,
    isNew: false,

    lifeStages: [
      "Bebés y primera infancia",
      "Infancia",
    ],

    clinicalTopics: [],

    theoreticalOrientations: [
      "Winnicott",
    ],
  },

  {
    id: "5",
    slug: "duelo-y-perdida",
    title: "Duelo y pérdida",
    author: "Autor demostrativo",
    publisher: "Letra Viva",
    description:
      "Material de demostración para la navegación temática por duelo y pérdida.",
    price: 390,
    year: 2025,
    available: true,
    stock: 0,
    isNew: false,

    lifeStages: [
      "Clínica con adultos",
    ],

    clinicalTopics: [
      "Duelo y pérdida",
    ],

    theoreticalOrientations: [
      "Psicoanálisis contemporáneo",
    ],
  },

  {
    id: "6",
    slug: "pareja-familia-y-vinculos",
    title: "Pareja, familia y vínculos",
    author: "Autor demostrativo",
    publisher: "Noveduc",
    description:
      "Clínica vincular, parentalidad, pareja y transmisión intergeneracional.",
    price: 455,
    year: 2026,
    available: true,
    stock: 5,
    isNew: true,

    lifeStages: [
      "Pareja y familia",
    ],

    clinicalTopics: [
      "Pareja y familia",
    ],

    theoreticalOrientations: [
      "Psicoanálisis vincular",
    ],
  },
];
