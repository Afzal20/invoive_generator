import { NextResponse } from "next/server";
import { getApiBaseUrl } from "@/lib/api/client";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
  return NextResponse.json({ client_id: clientId });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, redirect_uri, id_token } = body;

    const res = await fetch(`${getApiBaseUrl()}/auth/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirect_uri, id_token }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || data.detail || data.message || "Google authentication failed" },
        { status: res.status },
      );
    }

    const isSecure = request.url.startsWith("https://");
    const accessToken = data.tokens?.access || data.access;
    const refreshToken = data.tokens?.refresh || data.refresh;

    const response = NextResponse.json({ ok: true, user: data.user });

    if (accessToken) {
      response.cookies.set("bp_access_token", accessToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
    }

    if (refreshToken) {
      response.cookies.set("bp_refresh_token", refreshToken, {
        httpOnly: true,
        secure: isSecure,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}
