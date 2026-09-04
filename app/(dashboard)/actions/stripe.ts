"use server";

import { requireOrg } from "@/lib/erp/org";
import { billingApi } from "@/lib/api/client";
import { headers } from "next/headers";

async function getFrontendBaseUrl(): Promise<string> {
  const envBase = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_FRONTEND_URL;
  if (envBase) {
    return envBase.replace(/\/$/, "");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const referer = requestHeaders.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin.replace(/\/$/, "");
    } catch {
      return referer.replace(/\/$/, "");
    }
  }

  return "http://localhost:3000";
}

function resolvePriceId(priceId?: string): string {
  const trimmed = priceId?.trim();
  if (!trimmed) {
    return process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "";
  }

  if (trimmed.startsWith("price_")) {
    return trimmed;
  }

  const mapping: Record<string, string | undefined> = {
    free: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID,
    starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    enterprise: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
  };

  return mapping[trimmed.toLowerCase()] || trimmed;
}

export async function createCheckoutSession(priceId?: string) {
  const { org } = await requireOrg();
  try {
    const baseUrl = await getFrontendBaseUrl();
    const session = await billingApi.createCheckoutSession(org.id, {
      priceId: resolvePriceId(priceId),
      successUrl: `${baseUrl}/settings?billing=success`,
      cancelUrl: `${baseUrl}/settings?billing=cancel`,
    });
    return { sessionId: session.session_id, url: session.checkout_url };
  } catch (err) {
    console.error("Billing Checkout Error:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to create checkout session",
    );
  }
}

export async function createCustomerPortalSession() {
  const { org } = await requireOrg();
  try {
    const portalSession = await billingApi.createCustomerPortalSession(org.id, `${await getFrontendBaseUrl()}/settings`);
    return { url: portalSession.portal_url };
  } catch (err) {
    console.error("Billing Customer Portal Error:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to create customer portal session",
    );
  }
}

export async function syncCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: "Missing session ID" };
  }
  return { success: true };
}
