import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { deleteBook, saveBook } from "@/lib/admin-data";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    const required = ["title", "slug", "author", "publisher", "description"];
    if (required.some((key) => typeof body[key] !== "string" || !body[key].trim()) || !Number.isFinite(Number(body.price)) || !Number.isFinite(Number(body.year)) || !Number.isFinite(Number(body.stock)) || Number(body.stock) < 0) {
      return NextResponse.json({ error: "Revisa los campos obligatorios y el precio/año." }, { status: 400 });
    }
    const validImage = (value: unknown) => {
      if (value === undefined || value === "") return true;
      if (typeof value !== "string") return false;
      if (/^\/uploads\/books\/[0-9a-f-]+\.(?:jpg|png|webp)$/.test(value)) return true;
      try { const imageUrl = new URL(value); return imageUrl.protocol === "https:" && /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i.test(imageUrl.hostname); }
      catch { return false; }
    };
    if (!validImage(body.coverImage) || !Array.isArray(body.productImages ?? []) || (body.productImages ?? []).length > 4 || !(body.productImages ?? []).every(validImage)) {
      return NextResponse.json({ error: "Revisa las imágenes de portada y producto." }, { status: 400 });
    }
    const book = await saveBook({
      ...(body.id ? { id: String(body.id) } : {}), title: body.title.trim(), slug: body.slug.trim(), author: body.author.trim(), publisher: body.publisher.trim(), description: body.description.trim(),
      price: Number(body.price), year: Number(body.year), stock: Math.floor(Number(body.stock)), available: Number(body.stock) > 0, isNew: Boolean(body.isNew), featured: Boolean(body.featured),
      ...(body.coverImage ? { coverImage: body.coverImage } : {}), productImages: (body.productImages ?? []).filter((value: unknown): value is string => typeof value === "string"),
      lifeStages: Array.isArray(body.lifeStages) ? body.lifeStages : [], clinicalTopics: Array.isArray(body.clinicalTopics) ? body.clinicalTopics : [], theoreticalOrientations: Array.isArray(body.theoreticalOrientations) ? body.theoreticalOrientations : [],
    });
    return NextResponse.json({ book });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la ficha." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Falta el id del libro." }, { status: 400 });
  try { await deleteBook(id); return NextResponse.json({ ok: true }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo eliminar." }, { status: 409 }); }
}
