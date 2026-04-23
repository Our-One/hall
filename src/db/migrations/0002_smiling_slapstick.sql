CREATE TABLE "hall_proposals" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body_md" text NOT NULL,
	"vote_type" text DEFAULT 'yes_no' NOT NULL,
	"choices" jsonb,
	"scope" text DEFAULT 'product' NOT NULL,
	"product_slug" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"opens_at" timestamp with time zone,
	"closes_at" timestamp with time zone,
	"author_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hall_proposals_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "hall_votes" (
	"id" text PRIMARY KEY NOT NULL,
	"proposal_id" text NOT NULL,
	"member_id" text NOT NULL,
	"choice" text NOT NULL,
	"weight" integer NOT NULL,
	"voter_scope" text NOT NULL,
	"cast_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hall_proposals" ADD CONSTRAINT "hall_proposals_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hall_votes" ADD CONSTRAINT "hall_votes_proposal_id_hall_proposals_id_fk" FOREIGN KEY ("proposal_id") REFERENCES "public"."hall_proposals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hall_votes" ADD CONSTRAINT "hall_votes_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hall_proposals_status_idx" ON "hall_proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "hall_proposals_product_idx" ON "hall_proposals" USING btree ("product_slug");--> statement-breakpoint
CREATE UNIQUE INDEX "hall_votes_proposal_member_uniq" ON "hall_votes" USING btree ("proposal_id","member_id");--> statement-breakpoint
CREATE INDEX "hall_votes_proposal_idx" ON "hall_votes" USING btree ("proposal_id");