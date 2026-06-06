import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";

const PUBLIC_PREFIXES = ["/login", "/registro", "/verificar-email"];
const ADMIN_ROUTES = ["/admin"];
const AUTH_PREFIXES = ["/login", "/registro"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("session")?.value;
  const session = token ? await decrypt(token) : null;

  if (AUTH_PREFIXES.some((r) => pathname.startsWith(r)) && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const isPublic =
    pathname === "/" ||
    PUBLIC_PREFIXES.some((r) => pathname.startsWith(r));
  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
