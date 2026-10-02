import Header from "@/components/header";
import CatalogBrowser from "@/components/catalog-browser";
import Footer from "@/components/footer";
import { getCatalogBooks } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  const catalogBooks = await getCatalogBooks();
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#F7F3EC]">

        <section className="border-b border-[#1D2E4B]/10 bg-white">

          <div className="page-shell py-7">

            <p className="text-[9px] font-black uppercase tracking-[.2em] text-[#1D2E4B]/40">
              El Diván
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <h1 className="editorial-serif text-[38px] tracking-[-.035em] text-[#1D2E4B] sm:text-[46px]">
                  Catálogo
                </h1>

                <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#1D2E4B]/50">
                  Busca por etapa del desarrollo, tema clínico,
                  orientación teórica, autor o editorial.
                </p>

              </div>

            </div>

          </div>

        </section>

        <CatalogBrowser books={catalogBooks} />

      </main>

      <Footer />
    </>
  );
}
