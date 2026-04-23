"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getOperatorSession } from "@/lib/operator";
import {
  createProposal,
  updateProposal,
  deleteProposal,
  findProposalBySlug,
} from "@/lib/proposals";
import type { ProposalChoice } from "@/db/schema/proposals";
import { getDb } from "@/db/client";
import { users } from "@/db/external/auth";

interface ProposalFormValues {
  slug: string;
  title: string;
  bodyMd: string;
  voteType: "yes_no" | "single_choice";
  scope: "framework" | "product";
  productSlug: string | null;
  status: "draft" | "open" | "closed";
  opensAt: Date | null;
  closesAt: Date | null;
  choices: ProposalChoice[] | null;
}

function parseValues(form: FormData): ProposalFormValues {
  const strOrNull = (v: FormDataEntryValue | null) => {
    if (v === null) return null;
    const s = String(v).trim();
    return s.length === 0 ? null : s;
  };
  const dateOrNull = (v: FormDataEntryValue | null) => {
    const s = strOrNull(v);
    if (!s) return null;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const voteTypeRaw = String(form.get("voteType") ?? "yes_no");
  const voteType: ProposalFormValues["voteType"] =
    voteTypeRaw === "single_choice" ? "single_choice" : "yes_no";

  const scopeRaw = String(form.get("scope") ?? "product");
  const scope: ProposalFormValues["scope"] =
    scopeRaw === "framework" ? "framework" : "product";

  const statusRaw = String(form.get("status") ?? "draft");
  const status: ProposalFormValues["status"] =
    statusRaw === "open" || statusRaw === "closed" ? statusRaw : "draft";

  let choices: ProposalChoice[] | null = null;
  if (voteType === "single_choice") {
    const raw = String(form.get("choicesJson") ?? "[]");
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        choices = parsed
          .filter(
            (c): c is ProposalChoice =>
              !!c && typeof c.id === "string" && typeof c.label === "string",
          )
          .slice(0, 20);
      }
    } catch {
      choices = null;
    }
  }

  return {
    slug: String(form.get("slug") ?? "").trim(),
    title: String(form.get("title") ?? "").trim(),
    bodyMd: String(form.get("bodyMd") ?? ""),
    voteType,
    scope,
    productSlug: strOrNull(form.get("productSlug")),
    status,
    opensAt: dateOrNull(form.get("opensAt")),
    closesAt: dateOrNull(form.get("closesAt")),
    choices,
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

export async function createProposalAction(form: FormData) {
  const session = await getOperatorSession();
  if (!session?.user?.email) throw new Error("Not authorized");

  const v = parseValues(form);
  if (!v.title || !v.slug || !v.bodyMd) {
    throw new Error("Title, slug, and body are required");
  }
  if (v.voteType === "single_choice" && (!v.choices || v.choices.length < 2)) {
    throw new Error("Single-choice proposals need at least two choices");
  }
  const existing = await findProposalBySlug(v.slug);
  if (existing) {
    throw new Error(`A proposal with slug '${v.slug}' already exists`);
  }

  const authorId = await ensureUserId(session.user.email);

  const created = await createProposal({
    slug: v.slug,
    title: v.title,
    bodyMd: v.bodyMd,
    voteType: v.voteType,
    scope: v.scope,
    productSlug: v.productSlug,
    status: v.status,
    opensAt: v.opensAt,
    closesAt: v.closesAt,
    choices: v.choices,
    authorId,
  });

  revalidatePath("/inside/proposals");
  revalidatePath("/inside/admin/proposals");
  redirect(`/inside/admin/proposals/${created.id}/edit`);
}

export async function updateProposalAction(id: string, form: FormData) {
  const session = await getOperatorSession();
  if (!session?.user?.email) throw new Error("Not authorized");

  const v = parseValues(form);
  if (!v.title || !v.slug || !v.bodyMd) {
    throw new Error("Title, slug, and body are required");
  }
  if (v.voteType === "single_choice" && (!v.choices || v.choices.length < 2)) {
    throw new Error("Single-choice proposals need at least two choices");
  }

  await updateProposal(id, {
    slug: v.slug,
    title: v.title,
    bodyMd: v.bodyMd,
    voteType: v.voteType,
    scope: v.scope,
    productSlug: v.productSlug,
    status: v.status,
    opensAt: v.opensAt,
    closesAt: v.closesAt,
    choices: v.choices,
  });

  revalidatePath("/inside/proposals");
  revalidatePath(`/inside/proposals/${v.slug}`);
  revalidatePath("/inside/admin/proposals");
  redirect(`/inside/admin/proposals/${id}/edit?saved=1`);
}

export async function deleteProposalAction(id: string) {
  const session = await getOperatorSession();
  if (!session?.user?.email) throw new Error("Not authorized");
  await deleteProposal(id);
  revalidatePath("/inside/proposals");
  revalidatePath("/inside/admin/proposals");
  redirect("/inside/admin/proposals");
}
