import { NextResponse } from "next/server";
import { recordCustomerCart } from "@/lib/admin-data";
import { getSignedInCustomer } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const customer = await getSignedInCustomer();
  if (!customer) return NextResponse.json({ error: "Inicia sesión para guardar la actividad del carrito." }, { status: 401 });
  try {
    const body = await request.json();
    if (!Array.isArray(body.items) || body.items.length > 30) return NextResponse.json({ error: "Carrito no válido." }, { status: 400 });
    const items = body.items.map((item: { bookId?: unknown; quantity?: unknown }) => ({ bookId: String(item.bookId || "").slice(0, 80), quantity: Number(item.quantity) })).filter((item: { bookId: string; quantity: number }) => item.bookId && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 10);
    if (items.length !== body.items.length) return NextResponse.json({ error: "Hay artículos no válidos." }, { status: 400 });
    const cart = await recordCustomerCart(items, customer.email, customer.name);
    return NextResponse.json({ ok: true, cartId: cart?.id ?? null });
  } catch { return NextResponse.json({ error: "No se pudo guardar la actividad del carrito." }, { status: 500 }); }
}
