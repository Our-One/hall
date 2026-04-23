/**
 * One-shot script to seed the very first Hall post into the DB.
 *
 * Run: npx dotenv -e .env.local -- tsx scripts/seed-first-post.ts
 *
 * Idempotent: skips if a post with the slug already exists.
 */

import { findPostBySlug, createPost } from "../src/lib/posts";

const SEED = {
  slug: "hall-launches",
  title: "Hall is live — built in one session, in public",
  bodyMd: `Welcome to Our.one / Hall — the governance platform for Our.one. This is the first post on Hall, written by Hall, about Hall. The convention starts here.

## What just shipped

The thing you're reading on right now: a Next.js app with auth, a Postgres-backed posts table, server-rendered ship feed cards, and a members-only area gated behind sign-in. Source is open at [github.com/Our-One/hall](https://github.com/Our-One/hall) under AGPL-3.0.

The visual language matches our.one (Bitter for serif, IBM Plex Sans for UI) plus a new monospace face (JetBrains Mono) for the receipts blocks under each post. The dot-prefix you see at the top of each card — *Apr 23 · Operator Rado · Our.one / Hall* — is the convention every future post uses.

## How this got built

A single Claude Code session. Two operator prompts: one to scaffold the Next.js + Drizzle + Auth.js stack from the marketing-site template, one to design the ship-feed card component and the seed post you're reading. Total operator time on prompt-writing and review: about 90 minutes. Total AI generation: a few hundred lines across schemas, components, pages, and styles.

That's the demonstration. The constitution promises a transparent ledger; the build log + ship feed are how it gets concrete. Going forward, every meaningful change to Hall (and to every Our.one product after this) appears here within hours of the commit, with a screenshot or short demo, the AI session metadata, and the commit hash.

## What's next on Hall

- **Voting** — proposals open, members vote with weighted ballots (Patron 4×/3×/2×/1× by tier, Member 1×). Live results.
- **Treasury dashboard** — Stripe webhook in, direct costs out, distribution by role visible to everyone.
- **Comments + reactions** — light social affordances under each post. Discussion that informs the next vote.
- **First proposal** — *Which flagship do we build first?* Patrons and Members nominate categories, then vote.
- **Email digest** — weekly summary delivered via Resend: what shipped, what's voting now.

## The point

People are watching gamers, watching makers, watching influencers. Most never participate. Hall is built so you can do both: watch us build something with AI in real time, and have an actual vote in what gets built next, and earn a share of the revenue when it ships. The combination of *spectator content* + *real ownership* is what makes this different.

If you're a Founding Patron preorder, you'll get an email when the Stripe checkout lights up. If you're a member, your $30/year unlocks everything below the fold on every post and a vote on every proposal. If you're new — sign in to look around, or [become a Founding Patron](https://our.one/join) at our.one.

This is the start. See you in the feed.`,
  heroUrl: null,
  heroKind: null,
  productSlug: "hall",
  aiSession: {
    prompts: 2,
    durationMin: 90,
    lines: 1200,
    summary: "Scaffold Next.js + auth, design ship-feed card",
  },
  commitUrl: "https://github.com/Our-One/hall",
  demoUrl: null,
  visibility: "public" as const,
  publishedAt: new Date("2026-04-23T07:30:00Z"),
} satisfies Parameters<typeof createPost>[0];

async function main() {
  const existing = await findPostBySlug(SEED.slug);
  if (existing) {
    console.log(`Post '${SEED.slug}' already exists. Skipping.`);
    return;
  }
  const created = await createPost(SEED);
  console.log(`Created post '${created.slug}' (id ${created.id})`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
