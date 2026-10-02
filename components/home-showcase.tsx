import Link from "next/link";
import {
  ArrowRight,
  Heart,
} from "lucide-react";

import { books } from "@/data/books";

const authors = [
  ["SF", "Sigmund Freud"],
  ["JL", "Jacques Lacan"],
  ["MK", "Melanie Klein"],
  ["DW", "Donald W. Winnicott"],
  ["WB", "Wilfred Bion"],
  ["DM", "Donald Meltzer"],
];

const covers = [
  "#1D2E4B",
  "#D8C9B3",
  "#EEE6DA",
  "#2C4263",
  "#C5B394",
];

export default function HomeShowcase() {
  return (
    <section className="bg-[#F7F3EC] py-8">
      <div className="page-shell">

        <div className="grid gap-8 xl:grid-cols-[1.28fr_.72fr_.88fr]">

          {/* NOVEDADES */}

          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="editorial-serif text-[24px] text-[#1D2E4B]">
                Novedades editoriales
              </h2>

              <Link
                href="/catalogo?new=true"
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#1D2E4B]/60"
              >
                Ver todas
                <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">

              {books.slice(0, 5).map((book, index) => (
                <article key={book.id} className="group">

                  <Link href={`/libro/${book.slug}`}>
                    <div
                      className="relative flex h-[205px] flex-col justify-between rounded-[2px] p-4 shadow-[0_8px_24px_rgba(29,46,75,.10)] transition group-hover:-translate-y-1"
                      style={{
                        backgroundColor: covers[index % covers.length],
                        color:
                          index === 1 || index === 2 || index === 4
                            ? "#1D2E4B"
                            : "#FFFFFF",
                      }}
                    >
                      <Heart
                        size={13}
                        className="absolute right-3 top-3 opacity-55"
                      />

                      <p className="max-w-[90%] text-[8px] font-bold uppercase tracking-[.15em] opacity-60">
                        {book.author}
                      </p>

                      <p className="editorial-serif text-[18px] leading-[.95]">
                        {book.title}
                      </p>
                    </div>
                  </Link>

                  <p className="mt-3 line-clamp-2 text-[11px] font-semibold leading-4 text-[#1D2E4B]">
                    {book.title}
                  </p>

                  <p className="mt-1 text-[9px] text-[#1D2E4B]/45">
                    {book.author}
                  </p>

                  <p className="mt-2 text-[10px] font-bold text-[#1D2E4B]">
                    ${book.price.toLocaleString("es-MX")} MXN
                  </p>

                </article>
              ))}

            </div>
          </section>


          {/* AUTORES */}

          <section className="border-l-0 border-[#1D2E4B]/10 xl:border-l xl:pl-8">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="editorial-serif text-[24px] text-[#1D2E4B]">
                Autores esenciales
              </h2>

              <Link
                href="/autores"
                className="text-[10px] font-bold uppercase tracking-[.12em] text-[#1D2E4B]/55"
              >
                Ver todos
              </Link>

            </div>

            <div className="grid grid-cols-3 gap-x-5 gap-y-7">

              {authors.map(([initials, name]) => (
                <Link
                  key={name}
                  href={`/autores`}
                  className="group text-center"
                >

                  <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full border border-[#1D2E4B]/15 bg-[#EEE6DA]">

                    <span className="editorial-serif text-[20px] text-[#1D2E4B]/75">
                      {initials}
                    </span>

                  </div>

                  <p className="mt-2 text-[9px] font-semibold leading-3 text-[#1D2E4B]">
                    {name}
                  </p>

                </Link>
              ))}

            </div>

          </section>


          {/* ARTÍCULO EDITORIAL */}

          <section className="bg-[#EEE6DA] p-6">

            <p className="text-[9px] font-bold uppercase tracking-[.2em] text-[#8E7858]">
              Del diván al pensamiento
            </p>

            <div className="mt-5 grid grid-cols-[1.1fr_.9fr] gap-5">

              <div>

                <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#A28A67]">
                  Artículo editorial
                </p>

                <h2 className="editorial-serif mt-3 text-[25px] leading-[1.02] text-[#1D2E4B]">
                  Transferencia, repetición y elaboración:
                  pensar la clínica contemporánea
                </h2>

                <p className="mt-4 text-[11px] leading-5 text-[#1D2E4B]/55">
                  Una lectura desde la clínica actual y la tradición
                  psicoanalítica.
                </p>

                <Link
                  href="/blog"
                  className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold text-[#1D2E4B]"
                >
                  Leer artículo
                  <ArrowRight size={12} />
                </Link>

              </div>


              {/* ILUSTRACIÓN ABSTRACTA DEL DIVÁN */}

              <div className="relative min-h-[210px] overflow-hidden bg-[#D8C9B3]">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.35),transparent_45%)]" />

                <div className="absolute bottom-[52px] left-[16%] h-[38px] w-[68%] rounded-[40px_8px_8px_40px] bg-[#1D2E4B]" />

                <div className="absolute bottom-[85px] left-[15%] h-[56px] w-[24px] -rotate-[30deg] rounded-full bg-[#1D2E4B]" />

                <div className="absolute bottom-[37px] left-[25%] h-[20px] w-[5px] rotate-[17deg] bg-[#1D2E4B]" />

                <div className="absolute bottom-[37px] right-[24%] h-[20px] w-[5px] -rotate-[17deg] bg-[#1D2E4B]" />

              </div>

            </div>

          </section>

        </div>
      </div>
    </section>
  );
}