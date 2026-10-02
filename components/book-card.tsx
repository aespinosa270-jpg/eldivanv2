import Link from "next/link";
import type { Book } from "@/lib/types";

const covers = [
  "#0D1A30",
  "#182B49",
  "#CDBB9F",
  "#12223D",
  "#263F62",
  "#E2D5C3",
];

export default function BookCard({
  book,
  index,
}: {
  book: Book;
  index: number;
}) {
  const background = covers[index % covers.length];
  const lightCover =
    background === "#CDBB9F" ||
    background === "#E2D5C3";

  const primary =
    book.lifeStages[0] ??
    book.clinicalTopics[0] ??
    book.theoreticalOrientations[0];

  return (
    <article className="group">
      <Link href={`/libro/${book.slug}`}>
        <div
          className="relative aspect-[.72] overflow-hidden rounded-[5px] p-6 shadow-[0_12px_35px_rgba(9,19,38,.10)] transition duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_28px_60px_rgba(9,19,38,.18)]"
          style={{ backgroundColor: background }}
        >
          <div
            className={`flex h-full flex-col justify-between border p-5 ${
              lightCover
                ? "border-[#091326]/15 text-[#091326]"
                : "border-white/15 text-white"
            }`}
          >
            <div>
              <p
                className={`text-[9px] font-black uppercase tracking-[.22em] ${
                  lightCover
                    ? "text-[#091326]/55"
                    : "text-[#DED1BD]"
                }`}
              >
                {primary}
              </p>

              {book.isNew && (
                <span
                  className={`mt-4 inline-block border-b pb-1 text-[9px] font-bold uppercase tracking-[.2em] ${
                    lightCover
                      ? "border-[#091326]/30"
                      : "border-[#CDBB9F]/60"
                  }`}
                >
                  Novedad
                </span>
              )}
            </div>

            <div>
              <h3 className="editorial-serif text-[31px] leading-[.96] tracking-[-.04em]">
                {book.title}
              </h3>

              <p
                className={`mt-5 text-xs ${
                  lightCover
                    ? "text-[#091326]/60"
                    : "text-white/55"
                }`}
              >
                {book.author}
              </p>
            </div>
          </div>
        </div>
      </Link>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold text-[#12223D]">
            {book.author}
          </p>

          <p className="mt-1 text-xs text-[#12223D]/45">
            {book.publisher} · {book.year}
          </p>
        </div>

        <p className="text-sm font-bold text-[#12223D]">
          ${book.price.toLocaleString("es-MX")}
        </p>
      </div>
    </article>
  );
}