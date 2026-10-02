import { NextResponse } from "next/server";
import { hasAdminSession } from "@/lib/admin-auth";
import { updateOrder, type OrderStatus, type PaymentStatus } from "@/lib/admin-data";

const statuses = ["Pendiente", "Procesando", "Enviado", "Entregado", "Cancelado"];
const payments = ["Pendiente", "Pagado", "Reembolsado"];

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  const body = await request.json();
  if (typeof body.id !== "string" || !statuses.includes(body.status) || !payments.includes(body.paymentStatus)) return NextResponse.json({ error: "Estado no válido." }, { status: 400 });
  try {
    const order = await updateOrder(body.id, { status: body.status as OrderStatus, paymentStatus: body.paymentStatus as PaymentStatus, tracking: String(body.tracking || "").trim(), carrier: String(body.carrier || "").trim() });
    return NextResponse.json({ order });
  } catch { return NextResponse.json({ error: "No se encontró el pedido." }, { status: 404 }); }
}
