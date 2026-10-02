import Image from "next/image";
import Link from "next/link";
import CookiePreferencesButton from "@/components/cookie-preferences-button";

export default function Footer() {
  return (
    <footer className="bg-[#1D2E4B] text-white">
      <div className="page-shell py-16">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.4fr_.6fr_.6fr]">
          <div>
            <Image
              src="/logo-el-divan.png"
              alt="El Diván Mundo Psicoanalítico"
              width={420}
              height={150}
              className="h-[76px] w-auto object-contain"
            />

            <p className="mt-6 max-w-md text-sm leading-7 text-white/50">
              Librería especializada en psicoanálisis, clínica y pensamiento
              contemporáneo.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#CDBB9F]">
              Explorar
            </p>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/55">
              <Link href="/catalogo">Catálogo</Link>
              <Link href="/autores">Autores</Link>
              <Link href="/noticias">Noticias y blog</Link>
              <Link href="/catalogo?new=true">
                Novedades
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#CDBB9F]">
              El Diván
            </p>

            <div className="mt-6 flex flex-col gap-4 text-sm text-white/55">
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/contacto">Contacto</Link>
              <Link href="/politica-de-cookies">Política de cookies</Link>
              <CookiePreferencesButton />
              
              <Link href="/aviso-de-privacidad">Aviso de privacidad</Link>
              <Link href="/terminos-y-condiciones">Términos y condiciones</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-7 text-[10px] uppercase tracking-[.12em] text-white/30 sm:flex-row sm:justify-between">
          <p>© 2026 El Diván Mundo Psicoanalítico</p>

          <p>Psicoanálisis · Clínica · Pensamiento contemporáneo</p>
        </div>
      </div>
    </footer>
  );
}

