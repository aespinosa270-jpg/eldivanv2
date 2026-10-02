import { NextResponse } from "next/server";
import { createPromotionCoupon, togglePromotionCoupon } from "@/lib/admin-data";
import { hasAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    const code = String(body.code || "").trim().toUpperCase();
    const percent = Number(body.percent);
    const startsAt = String(body.startsAt || "");
    const expiresAt = String(body.expiresAt || "");
    const usageLimit = Number(body.usageLimit);
    if (!/^[A-Z0-9_-]{4,24}$/.test(code) || !Number.isInteger(percent) || percent < 1 || percent > 80 || !/^\d{4}-\d{2}-\d{2}$/.test(startsAt) || !/^\d{4}-\d{2}-\d{2}$/.test(expiresAt) || expiresAt < startsAt || !Number.isInteger(usageLimit) || usageLimit < 1 || usageLimit > 100000) {
      return NextResponse.json({ error: "Revisa código, descuento, vigencia y límite de usos." }, { status: 400 });
    }
    const coupon = await createPromotionCoupon({ code, percent, startsAt, expiresAt, usageLimit, active: true });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo crear el cupón." }, { status: 400 }); }
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  try {
    const body = await request.json();
    const coupon = await togglePromotionCoupon(String(body.id || ""), Boolean(body.active));
    return NextResponse.json({ coupon });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar." }, { status: 404 }); }
}
