"use client";

import { useMemo, useState } from "react";
import { ExternalLink, FileText, Camera as Instagram, Newspaper, Plus, Save, Trash2, X } from "lucide-react";
import type { ContentPost } from "@/lib/admin-data";

type Draft = { id?: string; kind: ContentPost["kind"]; title: string; slug: string; excerpt: string; content: string; sourceUrl: string; status: ContentPost["status"] };
const empty: Draft = { kind: "articulo", title: "", slug: "", excerpt: "", content: "", sourceUrl: "", status: "borrador" };
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const icons = { articulo: FileText, noticia: Newspaper, instagram: Instagram };
const labels = { articulo: "Artículo", noticia: "Noticia", instagram: "Instagram" };

export default function AdminContent({ initialPosts }: { initialPosts: ContentPost[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const filtered = useMemo(() => posts.filter((post) => `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase())), [posts, query]);
  function patch<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft((current) => current ? { ...current, [key]: value } : current); }
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!draft) return;
    setBusy(true); setError(""); setNotice("");
    const response = await fetch("/api/admin/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...draft, slug: slugify(draft.slug || draft.title) }) });
    const result = await response.json(); setBusy(false);
    if (!response.ok) { setError(result.error || "No se pudo guardar."); return; }
    setPosts((current) => [result.post, ...current.filter((post) => post.id !== result.post.id)]);
    setDraft(null); setNotice(result.post.status === "publicado" ? "Publicado en la tienda." : "Borrador guardado.");
  }
  async function remove(post: ContentPost) {
    if (!window.confirm(`¿Eliminar “${post.title}”?`)) return;
    const response = await fetch(`/api/admin/content?id=${encodeURIComponent(post.id)}`, { method: "DELETE" });
    if (!response.ok) { setError("No se pudo eliminar la publicación."); return; }
    setPosts((current) => current.filter((item) => item.id !== post.id)); setNotice("Publicación eliminada.");
  }
  return <div className="admin-content-page"><div className="admin-heading"><div><p className="admin-eyebrow">BLOG, NOTICIAS E INSTAGRAM</p><h1 className="editorial-serif">Contenido</h1><p className="admin-muted">Publica artículos, noticias y enlaces seleccionados de Instagram en tu tienda.</p></div><button className="admin-primary" onClick={() => { setError(""); setDraft({ ...empty }); }}><Plus size={16}/> Nueva publicación</button></div>{notice&&<div className="admin-notice">{notice}</div>}{error&&<p className="admin-error" role="alert">{error}</p>}<div className="admin-toolbar"><label className="admin-search"><input placeholder="Buscar publicaciones" value={query} onChange={e=>setQuery(e.target.value)}/></label><span>{filtered.length} publicaciones</span></div><section className="admin-panel admin-content-list">{filtered.length ? filtered.map(post=>{const Icon=icons[post.kind];return <article key={post.id}><span className="admin-content-kind"><Icon size={17}/></span><div className="admin-content-copy"><span className="admin-content-meta">{labels[post.kind]} · {post.status === "publicado" ? "Publicado" : "Borrador"}</span><b>{post.title}</b><p>{post.excerpt}</p>{post.kind === "instagram"&&<a href={post.sourceUrl} target="_blank" rel="noreferrer">Ver publicación original <ExternalLink size={12}/></a>}</div><div className="admin-content-actions"><button onClick={()=>{setError("");setDraft({id:post.id,kind:post.kind,title:post.title,slug:post.slug,excerpt:post.excerpt,content:post.content,sourceUrl:post.sourceUrl,status:post.status});}}>Editar</button><button onClick={()=>remove(post)} aria-label="Eliminar publicación"><Trash2 size={15}/></button></div></article>}) : <p className="admin-empty">Todavía no hay publicaciones. Crea un borrador o publícalo para mostrarlo en la tienda.</p>}</section><p className="admin-content-footnote"><Instagram size={14}/> Instagram se gestiona como contenido seleccionado con enlace a la publicación original. La sincronización automática requiere configurar la API y una cuenta profesional.</p>
    {draft&&<div className="admin-modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setDraft(null);}}><section className="admin-modal admin-content-modal"><div className="admin-modal-head"><div><p className="admin-eyebrow">EDITORIAL EL DIVÁN</p><h2 className="editorial-serif">{draft.id?"Editar publicación":"Nueva publicación"}</h2></div><button className="admin-icon-button" onClick={()=>setDraft(null)}><X size={20}/></button></div><form className="admin-content-form" onSubmit={save}><label>Tipo de contenido<select value={draft.kind} onChange={e=>patch("kind",e.target.value as Draft["kind"])}><option value="articulo">Artículo de blog</option><option value="noticia">Noticia</option><option value="instagram">Publicación de Instagram</option></select></label><label>Título<input required minLength={3} maxLength={120} value={draft.title} onChange={e=>{const title=e.target.value;setDraft(current=>current?{...current,title,slug:current.id?current.slug:slugify(title)}:current);}}/></label><label>Enlace de la publicación<input required value={draft.slug} onChange={e=>patch("slug",slugify(e.target.value))} placeholder="titulo-de-la-publicacion"/><small>URL pública: /noticias/{draft.slug || "tu-publicacion"}</small></label>{draft.kind === "instagram"&&<label>Enlace público de Instagram<input type="url" required value={draft.sourceUrl} onChange={e=>patch("sourceUrl",e.target.value)} placeholder="https://www.instagram.com/p/..."/></label>}<label>Resumen<input required minLength={10} maxLength={360} value={draft.excerpt} onChange={e=>patch("excerpt",e.target.value)}/></label><label>Contenido<textarea required minLength={20} maxLength={20000} rows={9} value={draft.content} onChange={e=>patch("content",e.target.value)} placeholder="Escribe el artículo o una nota editorial. Se respetarán los saltos de línea."/></label><label>Visibilidad<select value={draft.status} onChange={e=>patch("status",e.target.value as Draft["status"])}><option value="borrador">Guardar como borrador</option><option value="publicado">Publicar en la tienda</option></select></label>{error&&<p className="admin-error">{error}</p>}<div className="admin-modal-actions"><button type="button" className="admin-secondary" onClick={()=>setDraft(null)}>Cancelar</button><button className="admin-primary" disabled={busy}><Save size={14}/>{busy?"Guardando…":"Guardar"}</button></div></form></section></div>}
  </div>;
}

