import { NextResponse } from "next/server";
import { deleteContentPost, saveContentPost } from "@/lib/admin-data";
import { hasAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    const kind = body.kind;
    const status = body.status;
    const title = String(body.title || "").trim().slice(0, 120);
    const slug = String(body.slug || "").trim().toLowerCase();
    const excerpt = String(body.excerpt || "").trim().slice(0, 360);
    const content = String(body.content || "").trim().slice(0, 20000);
    const sourceUrl = String(body.sourceUrl || "").trim();
    if (!["articulo", "noticia", "instagram"].includes(kind) || !["borrador", "publicado"].includes(status) || title.length < 3 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || excerpt.length < 10 || content.length < 20) {
      return NextResponse.json({ error: "Completa título, enlace, resumen y contenido." }, { status: 400 });
    }
    if (kind === "instagram") {
      let host = "";
      try { host = new URL(sourceUrl).hostname.toLowerCase(); } catch { /* invalid link */ }
      if (!sourceUrl.startsWith("https://") || !["instagram.com", "www.instagram.com"].includes(host)) return NextResponse.json({ error: "Agrega un enlace público válido de Instagram." }, { status: 400 });
    }
    const post = await saveContentPost({ ...(body.id ? { id: String(body.id) } : {}), kind, status, title, slug, excerpt, content, sourceUrl: kind === "instagram" ? sourceUrl : "" });
    return NextResponse.json({ post });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar la publicación." }, { status: 400 }); }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id de la publicación." }, { status: 400 });
  await deleteContentPost(id);
  return NextResponse.json({ ok: true });
}
