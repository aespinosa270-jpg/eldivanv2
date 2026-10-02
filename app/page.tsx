import Header from "@/components/header";
import Hero from "@/components/hero";
import MarketplaceCategories from "@/components/marketplace-categories";
import MarketplaceShelf from "@/components/marketplace-shelf";
import Newsletter from "@/components/newsletter";
import Footer from "@/components/footer";
import PromotionBanner from "@/components/promotion-banner";
import EditorialUpdates from "@/components/editorial-updates";

import { getCatalogBooks, getPublishedPosts, getSiteSettings } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [books, settings, posts] = await Promise.all([getCatalogBooks(), getSiteSettings(), getPublishedPosts()]);
  const newBooks = books.filter((book) => book.isNew);

  const featuredBooks = books.filter(
    (book) => book.featured
  );

  const childhoodBooks = books.filter((book) =>
    book.lifeStages.some((stage) =>
      [
        "Bebés y primera infancia",
        "Infancia",
        "Adolescencia",
      ].includes(stage)
    )
  );

  const theoryBooks = books.filter(
    (book) =>
      book.theoreticalOrientations.length > 0
  );

  return (
    <>
      <Header />
      <PromotionBanner promotion={settings.promotion}/>

      <main className="bg-[#F7F3EC] pb-7">

        <Hero settings={settings.hero}/>

        <MarketplaceCategories />

        <MarketplaceShelf
          title="Novedades"
          subtitle="Los títulos más recientes del catálogo"
          books={newBooks.length ? newBooks : books}
        />

        <MarketplaceShelf
          title="Selección El Diván"
          subtitle="Una selección editorial para comenzar a explorar"
          books={featuredBooks.length ? featuredBooks : books}
        />

        <MarketplaceShelf
          title="Infancia y adolescencia"
          subtitle="Clínica, desarrollo, vínculos y problemáticas contemporáneas"
          books={childhoodBooks.length ? childhoodBooks : books}
        />

        <MarketplaceShelf
          title="Teoría y corrientes"
          subtitle="Freud, Klein, Bion, Winnicott, Lacan, Meltzer y desarrollos contemporáneos"
          books={theoryBooks.length ? theoryBooks : books}
        />

        <EditorialUpdates posts={posts}/>

        <Newsletter />

      </main>

      <Footer />
    </>
  );
}
