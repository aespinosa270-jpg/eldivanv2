import Link from "next/link";

import { ChevronRight } from "lucide-react";

import ProductCard from "@/components/product-card";

import type { Book } from "@/lib/types";

type Props = {
  title: string;
  subtitle?: string;
  books: Book[];
};

export default function MarketplaceShelf({
  title,
  subtitle,
  books,
}: Props) {
  return (
    <section className="bg-[#F7F3EC] py-7">

      <div className="page-shell rounded-[10px] bg-white px-5 py-6 market-shadow sm:px-7">

        <div className="mb-6 flex items-end justify-between gap-5">

          <div>
            <h2 className="editorial-serif text-[28px] text-[#1D2E4B]">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-[11px] text-[#1D2E4B]/45">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href="/catalogo"
            className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-[#1D2E4B] hover:underline"
          >
            Ver más
            <ChevronRight size={14} />
          </Link>

        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">

          {books.slice(0, 6).map((book, index) => (
            <ProductCard
              key={`${title}-${book.id}`}
              book={book}
              index={index}
            />
          ))}

        </div>

      </div>

    </section>
  );
}