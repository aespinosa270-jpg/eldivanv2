import { NextResponse } from "next/server";
import { addRestockRequest } from "@/lib/admin-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 100);
    const email = String(body.email || "").trim().toLowerCase().slice(0, 254);
    const bookId = String(body.bookId || "").trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !bookId) {
      return NextResponse.json({ error: "Escribe tu nombre y un correo válido." }, { status: 400 });
    }
    const result = await addRestockRequest({ name, email, bookId });
    return NextResponse.json({ ok: true, duplicate: result.duplicate });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo registrar." }, { status: 400 });
  }
}
