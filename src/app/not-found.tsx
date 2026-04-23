import Link from "next/link";
import { HallNav } from "@/components/nav";
import { HallFooter } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <HallNav />
      <main className="flex min-h-[calc(100vh-200px)] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
            Page not found
          </p>
          <h1 className="mt-4 font-serif text-4xl font-bold text-stone-900">
            Not in Hall.
          </h1>
          <p className="mt-4 font-serif text-stone-600">
            That URL doesn&rsquo;t lead anywhere on Hall yet.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center font-sans text-sm font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 hover:decoration-stone-900"
          >
            ← Back to the ship feed
          </Link>
        </div>
      </main>
      <HallFooter />
    </>
  );
}
