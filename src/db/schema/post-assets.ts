import { pgTable, text, timestamp, integer, index } from "drizzle-orm/pg-core";
import { generateId } from "@/lib/id";
import { posts } from "./posts";
import { users } from "../external/auth";

/**
 * Hall post assets — uploaded media tied to a post.
 *
 * Used for hero images/videos and inline references in the body. Each asset
 * is a Vercel Blob upload; we store the public URL plus mime/size metadata
 * for display + future cleanup tooling.
 */
export const postAssets = pgTable(
  "hall_post_assets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    postId: text("post_id").references(() => posts.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes"),
    altText: text("alt_text"),
    uploadedById: text("uploaded_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("hall_post_assets_post_idx").on(table.postId),
    index("hall_post_assets_uploaded_idx").on(table.createdAt),
  ],
);

export type PostAsset = typeof postAssets.$inferSelect;
export type NewPostAsset = typeof postAssets.$inferInsert;
