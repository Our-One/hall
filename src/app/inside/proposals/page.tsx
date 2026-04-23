import Link from "next/link";
import { listProposals } from "@/lib/proposals";
import { ProposalCard } from "@/components/proposal-card";

export const metadata = { title: "Proposals" };
export const dynamic = "force-dynamic";

export default async function ProposalsListPage() {
  const proposals = await listProposals();

  const open = proposals.filter((p) => p.status === "open");
  const closed = proposals.filter((p) => p.status === "closed");

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[64rem]">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
          Proposals
        </p>
        <h1 className="mt-6 font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Vote, watch, decide.
        </h1>
        <p className="mt-4 max-w-2xl font-serif text-lg text-stone-600">
          Active proposals affect what Our.one builds, the constitution, and
          the parent company. Vote weight is shown on each proposal. Voting
          once per proposal is final.
        </p>

        {open.length > 0 && (
          <section className="mt-12">
            <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
              Open
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {open.map((p) => (
                <ProposalCard
                  key={p.id}
                  proposal={p}
                  href={`/inside/proposals/${p.slug}`}
                />
              ))}
            </div>
          </section>
        )}

        {open.length === 0 && (
          <div className="mt-12 rounded-xl border border-stone-200 bg-white px-6 py-10 text-center">
            <p className="font-serif text-lg text-stone-700">
              No proposals open right now.
            </p>
            <p className="mt-3 font-sans text-sm text-stone-500">
              When operators open a vote, it lands here. Closed proposals
              with results stay below for the record.
            </p>
          </div>
        )}

        {closed.length > 0 && (
          <section className="mt-12">
            <h2 className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
              Closed
            </h2>
            <div className="mt-5 flex flex-col gap-4">
              {closed.map((p) => (
                <ProposalCard
                  key={p.id}
                  proposal={p}
                  href={`/inside/proposals/${p.slug}`}
                />
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 border-t border-stone-200 pt-6 font-sans text-xs text-stone-500">
          Operators can <Link href="/inside/admin/proposals" className="underline underline-offset-4 hover:text-stone-900">manage proposals</Link>.
        </div>
      </div>
    </div>
  );
}
