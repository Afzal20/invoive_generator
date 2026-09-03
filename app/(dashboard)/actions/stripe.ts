"use server";

import { stripe } from "@/lib/stripe/server";
import { requireOrg } from "@/lib/erp/org";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type Stripe from "stripe";

export async function createCheckoutSession(priceId?: string) {
  const { org } = await requireOrg();
  const supabase = await createClient();

  const targetPriceId = priceId || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_1UBHQXLoTyOsviCM13Zaocz1";

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const { data: userData } = await supabase.auth.getUser();
  const userEmail = userData?.user?.email;

  // Check if they already have a stripe customer id
  const { data: dbOrg } = await supabase
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", org.id)
    .single();

  const customerId = dbOrg?.stripe_customer_id;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer: customerId || undefined,
      customer_email: customerId ? undefined : userEmail,
      client_reference_id: org.id,
      metadata: {
        organization_id: org.id,
      },
      subscription_data: {
        metadata: {
          organization_id: org.id,
        },
      },
      line_items: [
        {
          price: targetPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings/billing?canceled=true`,
    });

    return { sessionId: session.id, url: session.url };
  } catch (err) {
    console.error("Stripe Checkout Session Creation Error:", err);
    throw new Error(err instanceof Error ? err.message : "Failed to create checkout session");
  }
}

export async function createCustomerPortalSession() {
  const { org } = await requireOrg();
  const supabase = await createClient();

  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

  const { data: dbOrg } = await supabase
    .from("organizations")
    .select("stripe_customer_id")
    .eq("id", org.id)
    .single();

  if (!dbOrg?.stripe_customer_id) {
    throw new Error("No Stripe customer found for this organization");
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: dbOrg.stripe_customer_id,
      return_url: `${origin}/settings/billing`,
    });

    return { url: portalSession.url };
  } catch (err) {
    console.error("Stripe Customer Portal Session Error:", err);
    throw new Error(err instanceof Error ? err.message : "Failed to create customer portal session");
  }
}

export async function syncCheckoutSession(sessionId: string) {
  if (!sessionId) {
    return { success: false, error: "Missing session ID" };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return { success: false, status: session.status };
    }

    const { org } = await requireOrg();
    const organizationId = session.client_reference_id || session.metadata?.organization_id || org.id;

    const subscription = session.subscription as Stripe.Subscription | null;
    const subRecord = subscription as unknown as Record<string, unknown> | null;

    let customerId = "";
    if (typeof session.customer === "string") {
      customerId = session.customer;
    } else if (session.customer && "id" in session.customer) {
      customerId = session.customer.id;
    } else if (subscription) {
      if (typeof subscription.customer === "string") {
        customerId = subscription.customer;
      } else if (subscription.customer && "id" in subscription.customer) {
        customerId = subscription.customer.id;
      }
    }

    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : subscription?.id || "";

    if (organizationId && subscriptionId) {
      const adminSupabase = createAdminClient();

      await adminSupabase
        .from("organizations")
        .update({
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        })
        .eq("id", organizationId);

      const rawStart = typeof subRecord?.current_period_start === "number" ? subRecord.current_period_start : null;
      const rawEnd = typeof subRecord?.current_period_end === "number" ? subRecord.current_period_end : null;

      const periodStart = rawStart ? new Date(rawStart * 1000).toISOString() : new Date().toISOString();
      const periodEnd = rawEnd
        ? new Date(rawEnd * 1000).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      await adminSupabase.from("subscriptions").upsert({
        organization_id: organizationId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: subscription?.status || "active",
        price_id: subscription?.items?.data?.[0]?.price?.id || null,
        cancel_at_period_end: subscription?.cancel_at_period_end ?? false,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      });

      return { success: true, organizationId, status: subscription?.status || "active" };
    }

    return { success: false, error: "No organization or subscription found in session" };
  } catch (err) {
    console.error("Failed to sync checkout session:", err);
    return { success: false, error: err instanceof Error ? err.message : "Sync failed" };
  }
}
