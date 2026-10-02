import type {
  ClinicalTopic,
  LifeStage,
  TheoreticalOrientation,
} from "@/lib/types";

export const lifeStages: {
  name: LifeStage;
  description: string;
}[] = [
  {
    name: "Prenatal y perinatal",
    description:
      "Embarazo, vida fetal, parto, maternidad, vínculo prenatal, reproducción y primeros intercambios.",
  },
  {
    name: "Bebés y primera infancia",
    description:
      "0–3 años, vínculo temprano, observación de bebés, desarrollo temprano, lactancia, separación e individuación.",
  },
  {
    name: "Infancia",
    description:
      "Clínica infantil, juego, padres, escuela, desarrollo, simbolización y técnica con niños.",
  },
  {
    name: "Adolescencia",
    description:
      "Identidad, cuerpo, sexualidad, autolesiones, redes, consumos, trastornos alimentarios y clínica adolescente.",
  },
  {
    name: "Clínica con adultos",
    description:
      "Filtro para localizar obras centradas en el trabajo clínico con población adulta.",
  },
  {
    name: "Pareja y familia",
    description:
      "Vínculos, parentalidad, familias contemporáneas, pareja y transmisión intergeneracional.",
  },
  {
    name: "Envejecimiento y vejez",
    description:
      "Obras relacionadas con envejecimiento, vejez y sus problemáticas clínicas.",
  },
];

export const clinicalTopics: ClinicalTopic[] = [
  "Autismo y psicosis infantil",
  "Psicosis",
  "Neurosis",
  "Personalidad, narcisismo y estados límite",
  "Trauma",
  "Adicciones y toxicomanías",
  "Trastornos de la alimentación",
  "Cuerpo y psicosomática",
  "Sexualidad y género",
  "Duelo y pérdida",
  "Suicidio y autolesiones",
  "TDAH y problemáticas escolares",
  "Pareja y familia",
];

export const theoreticalOrientations: TheoreticalOrientation[] = [
  "Freud y tradición freudiana",
  "Melanie Klein y postkleinianos",
  "Bion y desarrollos bionianos",
  "Winnicott",
  "Lacan y orientación lacaniana",
  "Meltzer",
  "Psicoanálisis contemporáneo",
  "Psicoanálisis vincular",
  "Psicoanálisis francés",
];

export const additionalFilters = [
  "Autor",
  "Editorial",
  "Precio",
  "Disponibilidad",
  "Año",
  "Novedades",
] as const;