CREATE TABLE "hall_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"body_md" text NOT NULL,
	"hero_url" text,
	"hero_kind" text,
	"author_id" text,
	"product_slug" text,
	"ai_session" jsonb,
	"commit_url" text,
	"demo_url" text,
	"vote_id" text,
	"visibility" text DEFAULT 'public' NOT NULL,
	"published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "hall_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "hall_posts" ADD CONSTRAINT "hall_posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hall_posts_published_idx" ON "hall_posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "hall_posts_product_idx" ON "hall_posts" USING btree ("product_slug");