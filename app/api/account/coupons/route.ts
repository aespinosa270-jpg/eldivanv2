import { NextResponse } from "next/server";
import { validateRewardCoupon } from "@/lib/admin-data";
import { getSignedInCustomer } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const customer = await getSignedInCustomer();
  if (!customer) return NextResponse.json({ error: "Inicia sesión para usar tus cupones." }, { status: 401 });
  const body = await request.json();
  const coupon = await validateRewardCoupon(customer.email, String(body.code || ""));
  return coupon ? NextResponse.json(coupon) : NextResponse.json({ error: "Cupón inválido, ya usado o de otra cuenta." }, { status: 400 });
}
