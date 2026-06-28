import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export default auth((req: any) => {
  const nextUrl = req.nextUrl;
  const session = req.auth;
  const isLoggedIn = !!session;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"));
  const isAuthRoute = AUTH_ROUTES.some((route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route + "/"));
  const isApiRoute = nextUrl.pathname.startsWith("/api/");

  if (isApiRoute) return NextResponse.next();

  // Redirect logged-in users away from auth pages
  if (isLoggedIn && isAuthRoute) {
    const role = (session.user as any)?.role;
    if (role === "DONOR") {
      return NextResponse.redirect(new URL("/donor", nextUrl));
    }
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Prevent Donors from accessing Admin Dashboard
  if (isLoggedIn && nextUrl.pathname.startsWith("/dashboard")) {
    const role = (session.user as any)?.role;
    if (role === "DONOR") {
      return NextResponse.redirect(new URL("/donor", nextUrl));
    }
  }

  // Prevent Admin from accessing Donor portal
  if (isLoggedIn && nextUrl.pathname.startsWith("/donor")) {
    const role = (session.user as any)?.role;
    if (role !== "DONOR") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  // Redirect non-logged-in users to login
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
