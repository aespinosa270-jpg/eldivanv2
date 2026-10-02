import { NextResponse } from "next/server";
import { subscribeNewsletter } from "@/lib/admin-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    if (body.consent !== true) return NextResponse.json({ error: "Necesitamos tu autorización para enviarte novedades." }, { status: 400 });
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Escribe un correo electrónico válido." }, { status: 400 });
    const subscriber = await subscribeNewsletter(email, name);
    return NextResponse.json({ ok: true, subscriber: { id: subscriber.id } });
  } catch { return NextResponse.json({ error: "No se pudo registrar tu suscripción." }, { status: 500 }); }
}
