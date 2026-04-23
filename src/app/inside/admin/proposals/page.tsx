import Link from "next/link";
import { listProposals } from "@/lib/proposals";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const metadata = { title: "Proposals (admin)" };

export default async function AdminProposalsPage() {
  const proposals = await listProposals({ includeDraft: true });

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[64rem]">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            Proposals
          </h1>
          <Link
            href="/inside/admin/proposals/new"
            className="rounded-md bg-stone-900 px-4 py-2 font-sans text-sm font-medium text-[#FDFBF7] hover:bg-stone-700"
          >
            New proposal →
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-stone-200 bg-white">
          {proposals.length === 0 ? (
            <div className="px-6 py-12 text-center font-serif text-stone-600">
              No proposals yet.{" "}
              <Link
                href="/inside/admin/proposals/new"
                className="underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900"
              >
                Open the first one →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {proposals.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/inside/admin/proposals/${p.id}/edit`}
                      className="font-serif text-base font-medium text-stone-900 hover:underline decoration-stone-400 underline-offset-2"
                    >
                      {p.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-stone-500">
                      <time dateTime={p.createdAt.toISOString()}>
                        {dateFmt.format(p.createdAt)}
                      </time>
                      <span>·</span>
                      <span>/inside/proposals/{p.slug}</span>
                      <span>·</span>
                      <span className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-stone-600">
                        {p.status}
                      </span>
                      <span>·</span>
                      <span>{p.scope}</span>
                      <span>·</span>
                      <span>
                        {p.totalVotes} {p.totalVotes === 1 ? "vote" : "votes"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {p.status !== "draft" && (
                      <Link
                        href={`/inside/proposals/${p.slug}`}
                        className="font-sans text-stone-500 hover:text-stone-900 hover:underline"
                      >
                        View
                      </Link>
                    )}
                    <Link
                      href={`/inside/admin/proposals/${p.id}/edit`}
                      className="font-sans text-stone-500 hover:text-stone-900 hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
