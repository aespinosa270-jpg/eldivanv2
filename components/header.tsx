import Image from "next/image";
import Link from "next/link";

import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
} from "lucide-react";
import CartCount from "@/components/cart-count";

const secondaryNav = [
  { label: "Todo el catálogo", href: "/catalogo" },
  { label: "Etapa de vida", href: "/catalogo" },
  { label: "Temas clínicos", href: "/catalogo" },
  { label: "Teoría y corrientes", href: "/catalogo" },
  { label: "Autores", href: "/autores" },
  { label: "Editoriales", href: "/editoriales" },
  { label: "Novedades", href: "/catalogo" },
  { label: "Noticias", href: "/noticias" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#1D2E4B] text-white shadow-lg shadow-black/10">

      {/* FILA PRINCIPAL */}

      <div className="page-shell flex min-h-[82px] items-center gap-6 py-3">

        <Link
          href="/"
          aria-label="El Diván Mundo Psicoanalítico"
          className="shrink-0"
        >
          <Image
            src="/logo-el-divan.png"
            alt="El Diván Mundo Psicoanalítico"
            width={500}
            height={180}
            priority
            className="h-[58px] w-auto object-contain"
          />
        </Link>


        {/* BUSCADOR MARKETPLACE */}

        <form
          action="/catalogo"
          className="hidden min-w-0 flex-1 lg:block"
        >
          <div className="flex h-[48px] overflow-hidden rounded-[7px] bg-white shadow-sm">

            <input
              type="search"
              name="q"
              placeholder="Buscar libros, autores, editoriales, temas clínicos..."
              className="min-w-0 flex-1 bg-white px-5 text-sm text-[#1D2E4B] outline-none placeholder:text-[#1D2E4B]/40"
            />

            <button
              type="submit"
              aria-label="Buscar"
              className="flex w-[56px] items-center justify-center bg-[#D8C9B3] text-[#1D2E4B] transition hover:bg-[#C9B798]"
            >
              <Search size={20} />
            </button>

          </div>
        </form>


        {/* ACCIONES */}

        <div className="ml-auto flex items-center gap-1">

          <Link
            href="/cuenta"
            className="hidden min-h-11 items-center gap-2 rounded-lg px-3 transition hover:bg-white/10 sm:flex"
          >
            <UserRound size={19} />

            <div className="hidden xl:block">
              <p className="text-xs font-bold">
                Mi cuenta
              </p>
            </div>
          </Link>

          <Link
            href="/favoritos"
            aria-label="Favoritos"
            className="flex h-11 w-11 items-center justify-center rounded-lg transition hover:bg-white/10"
          >
            <Heart size={19} />
          </Link>

          <Link
            href="/carrito"
            className="relative flex min-h-11 items-center gap-2 rounded-lg px-3 transition hover:bg-white/10"
          >
            <div className="relative">
              <ShoppingBag size={21} />

              <CartCount />
            </div>

            <span className="hidden text-xs font-bold xl:block">
              Carrito
            </span>
          </Link>

          <button
            type="button"
            aria-label="Menú"
            className="flex h-11 w-11 items-center justify-center lg:hidden"
          >
            <Menu size={22} />
          </button>

        </div>

      </div>


      {/* BUSCADOR MOBILE */}

      <div className="page-shell pb-3 lg:hidden">

        <form action="/catalogo">

          <div className="flex h-11 overflow-hidden rounded-md bg-white">

            <input
              type="search"
              name="q"
              placeholder="Buscar en El Diván..."
              className="min-w-0 flex-1 px-4 text-sm text-[#1D2E4B] outline-none"
            />

            <button
              type="submit"
              className="flex w-12 items-center justify-center bg-[#D8C9B3] text-[#1D2E4B]"
            >
              <Search size={18} />
            </button>

          </div>

        </form>

      </div>


      {/* SEGUNDA NAVEGACIÓN */}

      <div className="border-t border-white/10 bg-[#13223A]">

        <nav className="page-shell flex h-[43px] items-center gap-7 overflow-x-auto whitespace-nowrap">

          {secondaryNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[11px] font-semibold text-white/70 transition hover:text-[#D8C9B3]"
            >
              {item.label}
            </Link>
          ))}

        </nav>

      </div>

    </header>
  );
}
