"use client";

import { useMemo, useState } from "react";

import {
  Search,
  SlidersHorizontal,
} from "lucide-react";

import ProductCard from "@/components/product-card";

import type { Book } from "@/lib/types";

import {
  clinicalTopics,
  lifeStages,
  theoreticalOrientations,
} from "@/data/catalog-taxonomy";

type SortValue =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest";

export default function CatalogBrowser({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [topic, setTopic] = useState("");
  const [theory, setTheory] = useState("");
  const [publisher, setPublisher] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState<SortValue>("featured");

  const publishers = Array.from(
    new Set(books.map((book) => book.publisher))
  ).sort();

  const filtered = useMemo(() => {
    const normalized = query
      .trim()
      .toLowerCase();

    let result = books.filter((book) => {
      const searchable = [
        book.title,
        book.author,
        book.publisher,
        book.description,
        ...book.lifeStages,
        ...book.clinicalTopics,
        ...book.theoreticalOrientations,
      ]
        .join(" ")
        .toLowerCase();

      if (
        normalized &&
        !searchable.includes(normalized)
      ) {
        return false;
      }

      if (
        stage &&
        !book.lifeStages.includes(stage as never)
      ) {
        return false;
      }

      if (
        topic &&
        !book.clinicalTopics.includes(topic as never)
      ) {
        return false;
      }

      if (
        theory &&
        !book.theoreticalOrientations.includes(
          theory as never
        )
      ) {
        return false;
      }

      if (
        publisher &&
        book.publisher !== publisher
      ) {
        return false;
      }

      if (
        availableOnly &&
        !book.available
      ) {
        return false;
      }

      if (
        newOnly &&
        !book.isNew
      ) {
        return false;
      }

      return true;
    });

    result = [...result];

    if (sort === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "newest") {
      result.sort((a, b) => b.year - a.year);
    }

    if (sort === "featured") {
      result.sort(
        (a, b) =>
          Number(Boolean(b.featured)) -
          Number(Boolean(a.featured))
      );
    }

    return result;
  }, [
    query,
    stage,
    topic,
    theory,
    publisher,
    availableOnly,
    newOnly,
    sort,
  ]);

  return (
    <div className="page-shell py-8">

      {/* SEARCH / SORT */}

      <div className="mb-6 flex flex-col gap-3 rounded-[8px] border border-[#1D2E4B]/10 bg-white p-4 market-shadow lg:flex-row lg:items-center">

        <div className="flex h-11 min-w-0 flex-1 items-center rounded-[5px] border border-[#1D2E4B]/15 bg-white">

          <Search
            size={17}
            className="ml-4 text-[#1D2E4B]/40"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Buscar en el catálogo..."
            className="min-w-0 flex-1 bg-transparent px-3 text-sm text-[#1D2E4B] outline-none"
          />

        </div>

        <select
          value={sort}
          onChange={(event) =>
            setSort(
              event.target.value as SortValue
            )
          }
          className="h-11 rounded-[5px] border border-[#1D2E4B]/15 bg-white px-4 text-xs text-[#1D2E4B] outline-none"
        >
          <option value="featured">
            Destacados
          </option>

          <option value="newest">
            Más recientes
          </option>

          <option value="price-asc">
            Precio: menor a mayor
          </option>

          <option value="price-desc">
            Precio: mayor a menor
          </option>
        </select>

      </div>


      <div className="grid gap-7 lg:grid-cols-[245px_1fr]">

        {/* SIDEBAR */}

        <aside className="h-fit rounded-[8px] border border-[#1D2E4B]/10 bg-white p-5 market-shadow">

          <div className="mb-6 flex items-center gap-2">

            <SlidersHorizontal size={16} />

            <p className="text-sm font-black text-[#1D2E4B]">
              Filtros
            </p>

          </div>


          <FilterSelect
            label="Etapa del desarrollo"
            value={stage}
            onChange={setStage}
            options={lifeStages.map(
              (item) => item.name
            )}
          />

          <FilterSelect
            label="Tema clínico"
            value={topic}
            onChange={setTopic}
            options={clinicalTopics}
          />

          <FilterSelect
            label="Teoría y corriente"
            value={theory}
            onChange={setTheory}
            options={theoreticalOrientations}
          />

          <FilterSelect
            label="Editorial"
            value={publisher}
            onChange={setPublisher}
            options={publishers}
          />


          <div className="mt-6 space-y-4 border-t border-[#1D2E4B]/10 pt-5">

            <label className="flex cursor-pointer items-center gap-3 text-xs text-[#1D2E4B]/75">

              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) =>
                  setAvailableOnly(
                    event.target.checked
                  )
                }
                className="accent-[#1D2E4B]"
              />

              Sólo disponibles

            </label>

            <label className="flex cursor-pointer items-center gap-3 text-xs text-[#1D2E4B]/75">

              <input
                type="checkbox"
                checked={newOnly}
                onChange={(event) =>
                  setNewOnly(
                    event.target.checked
                  )
                }
                className="accent-[#1D2E4B]"
              />

              Sólo novedades

            </label>

          </div>


          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStage("");
              setTopic("");
              setTheory("");
              setPublisher("");
              setAvailableOnly(false);
              setNewOnly(false);
            }}
            className="mt-6 w-full rounded-[5px] border border-[#1D2E4B]/15 py-2.5 text-[10px] font-bold uppercase tracking-[.12em] text-[#1D2E4B]"
          >
            Limpiar filtros
          </button>

        </aside>


        {/* RESULTS */}

        <section>

          <div className="mb-5 flex items-center justify-between">

            <p className="text-sm font-bold text-[#1D2E4B]">
              {filtered.length} títulos
            </p>

            <p className="hidden text-[10px] text-[#1D2E4B]/40 sm:block">
              Catálogo multidimensional El Diván
            </p>

          </div>

          {filtered.length > 0 ? (

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">

              {filtered.map((book, index) => (
                <ProductCard
                  key={book.id}
                  book={book}
                  index={index}
                />
              ))}

            </div>

          ) : (

            <div className="rounded-[8px] bg-white px-6 py-20 text-center market-shadow">

              <p className="editorial-serif text-[28px] text-[#1D2E4B]">
                No encontramos títulos
              </p>

              <p className="mt-3 text-sm text-[#1D2E4B]/50">
                Prueba cambiando o eliminando alguno de los filtros.
              </p>

            </div>

          )}

        </section>

      </div>

    </div>
  );
}


function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="mb-5">

      <label className="mb-2 block text-[10px] font-black uppercase tracking-[.13em] text-[#1D2E4B]/55">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 w-full rounded-[4px] border border-[#1D2E4B]/15 bg-white px-3 text-[11px] text-[#1D2E4B] outline-none"
      >
        <option value="">
          Todos
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}
