export type LifeStage =
  | "Prenatal y perinatal"
  | "Bebés y primera infancia"
  | "Infancia"
  | "Adolescencia"
  | "Clínica con adultos"
  | "Pareja y familia"
  | "Envejecimiento y vejez";

export type ClinicalTopic =
  | "Autismo y psicosis infantil"
  | "Psicosis"
  | "Neurosis"
  | "Personalidad, narcisismo y estados límite"
  | "Trauma"
  | "Adicciones y toxicomanías"
  | "Trastornos de la alimentación"
  | "Cuerpo y psicosomática"
  | "Sexualidad y género"
  | "Duelo y pérdida"
  | "Suicidio y autolesiones"
  | "TDAH y problemáticas escolares"
  | "Pareja y familia";

export type TheoreticalOrientation =
  | "Freud y tradición freudiana"
  | "Melanie Klein y postkleinianos"
  | "Bion y desarrollos bionianos"
  | "Winnicott"
  | "Lacan y orientación lacaniana"
  | "Meltzer"
  | "Psicoanálisis contemporáneo"
  | "Psicoanálisis vincular"
  | "Psicoanálisis francés";

export type Book = {
  id: string;
  slug: string;

  title: string;
  author: string;
  publisher: string;

  description: string;

  price: number;
  year: number;

  available: boolean;
  stock: number;
  isNew: boolean;
  featured?: boolean;
  coverImage?: string;
  productImages?: string[];

  lifeStages: LifeStage[];
  clinicalTopics: ClinicalTopic[];
  theoreticalOrientations: TheoreticalOrientation[];
};
