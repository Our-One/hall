import { auth } from "@/auth";

/**
 * Operator authorization for Hall.
 *
 * v1 uses an env var allowlist (ADMIN_EMAILS, comma-separated) to identify
 * operators. Simple and zero-schema. When the operator team grows, this
 * moves to a per-member role flag in member_profiles.
 */

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isOperatorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Returns the current operator's session, or null if the user is signed in
 * but not an operator, or null if not signed in.
 */
export async function getOperatorSession() {
  const session = await auth();
  if (!session?.user?.email) return null;
  if (!isOperatorEmail(session.user.email)) return null;
  return session;
}
