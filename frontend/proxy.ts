import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/constants";

// Rutas de "solo invitado": si ya tienes sesión, te mandamos a "/".
const publicOnlyRoutes = ["/login", "/registro"];

// Rutas accesibles siempre, estés o no autenticado (procesan un token propio).
const alwaysAccessibleRoutes = [
  "/registro/confirmacion",
  "/verificar-email",
  "/verificar-email/error",
  "/completar-registro",
];

export default function proxy(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const isLoggedIn = !!cookies.get(TOKEN_COOKIE)?.value;
  const path = nextUrl.pathname;

  if (alwaysAccessibleRoutes.includes(path)) {
    return NextResponse.next();
  }

  const isPublicOnlyRoute = publicOnlyRoutes.includes(path);

  if (!isLoggedIn && !isPublicOnlyRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isLoggedIn && isPublicOnlyRoute) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
