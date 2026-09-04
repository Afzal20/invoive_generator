import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const token =
    request.cookies.get("bp_access_token")?.value ||
    request.cookies.get("bp_refresh_token")?.value;

  const protectedPaths = [
    "/dashboard",
    "/invoices",
    "/clients",
    "/settings",
    "/team",
    "/products",
    "/search",
    "/expenses",
    "/reports",
    "/create-invoice",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!token && isProtectedPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (
    token &&
    (request.nextUrl.pathname === "/auth/login" ||
      request.nextUrl.pathname === "/auth/sign-up")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
