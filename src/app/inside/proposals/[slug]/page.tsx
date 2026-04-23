import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import {
  getProposalBySlug,
  getResults,
  getMyVote,
  castVote,
} from "@/lib/proposals";
import { renderMarkdown } from "@/lib/markdown";
import { VoteForm } from "@/components/vote-form";
import { VoteResults } from "@/components/vote-results";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProposalBySlug(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.bodyMd.slice(0, 160).replace(/[#*_`]/g, ""),
  };
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const statusStyle: Record<string, string> = {
  draft: "bg-stone-100 text-stone-600",
  open: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  closed: "bg-stone-200 text-stone-700",
};

export default async function ProposalDetailPage({ params }: Props) {
  const { slug: slugParam } = await params;
  const proposalData = await getProposalBySlug(slugParam);
  if (!proposalData) notFound();
  const proposal = proposalData;
  const proposalId = proposal.id;

  const session = await auth();
  const userId = session?.user?.id ?? null;
  const myVote = userId ? await getMyVote(proposalId, userId) : null;
  const results = await getResults(proposalId);
  const html = await renderMarkdown(proposal.bodyMd);

  // Server action — gets the current session, casts vote
  async function vote(choice: string) {
    "use server";
    const s = await auth();
    if (!s?.user?.id) {
      return { ok: false as const, error: "You must be signed in to vote." };
    }
    const result = await castVote({
      proposal,
      voter: { userId: s.user.id, email: s.user.email },
      choice,
    });
    return result;
  }

  const isOpen = proposal.status === "open";

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[48rem]">
        <Link
          href="/inside/proposals"
          className="inline-flex font-sans text-xs text-stone-500 hover:text-stone-900"
        >
          ← All proposals
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-sm px-2 py-0.5 font-sans text-[10px] font-medium uppercase tracking-[0.15em] ${statusStyle[proposal.status] ?? "bg-stone-100 text-stone-600"}`}
          >
            {proposal.status}
          </span>
          <span className="rounded-sm bg-stone-100 px-2 py-0.5 font-sans text-[10px] uppercase tracking-[0.15em] text-stone-600">
            {proposal.scope}
          </span>
          {proposal.productSlug && (
            <span className="font-sans text-xs text-stone-500">
              Our.one / {proposal.productSlug.replace(/^./, (c) => c.toUpperCase())}
            </span>
          )}
        </div>

        <h1 className="mt-4 font-serif text-3xl font-bold leading-tight tracking-tight text-stone-900 md:text-4xl">
          {proposal.title}
        </h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-stone-500">
          {proposal.authorName && <span>by {proposal.authorName}</span>}
          {proposal.opensAt && (
            <span>· Opened {dateFmt.format(proposal.opensAt)}</span>
          )}
          {proposal.closesAt && (
            <span>· Closes {dateFmt.format(proposal.closesAt)}</span>
          )}
        </div>

        <article className="prose mt-8" dangerouslySetInnerHTML={{ __html: html }} />

        <section className="mt-12 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
            Your vote
          </h2>
          <div className="mt-4">
            <VoteForm
              proposal={proposal}
              myVote={myVote}
              isSignedIn={!!session?.user}
              isOpen={isOpen}
              action={vote}
            />
          </div>
        </section>

        <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
            Live results
          </h2>
          <div className="mt-5">
            <VoteResults
              proposal={proposal}
              results={results}
              totalVotes={proposal.totalVotes}
              totalWeight={proposal.totalWeight}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
