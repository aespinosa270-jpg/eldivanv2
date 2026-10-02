import Link from "next/link";
import {
  ArrowUpRight,
  Baby,
  Brain,
  LibraryBig,
} from "lucide-react";

const paths = [
  {
    number: "01",
    title: "Etapa del desarrollo",
    description:
      "Explora desde prenatalidad y primera infancia hasta adolescencia, adultez y vínculos familiares.",
    href: "/catalogo?view=development",
    icon: Baby,
  },
  {
    number: "02",
    title: "Temas clínicos",
    description:
      "Autismo, psicosis, trauma, duelo, estados límite, adicciones, cuerpo, sexualidad y más.",
    href: "/catalogo?view=clinical",
    icon: Brain,
  },
  {
    number: "03",
    title: "Teoría y corrientes",
    description:
      "Freud, Klein, Bion, Winnicott, Lacan, Meltzer y desarrollos contemporáneos.",
    href: "/catalogo?view=theory",
    icon: LibraryBig,
  },
];

export default function CatalogPaths() {
  return (
    <section className="bg-white py-20">
      <div className="page-shell">
        <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[.24em] text-[#263F62]">
              Encuentra tu lectura
            </p>

            <h2 className="editorial-serif mt-5 text-[48px] leading-[1] tracking-[-.045em] text-[#091326] sm:text-[58px]">
              Tres maneras
              <br />
              de entrar al catálogo.
            </h2>

            <p className="mt-6 max-w-md leading-7 text-[#12223D]/60">
              Un mismo libro puede aparecer en diferentes recorridos para que
              puedas encontrarlo según tu práctica, interés o marco teórico.
            </p>
          </div>

          <div className="border-t border-[#12223D]/15">
            {paths.map((path) => {
              const Icon = path.icon;

              return (
                <Link
                  key={path.number}
                  href={path.href}
                  className="group grid gap-5 border-b border-[#12223D]/15 py-8 transition sm:grid-cols-[60px_54px_1fr_44px] sm:items-center"
                >
                  <span className="text-xs font-bold tracking-[.18em] text-[#12223D]/35">
                    {path.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE4D7] text-[#12223D] transition group-hover:bg-[#12223D] group-hover:text-white">
                    <Icon size={20} />
                  </div>

                  <div>
                    <h3 className="editorial-serif text-[27px] text-[#091326]">
                      {path.title}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#12223D]/55">
                      {path.description}
                    </p>
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-[#12223D]/35 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#12223D]"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}