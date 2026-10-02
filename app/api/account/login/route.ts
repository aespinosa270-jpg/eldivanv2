import { NextResponse } from "next/server";
import { getCustomerAuth } from "@/lib/admin-data";
import { createCustomerSession, customerCookieName, customerSessionMaxAge, verifyCustomerPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const account = await getCustomerAuth(email);
  if (!account || !verifyCustomerPassword(password, account.passwordHash)) return NextResponse.redirect(new URL("/cuenta?error=acceso", request.url), 303);
  const response = NextResponse.redirect(new URL("/cuenta", request.url), 303);
  response.cookies.set(customerCookieName, createCustomerSession(email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: customerSessionMaxAge });
  return response;
}

