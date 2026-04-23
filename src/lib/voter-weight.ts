import { isOperatorEmail } from "./operator";

export type VoterScope = "framework" | "product";

export interface VoterContext {
  userId: string;
  email: string | null | undefined;
}

/**
 * Member's vote weight for a given proposal scope.
 *
 * Today: every authenticated member has weight 1×. This is correct because
 * the Stripe checkout + Patron tier-detection isn't live yet, so we have
 * no way to identify who's actually a Patron at what tier. Magic-link
 * sign-ins create a User account, no Patron metadata attached.
 *
 * When Stripe is wired (Phase 3), this function looks up the user's Patron
 * tier from a patron_subscribers / member_profiles table:
 *
 *   - Patron tier 1 (positions 1–1,000):    4× on framework, 1× on product
 *   - Patron tier 2 (1,001–10,000):         3× on framework, 1× on product
 *   - Patron tier 3 (10,001–100,000):       2× on framework, 1× on product
 *   - Patron tier 4 (100,001+):             1× on framework, 1× on product
 *   - Member ($30/yr) and signed-in users:  1× on both scopes
 *
 * Operators don't get bonus weight; they get tiebreak authority on
 * product-scope votes only (handled in tally, not in weight).
 */
export async function getVoterWeight(
  ctx: VoterContext,
  scope: VoterScope,
): Promise<number> {
  // Phase 2b: 1× for everyone. Hooks for tier detection in Phase 3.
  void scope;
  void ctx;
  return 1;
}

/**
 * Whether this user has tiebreak authority on this scope.
 * Currently: operators tiebreak product-level votes only.
 */
export function hasTiebreak(
  ctx: VoterContext,
  scope: VoterScope,
): boolean {
  if (scope !== "product") return false;
  return isOperatorEmail(ctx.email);
}
