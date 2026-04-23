import {
  pgTable,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/id";
import { users } from "../external/auth";

/**
 * Hall proposals — the unit of governance.
 *
 * vote_type:
 *  - "yes_no": single yes/no question
 *  - "single_choice": pick one of N choices (stored in `choices` jsonb)
 *  (ranked / quadratic come later)
 *
 * status lifecycle:
 *  - "draft":  operator is preparing the proposal; not visible to members
 *  - "open":   members can vote; appears in /inside/proposals
 *  - "closed": voting closed; results final, no further votes accepted
 *
 * scope:
 *  - "framework": affects all of Our.one (Constitution amendments, fee changes)
 *      → Patron 2× governance weight applies in Phase 3
 *  - "product":   affects a single product (default)
 *      → 1× weight per member; operators have tiebreak authority
 */
export const proposals = pgTable(
  "hall_proposals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    bodyMd: text("body_md").notNull(),
    voteType: text("vote_type").notNull().default("yes_no"),
    choices: jsonb("choices"), // [{ id: string, label: string, description?: string }] for single_choice
    scope: text("scope").notNull().default("product"),
    productSlug: text("product_slug"), // null for scope = framework
    status: text("status").notNull().default("draft"),
    opensAt: timestamp("opens_at", { withTimezone: true }),
    closesAt: timestamp("closes_at", { withTimezone: true }),
    authorId: text("author_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("hall_proposals_status_idx").on(table.status),
    index("hall_proposals_product_idx").on(table.productSlug),
  ],
);

export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;

export interface ProposalChoice {
  id: string;
  label: string;
  description?: string;
}
