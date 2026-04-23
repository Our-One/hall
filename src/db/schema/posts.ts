import {
  pgTable,
  text,
  timestamp,
  index,
  jsonb,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/id";
import { users } from "../external/auth";

/**
 * Hall posts — the unit of building-in-public.
 *
 * Every shipped change becomes a post. Each post supports four blocks:
 *  - Visual proof (heroUrl + heroKind: image, video, demo iframe URL)
 *  - Narrative (bodyMd, rendered as markdown)
 *  - Receipts (aiSession, commitUrl, demoUrl, voteId)
 *  - Social (comments, reactions — separate tables)
 *
 * visibility:
 *  - "public": title + hero + meta visible to non-members; full body locked
 *  - "members": full content requires login
 *  - "patrons": Patron-only content (rare; declared per post)
 */
export const posts = pgTable(
  "hall_posts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    bodyMd: text("body_md").notNull(),
    heroUrl: text("hero_url"),
    heroKind: text("hero_kind"), // 'image' | 'video' | 'demo'
    authorId: text("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    productSlug: text("product_slug"), // 'hall' | future flagship slugs
    aiSession: jsonb("ai_session"), // { prompts: number, durationMin: number, lines: number, summary?: string }
    commitUrl: text("commit_url"),
    demoUrl: text("demo_url"),
    voteId: text("vote_id"), // FK to proposals when that table lands
    visibility: text("visibility").notNull().default("public"), // 'public' | 'members' | 'patrons'
    publishedAt: timestamp("published_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("hall_posts_published_idx").on(table.publishedAt),
    index("hall_posts_product_idx").on(table.productSlug),
  ],
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
