import Link from "next/link";

import {
  Heart,
} from "lucide-react";

import type { Book } from "@/lib/types";
import RestockForm from "@/components/restock-form";
import AddToCartButton from "@/components/add-to-cart-button";

const covers = [
  "#1D2E4B",
  "#D8C9B3",
  "#EEE6DA",
  "#2C4263",
  "#13223A",
  "#C7B394",
];

export default function ProductCard({
  book,
  index,
}: {
  book: Book;
  index: number;
}) {
  const background = covers[index % covers.length];

  const isLight =
    background === "#D8C9B3" ||
    background === "#EEE6DA" ||
    background === "#C7B394";

  const category =
    book.lifeStages[0] ??
    book.clinicalTopics[0] ??
    book.theoreticalOrientations[0];

  return (
    <article className="group relative flex h-full flex-col rounded-[8px] border border-[#1D2E4B]/10 bg-white p-3 transition hover:border-[#1D2E4B]/20 hover:shadow-[0_14px_40px_rgba(29,46,75,.11)]">

      <button
        type="button"
        aria-label="Agregar a favoritos"
        className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#1D2E4B] shadow-sm transition hover:bg-[#D8C9B3]"
      >
        <Heart size={15} />
      </button>


      <Link href={`/libro/${book.slug}`}>

        <div
          className="relative flex aspect-[.74] flex-col justify-between overflow-hidden rounded-[4px] p-5"
          style={{
            backgroundColor: background,
            color: isLight ? "#1D2E4B" : "#FFFFFF",
          }}
        >

          {book.coverImage ? <img src={book.coverImage} alt={`Portada de ${book.title}`} className="absolute inset-0 h-full w-full bg-[#F7F3EC] object-contain" /> : <>

          <p
            className={`max-w-[85%] text-[8px] font-black uppercase leading-4 tracking-[.17em] ${
              isLight
                ? "text-[#1D2E4B]/55"
                : "text-[#D8C9B3]"
            }`}
          >
            {category}
          </p>

          <div>

            <h3 className="editorial-serif text-[25px] leading-[.95] tracking-[-.035em]">
              {book.title}
            </h3>

            <p
              className={`mt-4 text-[10px] ${
                isLight
                  ? "text-[#1D2E4B]/55"
                  : "text-white/55"
              }`}
            >
              {book.author}
            </p>

          </div>

          </>}

        </div>

      </Link>


      <div className="flex flex-1 flex-col pt-4">

        <Link
          href={`/libro/${book.slug}`}
          className="line-clamp-2 text-[13px] font-bold leading-5 text-[#1D2E4B] transition hover:underline"
        >
          {book.title}
        </Link>

        <p className="mt-1 text-[11px] text-[#1D2E4B]/55">
          {book.author}
        </p>

        <p className="mt-1 text-[10px] text-[#1D2E4B]/40">
          {book.publisher}
        </p>


        <div className="mt-auto pt-4">

          {book.isNew && (
            <span className="mb-2 inline-block rounded-sm bg-[#EEE6DA] px-2 py-1 text-[8px] font-black uppercase tracking-[.12em] text-[#1D2E4B]">
              Novedad
            </span>
          )}

          <div className="flex items-end justify-between gap-3">

            <div>
              <p className="text-[20px] font-black tracking-[-.04em] text-[#1D2E4B]">
                ${book.price.toLocaleString("es-MX")}
              </p>

              <p
                className={`mt-1 text-[9px] font-bold ${
                  book.stock > 0
                    ? "text-[#52705B]"
                    : "text-[#8B5C5C]"
                }`}
              >
                {book.stock > 0
                  ? `${book.stock} disponibles`
                  : "Sin stock"}
              </p>
            </div>

            {book.stock > 0 ? <AddToCartButton bookId={book.id}/> : <span className="rounded-full bg-[#F7F3EC] px-2 py-1 text-[8px] font-bold text-[#8B5C5C]">Agotado</span>}

          </div>
          {book.stock === 0 && <RestockForm bookId={book.id} />}

        </div>

      </div>

    </article>
  );
}


