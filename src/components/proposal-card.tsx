import Link from "next/link";
import type { Proposal } from "@/db/schema/proposals";

interface ProposalCardProps {
  proposal: Proposal & { totalVotes: number; totalWeight: number };
  href: string;
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

export function ProposalCard({ proposal, href }: ProposalCardProps) {
  return (
    <article className="rounded-xl border border-stone-200 bg-white px-7 py-6 transition-shadow hover:shadow-sm">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-stone-500">
        <span
          className={`rounded-sm px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.15em] ${statusStyle[proposal.status] ?? "bg-stone-100 text-stone-600"}`}
        >
          {proposal.status}
        </span>
        <span className="rounded-sm bg-stone-100 px-2 py-0.5 text-[10px] uppercase tracking-[0.15em] text-stone-600">
          {proposal.scope}
        </span>
        {proposal.productSlug && (
          <span>
            Our.one / {proposal.productSlug.replace(/^./, (c) => c.toUpperCase())}
          </span>
        )}
        <span className="ml-auto">
          {proposal.totalVotes} {proposal.totalVotes === 1 ? "vote" : "votes"}
          {proposal.totalWeight !== proposal.totalVotes && (
            <> · {proposal.totalWeight} weight</>
          )}
        </span>
      </div>

      <h2 className="mt-3 font-serif text-xl font-bold leading-snug text-stone-900 md:text-2xl">
        <Link href={href} className="hover:underline decoration-stone-400 underline-offset-4">
          {proposal.title}
        </Link>
      </h2>

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-stone-500">
        {proposal.opensAt && (
          <span>Opened {dateFmt.format(proposal.opensAt)}</span>
        )}
        {proposal.closesAt && (
          <span>· Closes {dateFmt.format(proposal.closesAt)}</span>
        )}
      </div>
    </article>
  );
}
