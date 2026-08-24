import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Organization, TeamMember, TeamRole } from "./types";

export const ACTIVE_ORG_COOKIE = "bp_active_org";

const ROLE_RANK: Record<TeamRole, number> = {
  viewer: 0,
  editor: 1,
  admin: 2,
  owner: 3,
};

export function roleAtLeast(role: string | null | undefined, min: TeamRole) {
  if (!role || !(role in ROLE_RANK)) return false;
  return ROLE_RANK[role as TeamRole] >= ROLE_RANK[min];
}

export interface OrgContext {
  org: Organization;
  member: TeamMember;
}

interface MemberRow extends TeamMember {
  org: Organization | null;
}

/** All active organizations the signed-in user belongs to. */
export async function getMemberships(): Promise<OrgContext[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*, org:organizations(*)")
    .eq("status", "active")
    .order("created_at", { ascending: true });

  return ((data as MemberRow[]) ?? [])
    .filter((m) => m.org)
    .map((m) => ({ org: m.org as Organization, member: m }));
}

/**
 * The organization the user is currently working in.
 * Persisted via cookie; falls back to the first membership.
 */
export async function getActiveOrg(): Promise<OrgContext | null> {
  const memberships = await getMemberships();
  if (memberships.length === 0) return null;

  const cookieStore = await cookies();
  const wanted = cookieStore.get(ACTIVE_ORG_COOKIE)?.value;
  return (
    memberships.find((m) => m.org.id === wanted) ?? memberships[0]
  );
}

/** For pages — guarantees an org context or redirects. */
export async function requireOrg(): Promise<OrgContext> {
  const ctx = await getActiveOrg();
  if (!ctx) redirect("/dashboard");
  return ctx;
}

/** For mutations — enforces a minimum role at the application layer (RLS backstops). */
export async function requireRole(min: TeamRole): Promise<OrgContext> {
  const ctx = await getActiveOrg();
  if (!ctx) throw new Error("You don't belong to any organization.");
  if (!roleAtLeast(ctx.member.role, min))
    throw new Error(
      `This action requires the ${min} role or higher in ${ctx.org.name}.`,
    );
  return ctx;
}

/**
 * Claim pending invites matching this user's email.
 * Called right after login so invited users land inside the org that invited them.
 * RLS restricts the update to rows where email matches the JWT and status is pending.
 */
export async function claimPendingInvites(
  email: string,
  userId: string,
): Promise<number> {
  if (!email) return 0;
  const normalized = email.toLowerCase();
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .update({
      user_id: userId,
      status: "active",
      joined_at: new Date().toISOString(),
    })
    .eq("email", normalized)
    .eq("status", "pending")
    .is("user_id", null)
    .select("id");
  return data?.length ?? 0;
}
