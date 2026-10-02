import { NextResponse } from "next/server";
import { adminCookieName, adminSessionMaxAge, createAdminSession, verifyAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const username = String(form.get("username") || "");
  const password = String(form.get("password") || "");
  if (!verifyAdminCredentials(username, password)) {
    return NextResponse.redirect(new URL("/administracion?error=1", request.url), 303);
  }
  const response = NextResponse.redirect(new URL("/administracion", request.url), 303);
  response.cookies.set(adminCookieName, createAdminSession(), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: adminSessionMaxAge,
  });
  return response;
}

