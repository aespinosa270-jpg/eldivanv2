import { NextResponse } from "next/server";
import { createCheckoutOrder } from "@/lib/admin-data";
import { getSignedInCustomer } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const customer = await getSignedInCustomer();
  if (!customer) return NextResponse.json({ error: "Inicia sesión para confirmar tu pedido." }, { status: 401 });
  try {
    const body = await request.json();
    const address = String(body.address || "").trim().slice(0, 500);
    if (address.length < 8) return NextResponse.json({ error: "Escribe una dirección de entrega completa." }, { status: 400 });
    const rawItems = Array.isArray(body.items) ? body.items : [];
    const items = rawItems.map((item: { bookId?: unknown; quantity?: unknown }) => ({ bookId: String(item.bookId || ""), quantity: Number(item.quantity) }));
    const order = await createCheckoutOrder({ name: customer.name, email: customer.email, address, items, couponCode: String(body.couponCode || "").trim() || undefined });
    return NextResponse.json({ order: { id: order.id, total: order.total, discount: order.discount || 0 } }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No pudimos crear tu pedido." }, { status: 400 });
  }
}
