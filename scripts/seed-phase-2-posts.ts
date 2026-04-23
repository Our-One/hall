/**
 * Idempotent seed: inserts ship-feed posts for Phase 2 milestones.
 *
 * Run: npx dotenv -e .env.local -- tsx scripts/seed-phase-2-posts.ts
 *
 * Safe to run multiple times. Skips any post whose slug already exists.
 */

import { findPostBySlug, createPost } from "../src/lib/posts";

type NewPostInput = Parameters<typeof createPost>[0];

const POSTS: NewPostInput[] = [
  {
    slug: "publishing-from-the-browser",
    title: "Publishing from the browser — posts move to the database",
    bodyMd: `The second Hall shipment closes a small, meaningful loop. Until yesterday, publishing a post to the ship feed meant editing a TypeScript file, running the migration or adding to a typed array, and pushing a commit. Every entry was code. That works for the first post; it doesn't scale past ten.

## What shipped

Posts now live in a \`hall_posts\` table in Postgres. A new operator area at \`/inside/admin/posts\` has a list view, a new-post editor, and an edit view. The editor accepts markdown, a hero image or video (uploaded directly from the browser), and the receipts block — AI session stats, commit URL, demo URL, tagged product.

Visibility toggles are there too: **public** (title + hero visible without login), **members** (full body requires sign-in), **patrons** (reserved for future Patron-only posts). The visibility rule is enforced server-side on every render.

Operator authorization is the simplest working thing: \`ADMIN_EMAILS\` env var, comma-separated list of operator emails. Edit the list, redeploy, done. When we onboard a second operator for a specific product, it graduates to a per-member role table — not now.

## The receipts

This post you're reading is the first one written through the browser instead of committed to code. Same format as the seed post, same card component, loaded from the database. That's the demonstration.

## What&rsquo;s next

Next Hall shipment was proposals + voting, covered in the post above. After that: comments and reactions under posts, treasury dashboard when Stripe is live, and email digest to members.`,
    heroUrl: null,
    heroKind: null,
    productSlug: "hall",
    aiSession: {
      prompts: 3,
      durationMin: 45,
      lines: 1400,
      summary: "Schemas + admin UI + editor + DB-driven ship feed",
    },
    commitUrl: "https://github.com/Our-One/hall/commit/61705d3",
    demoUrl: "https://hall.our.one/inside/admin/posts",
    visibility: "public",
    publishedAt: new Date("2026-04-23T14:00:00Z"),
  },

  {
    slug: "r2-for-hero-media",
    title: "Swapped Vercel Blob for Cloudflare R2",
    bodyMd: `Brief infrastructure post. We&rsquo;d shipped Phase 2a with Vercel Blob as the hero-image and video store. An hour after shipping, the founder pointed out Our.one already runs a Cloudflare R2 bucket at \`cdn.our.one\` for user avatars and assets. Two blob stores for one portfolio was silly. Swap.

## Why R2 over Blob

- **Cost.** R2 has free egress; Blob charges per GB served. At any scale beyond a few hundred posts, R2 wins.
- **One CDN.** Our.one already uses R2 for other things. Fewer places to manage credentials, fewer places to audit.
- **Namespace discipline.** Hall uploads land under the \`hall/posts/\` prefix so they don&rsquo;t collide with user avatars or future products sharing the bucket.

## The change

Thirty minutes of work. \`@vercel/blob\` out, \`@aws-sdk/client-s3\` in (R2 is S3-compatible). The upload helper at \`src/lib/r2.ts\` has the same public interface as the old \`blob.ts\` — the server action and the post editor didn&rsquo;t change. Filenames get ULID-prefixed and sanitized to avoid collisions; everything is cached for a year with immutable content-addressing.

## The receipts

Swapping a storage backend in thirty minutes is a thing AI assistance makes nearly free. A few years ago this kind of swap took a half-day of nudging types around. Worth mentioning because it shows up in the velocity of every future product we build: infrastructure choices aren&rsquo;t one-way doors when the switching cost is this low.`,
    heroUrl: null,
    heroKind: null,
    productSlug: "hall",
    aiSession: {
      prompts: 1,
      durationMin: 30,
      lines: 180,
      summary: "@vercel/blob → @aws-sdk/client-s3, same interface",
    },
    commitUrl: "https://github.com/Our-One/hall/commit/5d51116",
    demoUrl: null,
    visibility: "public",
    publishedAt: new Date("2026-04-23T15:00:00Z"),
  },

  {
    slug: "voting-is-live-first-flagship-vote",
    title: "Voting is live. The first vote is open.",
    bodyMd: `Hall&rsquo;s governance layer shipped today. Members can vote. Operators can post proposals. Live weighted results render on every proposal page. And the first real Hall vote is open right now.

[**→ Vote on which flagship Our.one builds first**](/inside/proposals/first-flagship)

## What&rsquo;s on the ballot

Four candidate categories for the flagship product Our.one builds next, after Hall itself:

- **Social feed** — Instagram / X category. Distribution moat is strongest here.
- **Notes & documents** — Notion / Docs category. Highest willingness to pay per user.
- **Community / chat** — Discord / Slack category. Closest adjacent to Hall itself.
- **Creator subscriptions** — Substack / Patreon category. Most direct fit for our revenue-share DNA.

Whichever wins gets its own repo at \`github.com/Our-One/[slug]\`, its own product constitution, its own ship feed entries, and — when it launches — its own revenue share where Users, Ambassadors, Patrons, and the Commons pool earn per Constitution §6.

## How voting works

Every signed-in member gets **1× weight** on this product-scope vote. Voting once is final — no changes, no re-votes. DB-level uniqueness enforced on \`(proposal_id, member_id)\`.

When Stripe goes live and Patron tiers become detectable, framework-scope votes will use the 4×/3×/2×/1× Patron multiplier (by signup order, per Constitution §4). For this vote — product scope — every member weighs the same. That&rsquo;s deliberate: which direction we take the portfolio is everyone&rsquo;s call, not weighted by tenure.

## What you see

On the proposal page: the full body (no member gate; this is a public-scope vote), the four choices, and **live results** as a weighted bar chart. Your vote shows up there the moment you cast it.

## What happens after

When the vote closes — date TBD; operators close it once the result is clear — a follow-up vote picks the product&rsquo;s brand name under the \`Our.one / [Word]\` convention. Then the repo opens, the constitution gets drafted, and ship-feed posts start flowing.

The whole loop from "what should we build?" to "here&rsquo;s tonight&rsquo;s ship" visible from one place, for members with a vote on every step.`,
    heroUrl: null,
    heroKind: null,
    productSlug: "hall",
    aiSession: {
      prompts: 2,
      durationMin: 50,
      lines: 2200,
      summary: "Schemas + voting UI + weighted tally + admin editor",
    },
    commitUrl: "https://github.com/Our-One/hall/commit/71bd3ab",
    demoUrl: "https://hall.our.one/inside/proposals/first-flagship",
    visibility: "public",
    publishedAt: new Date("2026-04-23T16:00:00Z"),
  },

  {
    slug: "cross-subdomain-sso-and-other-plumbing",
    title: "Cross-subdomain SSO, CSP, and other plumbing",
    bodyMd: `Not every Hall shipment is a new screen. Some are the unglamorous scaffolding that makes the visible surface work. This post documents a handful of them because the ethos is "build in public" — the plumbing counts.

## Single sign-on across *.our.one

One session, shared across every Our.one product. Sign in on our.one and visit hall.our.one and you&rsquo;re already signed in. Sign out from one and you&rsquo;re out of everything. The mechanism: the Auth.js session cookie is scoped to \`.our.one\` (not \`hall.our.one\` only), and every app shares the same \`AUTH_SECRET\` and the same Neon \`sessions\` table. Each app independently verifies the cookie and finds the same session row.

Future flagships at \`feed.our.one\` or \`notes.our.one\` inherit the flow for free. The founder asked the right question before we shipped — "how do we share auth?" — and the cookie-domain answer scales to the whole portfolio with zero per-repo SSO work.

## One OAuth App per provider, forever

GitHub&rsquo;s OAuth Apps only allow one callback URL per app. The naive pattern — one OAuth App per subdomain × one per provider — scales to 30+ OAuth Apps for a ten-flagship portfolio. No.

Instead: all OAuth Apps live on our.one. Hall&rsquo;s "Sign in with GitHub" button redirects to \`our.one/cross-signin?provider=github&callbackUrl=https://hall.our.one/inside\`. our.one runs the OAuth dance, the resulting cookie lands on \`.our.one\` (shared), and the user gets redirected back to Hall already signed in. Three OAuth Apps total, ever — no matter how many flagships launch.

## CSP — the one-line fix that looked like ten bugs

Two browser errors after deploy: Google OAuth refused to load, and magic-link sign-in 500&rsquo;d. Different-looking symptoms, same cause: the Content Security Policy we inherited from our.one had \`form-action 'self'\`, which blocks Auth.js from POSTing users out to accounts.google.com, github.com, or www.linkedin.com. And blocks our SSO proxy from submitting cross-subdomain too.

Fix: add the three OAuth provider origins plus \`https://*.our.one\` to the \`form-action\` directive. One line change in \`src/proxy.ts\` on both repos. Deployed, verified.

## Defensive rendering + health endpoint

During one Vercel deploy the \`DATABASE_URL\` was stale. The homepage 500&rsquo;d with a generic "Server Components render error," and the minified production build hid the detail. Two fixes:

- Every server call on the homepage (auth session lookup, posts query) is wrapped in try/catch. If the DB is unreachable, the page still renders with an amber banner instead of a white 500.
- \`/api/health\` surfaces **names** of missing required env vars (safe to expose — names aren&rsquo;t secrets). DB error messages stay redacted in production because connection strings leak through them.

The banner on the homepage tells readers exactly where to look (\`/api/health\` for diagnostics); the health endpoint tells operators exactly what to fix. Two minutes of work, multi-hour debugging cycle saved.

## What this post is really about

When you watch how a product gets built, the interesting parts aren&rsquo;t always the features. They&rsquo;re the decisions: what to factor out, when to swap backends, which kind of complexity is worth eating now versus kicking down the road. Hall&rsquo;s promise is that the whole decision trail is visible. This post is one day of it.`,
    heroUrl: null,
    heroKind: null,
    productSlug: "hall",
    aiSession: {
      prompts: 4,
      durationMin: 40,
      lines: 220,
      summary: "SSO cookie domain, cross-signin proxy, CSP + defensive rendering",
    },
    commitUrl: "https://github.com/Our-One/hall/commit/3e5115c",
    demoUrl: "https://hall.our.one/api/health",
    visibility: "public",
    publishedAt: new Date("2026-04-23T17:00:00Z"),
  },
];

async function main() {
  let created = 0;
  let skipped = 0;
  for (const post of POSTS) {
    const existing = await findPostBySlug(post.slug);
    if (existing) {
      console.log(`  ~ '${post.slug}' already exists, skipping`);
      skipped++;
      continue;
    }
    const row = await createPost(post);
    console.log(`  + '${row.slug}' created (id ${row.id})`);
    created++;
  }
  console.log(`\ndone — ${created} created, ${skipped} skipped`);
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  },
);
