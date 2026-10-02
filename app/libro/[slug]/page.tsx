import { notFound } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BookGallery from "@/components/book-gallery";
import AddToCartButton from "@/components/add-to-cart-button";
import RestockForm from "@/components/restock-form";
import { getCatalogBooks } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const book = (await getCatalogBooks()).find((item) => item.slug === slug);
  if (!book) notFound();
  return <><Header/><main className="book-detail-page"><nav className="book-breadcrumb"><a href="/">Inicio</a> / <a href="/catalogo">Catálogo</a> / {book.title}</nav><section className="book-detail"><BookGallery book={book}/><div className="book-detail-info"><p className="admin-eyebrow">{book.publisher} · {book.year}</p><h1 className="editorial-serif">{book.title}</h1><p className="book-detail-author">Por {book.author}</p><p className="book-detail-description">{book.description}</p><div className="book-detail-tags">{[...book.lifeStages,...book.clinicalTopics,...book.theoreticalOrientations].map(tag=><span key={tag}>{tag}</span>)}</div></div><aside className="book-buy-box"><p className="admin-eyebrow">PRECIO</p><strong>${book.price.toLocaleString("es-MX")} <small>MXN</small></strong><p className={book.stock>0?"book-stock":"book-stock empty"}>{book.stock>0?`${book.stock} disponibles`:"Sin stock"}</p>{book.stock>0?<AddToCartButton bookId={book.id}/>:<RestockForm bookId={book.id}/>}</aside></section></main><Footer/></>;
}
