import { desc, eq, sql, and, ne } from "drizzle-orm";
import { getDb } from "@/db/client";
import {
  proposals,
  type Proposal,
  type NewProposal,
  type ProposalChoice,
} from "@/db/schema/proposals";
import { votes, type NewVote } from "@/db/schema/votes";
import { users } from "@/db/external/auth";
import { getVoterWeight, type VoterContext } from "@/lib/voter-weight";

export type { Proposal, NewProposal, ProposalChoice };
export type ProposalStatus = "draft" | "open" | "closed";

interface ProposalWithMeta extends Proposal {
  authorName: string | null;
  totalVotes: number;
  totalWeight: number;
}

interface VoteResult {
  choiceId: string;
  count: number;
  weight: number;
}

interface MyVote {
  choice: string;
  weight: number;
  castAt: Date;
}

export async function listProposals(opts: {
  includeDraft?: boolean;
} = {}): Promise<ProposalWithMeta[]> {
  const db = getDb();
  const baseQuery = db
    .select({
      proposal: proposals,
      authorName: users.name,
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`.as("total_votes"),
      totalWeight: sql<number>`coalesce(sum(${votes.weight}), 0)::int`.as("total_weight"),
    })
    .from(proposals)
    .leftJoin(users, eq(proposals.authorId, users.id))
    .leftJoin(votes, eq(votes.proposalId, proposals.id))
    .groupBy(proposals.id, users.name);

  const rows = opts.includeDraft
    ? await baseQuery.orderBy(desc(proposals.createdAt))
    : await baseQuery
        .where(ne(proposals.status, "draft"))
        .orderBy(desc(proposals.createdAt));

  return rows.map((r) => ({
    ...r.proposal,
    authorName: r.authorName,
    totalVotes: r.totalVotes,
    totalWeight: r.totalWeight,
  }));
}

export async function getProposalBySlug(slug: string): Promise<ProposalWithMeta | null> {
  const db = getDb();
  const [row] = await db
    .select({
      proposal: proposals,
      authorName: users.name,
    })
    .from(proposals)
    .leftJoin(users, eq(proposals.authorId, users.id))
    .where(eq(proposals.slug, slug))
    .limit(1);

  if (!row) return null;

  const [tally] = await db
    .select({
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      totalWeight: sql<number>`coalesce(sum(${votes.weight}), 0)::int`,
    })
    .from(votes)
    .where(eq(votes.proposalId, row.proposal.id));

  return {
    ...row.proposal,
    authorName: row.authorName,
    totalVotes: tally?.totalVotes ?? 0,
    totalWeight: tally?.totalWeight ?? 0,
  };
}

export async function getProposalById(id: string): Promise<ProposalWithMeta | null> {
  const db = getDb();
  const [row] = await db
    .select({
      proposal: proposals,
      authorName: users.name,
    })
    .from(proposals)
    .leftJoin(users, eq(proposals.authorId, users.id))
    .where(eq(proposals.id, id))
    .limit(1);

  if (!row) return null;

  const [tally] = await db
    .select({
      totalVotes: sql<number>`coalesce(count(${votes.id}), 0)::int`,
      totalWeight: sql<number>`coalesce(sum(${votes.weight}), 0)::int`,
    })
    .from(votes)
    .where(eq(votes.proposalId, row.proposal.id));

  return {
    ...row.proposal,
    authorName: row.authorName,
    totalVotes: tally?.totalVotes ?? 0,
    totalWeight: tally?.totalWeight ?? 0,
  };
}

export async function findProposalBySlug(slug: string): Promise<Proposal | null> {
  const db = getDb();
  const [row] = await db.select().from(proposals).where(eq(proposals.slug, slug)).limit(1);
  return row ?? null;
}

export async function createProposal(values: NewProposal): Promise<Proposal> {
  const db = getDb();
  const [created] = await db.insert(proposals).values(values).returning();
  return created;
}

export async function updateProposal(
  id: string,
  values: Partial<NewProposal>,
): Promise<Proposal | null> {
  const db = getDb();
  const [updated] = await db
    .update(proposals)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(proposals.id, id))
    .returning();
  return updated ?? null;
}

export async function deleteProposal(id: string): Promise<void> {
  const db = getDb();
  await db.delete(proposals).where(eq(proposals.id, id));
}

export async function getResults(proposalId: string): Promise<VoteResult[]> {
  const db = getDb();
  const rows = await db
    .select({
      choice: votes.choice,
      count: sql<number>`count(*)::int`,
      weight: sql<number>`coalesce(sum(${votes.weight}), 0)::int`,
    })
    .from(votes)
    .where(eq(votes.proposalId, proposalId))
    .groupBy(votes.choice);

  return rows.map((r) => ({
    choiceId: r.choice,
    count: r.count,
    weight: r.weight,
  }));
}

export async function getMyVote(
  proposalId: string,
  memberId: string,
): Promise<MyVote | null> {
  const db = getDb();
  const [row] = await db
    .select({
      choice: votes.choice,
      weight: votes.weight,
      castAt: votes.castAt,
    })
    .from(votes)
    .where(and(eq(votes.proposalId, proposalId), eq(votes.memberId, memberId)))
    .limit(1);
  return row ?? null;
}

export async function castVote(args: {
  proposal: Proposal;
  voter: VoterContext;
  choice: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (args.proposal.status !== "open") {
    return { ok: false, error: "Voting is not open on this proposal." };
  }

  // Validate choice against proposal's vote_type
  if (args.proposal.voteType === "yes_no") {
    if (args.choice !== "yes" && args.choice !== "no") {
      return { ok: false, error: "Choice must be yes or no." };
    }
  } else if (args.proposal.voteType === "single_choice") {
    const choices = (args.proposal.choices as ProposalChoice[] | null) ?? [];
    if (!choices.some((c) => c.id === args.choice)) {
      return { ok: false, error: "Invalid choice for this proposal." };
    }
  }

  const scope = args.proposal.scope === "framework" ? "framework" : "product";
  const weight = await getVoterWeight(args.voter, scope);

  const db = getDb();
  // Insert; unique index (proposal_id, member_id) prevents double votes.
  // We don't allow vote-changing in v1 — if a member already voted, the
  // unique index throws and we surface a friendly error.
  const record: NewVote = {
    proposalId: args.proposal.id,
    memberId: args.voter.userId,
    choice: args.choice,
    weight,
    voterScope: scope,
  };

  try {
    await db.insert(votes).values(record);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("hall_votes_proposal_member_uniq")) {
      return { ok: false, error: "You already voted on this proposal." };
    }
    throw err;
  }
}
