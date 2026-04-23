CREATE TABLE "hall_post_assets" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text,
	"url" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer,
	"alt_text" text,
	"uploaded_by_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hall_post_assets" ADD CONSTRAINT "hall_post_assets_post_id_hall_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."hall_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hall_post_assets" ADD CONSTRAINT "hall_post_assets_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "hall_post_assets_post_idx" ON "hall_post_assets" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "hall_post_assets_uploaded_idx" ON "hall_post_assets" USING btree ("created_at");