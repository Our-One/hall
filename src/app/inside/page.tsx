import Link from "next/link";
import { auth } from "@/auth";

export default async function InsidePage() {
  const session = await auth();
  const name = session?.user?.name ?? session?.user?.email ?? "member";

  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[48rem]">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
          Inside Our.one / Hall
        </p>
        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 md:text-5xl">
          Welcome, {name}.
        </h1>
        <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-stone-600 md:text-xl">
          You&rsquo;re looking at the members-only side of Hall. Right now this is a
          quiet placeholder while we build the rest of the platform.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <PlaceholderCard
            label="Active votes"
            body="No proposals open yet. The first vote — which flagship do we build first — opens once the Member tier is live."
          />
          <PlaceholderCard
            label="Treasury"
            body="Live revenue, direct costs, and distribution by role appear here when Stripe is wired in. Coming soon."
          />
          <PlaceholderCard
            label="Member directory"
            body={
              <>
                See who&rsquo;s here.{" "}
                <Link href="/inside/members" className="underline underline-offset-4">
                  Browse members →
                </Link>
              </>
            }
          />
          <PlaceholderCard
            label="Constitution"
            body={
              <>
                The eleven binding commitments.{" "}
                <Link href="/inside/constitution" className="underline underline-offset-4">
                  Read the Constitution →
                </Link>
              </>
            }
          />
        </div>

        <div className="mt-16 border-t border-stone-200 pt-12">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
            What ships next
          </p>
          <p className="mt-4 font-serif text-xl leading-relaxed text-stone-700">
            Voting UI · Treasury dashboard · Comments · Email digest · First
            flagship proposal. All live in the open at{" "}
            <a
              href="https://github.com/Our-One/hall"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900"
            >
              github.com/Our-One/hall
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaceholderCard({
  label,
  body,
}: {
  label: string;
  body: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
        {label}
      </p>
      <p className="mt-3 font-serif text-base leading-relaxed text-stone-700">
        {body}
      </p>
    </div>
  );
}
