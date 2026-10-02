import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { saveCampaign, setSubscriberActive } from "@/lib/admin-data";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    const kind = ["novedades", "promocion", "carrito"].includes(body.kind) ? body.kind as "novedades" | "promocion" | "carrito" : null;
    if (!kind || typeof body.name !== "string" || !body.name.trim() || body.name.length > 100 || typeof body.subject !== "string" || !body.subject.trim() || body.subject.length > 150 || typeof body.body !== "string" || !body.body.trim() || body.body.length > 5000) return NextResponse.json({ error: "Revisa el tipo, nombre, asunto y mensaje de la campaña." }, { status: 400 });
    const campaign = await saveCampaign({ name: body.name.trim(), kind, subject: body.subject.trim(), preheader: typeof body.preheader === "string" ? body.preheader.trim().slice(0, 150) : "", body: body.body.trim() });
    return NextResponse.json({ campaign });
  } catch { return NextResponse.json({ error: "No se pudo guardar el borrador." }, { status: 500 }); }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    if (typeof body.subscriberId !== "string" || typeof body.active !== "boolean") return NextResponse.json({ error: "Solicitud no válida." }, { status: 400 });
    return NextResponse.json({ subscriber: await setSubscriberActive(body.subscriberId, body.active) });
  } catch { return NextResponse.json({ error: "No se encontró el suscriptor." }, { status: 404 }); }
}
