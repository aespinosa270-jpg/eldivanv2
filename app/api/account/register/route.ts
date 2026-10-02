import { NextResponse } from "next/server";
import { createCustomerAccount } from "@/lib/admin-data";
import { createCustomerSession, customerCookieName, customerSessionMaxAge, hashCustomerPassword } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim().slice(0, 100);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 200) {
    return NextResponse.redirect(new URL("/cuenta?error=datos", request.url), 303);
  }
  try {
    await createCustomerAccount({ name, email, passwordHash: hashCustomerPassword(password) });
    const response = NextResponse.redirect(new URL("/cuenta", request.url), 303);
    response.cookies.set(customerCookieName, createCustomerSession(email), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: customerSessionMaxAge });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/cuenta?error=registro", request.url), 303);
  }
}

