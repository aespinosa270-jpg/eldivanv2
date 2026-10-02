import Link from "next/link";

import {
  Baby,
  Brain,
  HeartHandshake,
  LibraryBig,
  Sparkles,
  UsersRound,
} from "lucide-react";

const categories = [
  {
    label: "Prenatal y perinatal",
    icon: Sparkles,
  },
  {
    label: "Bebés y primera infancia",
    icon: Baby,
  },
  {
    label: "Infancia",
    icon: UsersRound,
  },
  {
    label: "Adolescencia",
    icon: HeartHandshake,
  },
  {
    label: "Temas clínicos",
    icon: Brain,
  },
  {
    label: "Teoría y corrientes",
    icon: LibraryBig,
  },
];

export default function MarketplaceCategories() {
  return (
    <section className="bg-[#F7F3EC] py-7">

      <div className="page-shell">

        <div className="rounded-[10px] bg-white p-6 market-shadow">

          <div className="mb-6">

            <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#1D2E4B]/45">
              Explora el catálogo
            </p>

            <h2 className="editorial-serif mt-2 text-[28px] text-[#1D2E4B]">
              Encuentra libros según tu interés
            </h2>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.label}
                  href="/catalogo"
                  className="group flex min-h-[120px] flex-col justify-between rounded-[7px] border border-[#1D2E4B]/10 bg-[#F7F3EC] p-4 transition hover:-translate-y-1 hover:border-[#D8C9B3] hover:shadow-sm"
                >

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEE6DA] text-[#1D2E4B]">
                    <Icon size={17} />
                  </div>

                  <p className="mt-5 text-[12px] font-bold leading-4 text-[#1D2E4B]">
                    {category.label}
                  </p>

                </Link>
              );
            })}

          </div>

        </div>

      </div>

    </section>
  );
}