import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  ["Psicoanálisis", "148 títulos"],
  ["Psicología", "96 títulos"],
  ["Clínica", "72 títulos"],
  ["Filosofía", "61 títulos"],
  ["Cultura", "45 títulos"],
  ["Infancia", "38 títulos"],
];

export default function Categories() {
  return (
    <section className="bg-[#1238E8] py-24 text-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#D8C9B3]">
            Explora
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
            Encuentra una lectura para cada pregunta.
          </h2>

          <div className="mt-5 h-1 w-14 rounded-full bg-[#E51E35]" />
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(([name, count]) => (
            <Link
              key={name}
              href={`/catalogo?categoria=${encodeURIComponent(name)}`}
              className="group flex min-h-40 flex-col justify-between rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur transition hover:-translate-y-1 hover:bg-white hover:text-[#1238E8]"
            >
              <div className="flex justify-between">
                <span className="text-sm opacity-60">
                  {count}
                </span>

                <ArrowRight
                  size={19}
                  className="transition group-hover:translate-x-1"
                />
              </div>

              <h3 className="text-2xl font-black tracking-[-0.03em]">
                {name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}