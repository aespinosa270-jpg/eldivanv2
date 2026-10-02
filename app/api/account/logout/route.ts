import { NextResponse } from "next/server";
import { customerCookieName } from "@/lib/customer-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/cuenta", request.url), 303);
  response.cookies.set(customerCookieName, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return response;
}

