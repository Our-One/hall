/**
 * One-shot script to seed the first Hall proposal: the flagship vote.
 *
 * Run: npx dotenv -e .env.local -- tsx scripts/seed-first-proposal.ts
 *
 * Idempotent: skips if a proposal with the slug already exists.
 */

import { findProposalBySlug, createProposal } from "../src/lib/proposals";

const SEED = {
  slug: "first-flagship",
  title: "Which flagship do we build first?",
  bodyMd: `This is the first binding vote on Our.one / Hall. Members choose which flagship product Our.one builds first, after Hall itself.

## What this vote decides

The winning category becomes Our.one's first community-built flagship. Operators will scope it, AI will build it, and the weekly ship feed will show every step. Members who vote will earn per that product's declared constitution (flagship default: Users 40% / Ambassadors 25% / Patrons 15% / Commons 10% / Our.one Fee 10%).

## The choices

Each option names a category Our.one would build into, competing with a well-known incumbent. The brand will be **Our.one / [Common English Word]** — to be picked by a follow-up vote after this one closes.

- **Social feed** — a social timeline product. Incumbents: Instagram, X. Distribution moat: strongest in this category.
- **Notes & documents** — a productivity-document product. Incumbents: Notion, Google Docs. Highest-willingness-to-pay per user.
- **Community / chat** — a real-time discussion product. Incumbents: Discord, Slack. Best fit for the ecosystem we're building (Hall itself is in this adjacent space).
- **Creator subscriptions** — a Patreon / Substack-style product. Incumbents: Substack, Patreon. Direct fit for Our.one's revenue-share DNA — creators and their audiences both earn.

## How voting works

- Every signed-in member gets 1× weight on this product-scope vote.
- Single choice — you pick one. Voting once is final; no changes, no re-votes.
- Results visible live.
- Operator tiebreak authority applies on product-scope votes if needed; in practice this vote is unlikely to tie meaningfully.

## What happens after

When this vote closes, the winning category gets:

1. A follow-up vote on the product's brand name (e.g. Our.one / Feed vs. Our.one / Loop for social).
2. A new repo at \`github.com/Our-One/[slug]\` with the same stack as Hall.
3. A published product constitution declaring the role mix.
4. Regular ship-feed posts here documenting the build.

This is the moment where Our.one stops being "a manifesto + a preorder" and starts being "a thing you can watch get built, with your vote on it."`,
  voteType: "single_choice" as const,
  choices: [
    {
      id: "social",
      label: "Social feed",
      description: "Instagram / X category. Distribution is the moat here.",
    },
    {
      id: "notes",
      label: "Notes & documents",
      description: "Notion / Docs category. Highest willingness to pay.",
    },
    {
      id: "community",
      label: "Community / chat",
      description: "Discord / Slack category. Ecosystem-adjacent.",
    },
    {
      id: "creator",
      label: "Creator subscriptions",
      description: "Substack / Patreon category. Direct fit for our revenue model.",
    },
  ],
  scope: "product" as const,
  productSlug: null,
  status: "open" as const,
  opensAt: new Date("2026-04-23T10:00:00Z"),
  closesAt: null,
  authorId: null,
} satisfies Parameters<typeof createProposal>[0];

async function main() {
  const existing = await findProposalBySlug(SEED.slug);
  if (existing) {
    console.log(`Proposal '${SEED.slug}' already exists. Skipping.`);
    return;
  }
  const created = await createProposal(SEED);
  console.log(`Created proposal '${created.slug}' (id ${created.id})`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
