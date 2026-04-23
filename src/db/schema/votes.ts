import {
  pgTable,
  text,
  timestamp,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { generateId } from "@/lib/id";
import { proposals } from "./proposals";
import { users } from "../external/auth";

/**
 * Hall votes — one row per (proposal, member).
 *
 * choice:
 *  - For yes_no: "yes" | "no"
 *  - For single_choice: the chosen choice id
 *
 * weight is captured at cast time so changes to the member's tier (e.g. a
 * Patron upgrade) don't retroactively re-weight past votes. Constitutional:
 * "amendments apply to future revenue only — earned shares remain under the
 * terms that produced them." Same principle for votes.
 *
 * voterScope is "framework" or "product" — copied from the proposal at cast
 * time so we can recompute weighted totals consistently if scope ever
 * changes meaning.
 */
export const votes = pgTable(
  "hall_votes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => generateId()),
    proposalId: text("proposal_id")
      .notNull()
      .references(() => proposals.id, { onDelete: "cascade" }),
    memberId: text("member_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    choice: text("choice").notNull(),
    weight: integer("weight").notNull(),
    voterScope: text("voter_scope").notNull(),
    castAt: timestamp("cast_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("hall_votes_proposal_member_uniq").on(
      table.proposalId,
      table.memberId,
    ),
    index("hall_votes_proposal_idx").on(table.proposalId),
  ],
);

export type Vote = typeof votes.$inferSelect;
export type NewVote = typeof votes.$inferInsert;
