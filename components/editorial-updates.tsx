import Link from "next/link";
import { ArrowRight, FileText, Camera as Instagram, Newspaper } from "lucide-react";
import type { ContentPost } from "@/lib/admin-data";

const labels = { articulo: "Artículo", noticia: "Noticia", instagram: "Instagram" };
const icons = { articulo: FileText, noticia: Newspaper, instagram: Instagram };
export default function EditorialUpdates({ posts }: { posts: ContentPost[] }) {
  if (!posts.length) return null;
  return <section className="editorial-updates"><div className="page-shell"><div className="editorial-updates-head"><div><p className="admin-eyebrow">DEL DIVÁN A TU BIBLIOTECA</p><h2 className="editorial-serif">Ideas y novedades</h2></div><Link href="/noticias">Ver todas <ArrowRight size={14}/></Link></div><div className="editorial-updates-grid">{posts.slice(0,3).map(post=>{const Icon=icons[post.kind];return <article key={post.id}><span><Icon size={14}/>{labels[post.kind]}</span><h3 className="editorial-serif"><Link href={`/noticias/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p><Link className="editorial-update-link" href={`/noticias/${post.slug}`}>Leer publicación <ArrowRight size={13}/></Link></article>})}</div></div></section>;
}

