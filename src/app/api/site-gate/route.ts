import { NextResponse } from "next/server";
import { GATE_COOKIE, GATE_MAX_AGE, gatePage, gateResponseInit, gateToken, safeNext } from "@/lib/site-gate";

// Checks the development-site password and, if it's right, sets the gate cookie (see src/lib/site-gate.ts).
export async function POST(request: Request) {
  const form = await request.formData();
  const next = safeNext(String(form.get("next") ?? "/"));
  const password = process.env.SITE_PASSWORD;
  if (!password) return NextResponse.redirect(new URL(next, request.url), 303);
  if (String(form.get("password") ?? "") !== password) return new NextResponse(gatePage({ next, wrong: true }), gateResponseInit(401));
  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(GATE_COOKIE, await gateToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GATE_MAX_AGE,
  });
  return response;
}
