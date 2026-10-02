import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
} from "lucide-react";
import type { SiteSettings } from "@/lib/admin-data";

const accents = { beige: "#D8C9B3", olive: "#B8C7A5", rose: "#D6B6B3" };
export default function Hero({ settings }: { settings: SiteSettings["hero"] }) {
  return (
    <section className="bg-[#F7F3EC] pt-6">

      <div className="page-shell">

        <div className="relative overflow-hidden rounded-[10px] bg-[linear-gradient(120deg,#13223A_0%,#1D2E4B_58%,#2C4263_100%)] text-white shadow-[0_12px_30px_rgba(29,46,75,.12)]">

          <div className="absolute -right-28 -top-32 h-[420px] w-[420px] rounded-full border-[75px] border-[#D8C9B3]/[0.05]" />

          <div className="grid min-h-[330px] items-center lg:grid-cols-[.95fr_1.05fr]">

            <div className="relative z-10 px-8 py-12 sm:px-12">

              <p className="text-[9px] font-black uppercase tracking-[.25em] text-[#D8C9B3]">
                El Diván · Librería especializada
              </p>

              <h1 className="editorial-serif mt-4 max-w-[590px] text-[42px] leading-[1] tracking-[-.045em] sm:text-[54px]">
                <span style={{ color: accents[settings.accent] }}>{settings.title}</span>
              </h1>

              <p className="mt-5 max-w-[540px] text-[13px] leading-6 text-white/60">
                {settings.description}
              </p>

              <Link
                href="/catalogo"
                className="mt-7 inline-flex h-11 items-center gap-3 rounded-[5px] bg-[#D8C9B3] px-5 text-[11px] font-bold text-[#1D2E4B] transition hover:bg-[#EEE6DA]"
              >
                Explorar catálogo
                <ArrowRight size={14} />
              </Link>

            </div>


            <div className="relative hidden min-h-[330px] lg:block">

              <div className="absolute bottom-[-25px] left-[13%] flex h-[295px] w-[165px] -rotate-3 flex-col justify-between bg-[#EEE6DA] p-5 text-[#1D2E4B] shadow-2xl">

                <p className="editorial-serif text-lg">
                  Sigmund Freud
                </p>

                <div>
                  <BookOpen
                    size={20}
                    className="mb-5 text-[#B9A486]"
                  />

                  <p className="editorial-serif text-[27px] leading-[.95]">
                    La interpretación
                    <br />
                    de los sueños
                  </p>
                </div>

              </div>


              <div className="absolute bottom-[-15px] left-[40%] flex h-[285px] w-[160px] rotate-2 flex-col justify-between bg-[#D8C9B3] p-5 text-[#1D2E4B] shadow-2xl">

                <p className="editorial-serif text-lg">
                  Jacques Lacan
                </p>

                <p className="editorial-serif text-[27px] leading-[.95]">
                  El Seminario
                  <br />
                  Libro 11
                </p>

              </div>


              <div className="absolute bottom-[-20px] right-[8%] flex h-[300px] w-[170px] -rotate-1 flex-col justify-between bg-[#13223A] p-5 shadow-2xl">

                <p className="editorial-serif text-lg text-[#D8C9B3]">
                  D. W. Winnicott
                </p>

                <p className="editorial-serif text-[29px] leading-[.95] text-white">
                  Realidad
                  <br />
                  y juego
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
