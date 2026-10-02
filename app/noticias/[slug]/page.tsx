import Link from "next/link";
import { ArrowLeft, ExternalLink, Camera as Instagram } from "lucide-react";
import { notFound } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { getPublishedPost } from "@/lib/admin-data";

export const dynamic = "force-dynamic";
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  return <><Header/><main className="min-h-[70vh] bg-[#F7F3EC] py-8"><article className="news-article"><Link href="/noticias" className="news-back"><ArrowLeft size={14}/> Todas las noticias</Link><p className="admin-eyebrow">{post.kind === "articulo" ? "ARTÍCULO" : post.kind === "noticia" ? "NOTICIA" : "DESDE INSTAGRAM"}</p><h1 className="editorial-serif">{post.title}</h1><p className="news-article-excerpt">{post.excerpt}</p><div className="news-article-body">{post.content.split(/\n{2,}/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>{post.kind === "instagram"&&<a className="news-instagram-link" href={post.sourceUrl} target="_blank" rel="noreferrer">Abrir publicación en Instagram <Instagram size={14}/><ExternalLink size={12}/></a>}</article></main><Footer/></>;
}


