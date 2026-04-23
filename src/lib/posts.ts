import { desc, eq, and, ne } from "drizzle-orm";
import { getDb } from "@/db/client";
import { posts, type Post, type NewPost } from "@/db/schema/posts";
import { users } from "@/db/external/auth";
import type { PostCardData, AISession, VoteRef } from "@/components/post-card";

interface PostWithAuthor extends Post {
  authorName: string | null;
}

async function fetchPostsWithAuthor(includeUnpublished: boolean): Promise<PostWithAuthor[]> {
  const db = getDb();
  const rows = await db
    .select({
      post: posts,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(includeUnpublished ? undefined : ne(posts.visibility, "draft"))
    .orderBy(desc(posts.publishedAt));

  return rows.map((r) => ({ ...r.post, authorName: r.authorName }));
}

export async function listPublishedPosts(): Promise<PostCardData[]> {
  const rows = await fetchPostsWithAuthor(false);
  return rows.map(toPostCardData);
}

export async function listAllPosts(): Promise<PostWithAuthor[]> {
  return fetchPostsWithAuthor(true);
}

export async function getPostBySlug(slug: string): Promise<PostCardData | null> {
  const db = getDb();
  const [row] = await db
    .select({
      post: posts,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.slug, slug))
    .limit(1);

  if (!row) return null;
  return toPostCardData({ ...row.post, authorName: row.authorName });
}

export async function getPostById(id: string): Promise<PostWithAuthor | null> {
  const db = getDb();
  const [row] = await db
    .select({
      post: posts,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id))
    .limit(1);

  if (!row) return null;
  return { ...row.post, authorName: row.authorName };
}

export async function createPost(values: NewPost): Promise<Post> {
  const db = getDb();
  const [created] = await db.insert(posts).values(values).returning();
  return created;
}

export async function updatePost(id: string, values: Partial<NewPost>): Promise<Post | null> {
  const db = getDb();
  const [updated] = await db
    .update(posts)
    .set({ ...values, updatedAt: new Date() })
    .where(eq(posts.id, id))
    .returning();
  return updated ?? null;
}

export async function deletePost(id: string): Promise<void> {
  const db = getDb();
  await db.delete(posts).where(eq(posts.id, id));
}

export async function findPostBySlug(slug: string): Promise<Post | null> {
  const db = getDb();
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return row ?? null;
}

function toPostCardData(p: PostWithAuthor): PostCardData {
  return {
    slug: p.slug,
    title: p.title,
    bodyMd: p.bodyMd,
    heroUrl: p.heroUrl,
    heroKind: (p.heroKind as PostCardData["heroKind"]) ?? null,
    authorName: p.authorName ?? "Operator",
    productSlug: p.productSlug,
    aiSession: (p.aiSession as AISession | null) ?? null,
    commitUrl: p.commitUrl,
    demoUrl: p.demoUrl,
    voteRef: null as VoteRef | null, // wired in Phase 2b alongside proposals
    publishedAt: p.publishedAt,
    visibility: (p.visibility as PostCardData["visibility"]) ?? "public",
  };
}

// Re-export for callers that need the Drizzle type
export type { Post, NewPost };
export type { PostWithAuthor };
