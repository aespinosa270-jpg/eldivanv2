import Link from "next/link";
import { ArrowRight, FileText, Camera as Instagram, Newspaper } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getPublishedPosts } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
const icons = { articulo: FileText, noticia: Newspaper, instagram: Instagram };
const labels = { articulo: "Artículo", noticia: "Noticias", instagram: "Desde Instagram" };
export default async function NewsPage() {
  const posts = await getPublishedPosts();
  return <><Header/><main className="min-h-[70vh] bg-[#F7F3EC]"><section className="border-b border-[#1D2E4B]/10 bg-white"><div className="page-shell py-9"><p className="admin-eyebrow">EL DIVÁN · IDEAS Y ACTUALIDAD</p><h1 className="editorial-serif mt-2 text-4xl text-[#1D2E4B] sm:text-5xl">Noticias y lecturas</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[#1D2E4B]/55">Artículos, novedades editoriales y publicaciones seleccionadas de nuestra comunidad.</p></div></section><div className="page-shell py-8">{posts.length?<div className="news-grid">{posts.map((post)=>{const Icon=icons[post.kind];return <article className="news-card" key={post.id}><span className="news-card-kind"><Icon size={15}/>{labels[post.kind]}</span><h2 className="editorial-serif"><Link href={`/noticias/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="news-card-link" href={`/noticias/${post.slug}`}>Leer más <ArrowRight size={14}/></Link>{post.kind==="instagram"&&<a className="news-instagram-link" href={post.sourceUrl} target="_blank" rel="noreferrer">Ver en Instagram <Instagram size={13}/></a>}</article>})}</div>:<div className="news-empty"><p className="admin-eyebrow">PRÓXIMAMENTE</p><h2 className="editorial-serif">Nuevas ideas para compartir</h2><p>Estamos preparando artículos, novedades y noticias editoriales.</p></div>}</div></main><Footer/></>;
}

