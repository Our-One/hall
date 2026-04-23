"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOperatorSession } from "@/lib/operator";
import { createPost, updatePost, deletePost, findPostBySlug } from "@/lib/posts";
import { uploadAsset } from "@/lib/blob";
import { getDb } from "@/db/client";
import { users } from "@/db/external/auth";
import { eq } from "drizzle-orm";

interface PostFormValues {
  slug: string;
  title: string;
  bodyMd: string;
  heroUrl: string | null;
  heroKind: string | null;
  productSlug: string | null;
  aiSessionPrompts: number | null;
  aiSessionDurationMin: number | null;
  aiSessionLines: number | null;
  aiSessionSummary: string | null;
  commitUrl: string | null;
  demoUrl: string | null;
  visibility: "public" | "members" | "patrons";
}

function parseValues(form: FormData): PostFormValues {
  const numOrNull = (v: FormDataEntryValue | null) => {
    if (v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const strOrNull = (v: FormDataEntryValue | null) => {
    if (v === null) return null;
    const s = String(v).trim();
    return s.length === 0 ? null : s;
  };
  const visRaw = String(form.get("visibility") ?? "public");
  const visibility: PostFormValues["visibility"] =
    visRaw === "members" || visRaw === "patrons" ? visRaw : "public";

  return {
    slug: String(form.get("slug") ?? "").trim(),
    title: String(form.get("title") ?? "").trim(),
    bodyMd: String(form.get("bodyMd") ?? ""),
    heroUrl: strOrNull(form.get("heroUrl")),
    heroKind: strOrNull(form.get("heroKind")),
    productSlug: strOrNull(form.get("productSlug")),
    aiSessionPrompts: numOrNull(form.get("aiSessionPrompts")),
    aiSessionDurationMin: numOrNull(form.get("aiSessionDurationMin")),
    aiSessionLines: numOrNull(form.get("aiSessionLines")),
    aiSessionSummary: strOrNull(form.get("aiSessionSummary")),
    commitUrl: strOrNull(form.get("commitUrl")),
    demoUrl: strOrNull(form.get("demoUrl")),
    visibility,
  };
}

function buildAiSession(v: PostFormValues) {
  if (
    v.aiSessionPrompts === null &&
    v.aiSessionDurationMin === null &&
    v.aiSessionLines === null &&
    !v.aiSessionSummary
  ) {
    return null;
  }
  return {
    prompts: v.aiSessionPrompts ?? 0,
    durationMin: v.aiSessionDurationMin ?? 0,
    lines: v.aiSessionLines ?? 0,
    summary: v.aiSessionSummary ?? undefined,
  };
}

async function ensureUserId(email: string): Promise<string | null> {
  const db = getDb();
  const [u] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return u?.id ?? null;
}

export async function createPostAction(form: FormData) {
  const session = await getOperatorSession();
  if (!session?.user?.email) {
    throw new Error("Not authorized");
  }
  const v = parseValues(form);
  if (!v.title || !v.slug || !v.bodyMd) {
    throw new Error("Title, slug, and body are required");
  }
  const existing = await findPostBySlug(v.slug);
  if (existing) {
    throw new Error(`A post already exists at /p/${v.slug}`);
  }

  const authorId = await ensureUserId(session.user.email);

  const created = await createPost({
    slug: v.slug,
    title: v.title,
    bodyMd: v.bodyMd,
    heroUrl: v.heroUrl,
    heroKind: v.heroKind,
    productSlug: v.productSlug,
    aiSession: buildAiSession(v),
    commitUrl: v.commitUrl,
    demoUrl: v.demoUrl,
    authorId,
    visibility: v.visibility,
  });

  revalidatePath("/");
  revalidatePath("/inside/admin/posts");
  redirect(`/inside/admin/posts/${created.id}/edit`);
}

export async function updatePostAction(id: string, form: FormData) {
  const session = await getOperatorSession();
  if (!session?.user?.email) {
    throw new Error("Not authorized");
  }
  const v = parseValues(form);
  if (!v.title || !v.slug || !v.bodyMd) {
    throw new Error("Title, slug, and body are required");
  }

  await updatePost(id, {
    slug: v.slug,
    title: v.title,
    bodyMd: v.bodyMd,
    heroUrl: v.heroUrl,
    heroKind: v.heroKind,
    productSlug: v.productSlug,
    aiSession: buildAiSession(v),
    commitUrl: v.commitUrl,
    demoUrl: v.demoUrl,
    visibility: v.visibility,
  });

  revalidatePath("/");
  revalidatePath(`/p/${v.slug}`);
  revalidatePath("/inside/admin/posts");
  redirect(`/inside/admin/posts/${id}/edit?saved=1`);
}

export async function deletePostAction(id: string) {
  const session = await getOperatorSession();
  if (!session?.user?.email) {
    throw new Error("Not authorized");
  }
  await deletePost(id);
  revalidatePath("/");
  revalidatePath("/inside/admin/posts");
  redirect("/inside/admin/posts");
}

export async function uploadHeroAction(form: FormData): Promise<{ url: string; kind: "image" | "video" } | { error: string }> {
  const session = await getOperatorSession();
  if (!session?.user?.email) {
    return { error: "Not authorized" };
  }
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "No file selected" };
  }
  const authorId = await ensureUserId(session.user.email);
  if (!authorId) {
    return { error: "User record not found" };
  }
  try {
    const result = await uploadAsset({
      file,
      uploadedById: authorId,
      altText: String(form.get("altText") ?? "") || null,
    });
    return { url: result.url, kind: result.kind };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return { error: msg };
  }
}
