"use server";

import { requireOrg } from "@/lib/erp/org";
import { billingApi } from "@/lib/api/client";

export async function createCheckoutSession(priceId?: string) {
  const { org } = await requireOrg();
  try {
    const session = await billingApi.createCheckoutSession(org.id, priceId || "pro");
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
    const portalSession = await billingApi.createCustomerPortalSession(org.id);
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
