"use server";

import { stripe } from "@/lib/stripe/server";
import { requireOrg } from "@/lib/erp/org";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function createCheckoutSession(priceId: string) {
  const { org } = await requireOrg();
  const supabase = await createClient();
  
  const headersList = await headers();
  const origin = headersList.get("origin") || "http://localhost:3000";

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
      billing_address_collection: "required",
      customer: customerId || undefined,
      client_reference_id: org.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/settings/billing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings/billing`,
    });

    return { sessionId: session.id, url: session.url };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create checkout session");
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
    console.error(err);
    throw new Error("Failed to create customer portal session");
  }
}
