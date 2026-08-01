import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiVerifyEmail, ApiError } from "@/lib/api-client";
import { TOKEN_COOKIE } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(
      new URL(`/verificar-email/error?message=${encodeURIComponent("Falta el enlace de verificación.")}`, req.url)
    );
  }

  try {
    const result = await apiVerifyEmail(token);
    const response = NextResponse.redirect(new URL("/", req.url));
    response.cookies.set(TOKEN_COOKIE, result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    const message = error instanceof ApiError ? error.message : "No se ha podido verificar la cuenta.";
    return NextResponse.redirect(new URL(`/verificar-email/error?message=${encodeURIComponent(message)}`, req.url));
  }
}
