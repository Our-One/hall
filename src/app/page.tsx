import Link from "next/link";
import { auth } from "@/auth";
import { HallNav } from "@/components/nav";
import { HallFooter } from "@/components/footer";
import { PostCard } from "@/components/post-card";
import { SEED_POSTS } from "@/lib/seed-posts";

export default async function HomePage() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <>
      <HallNav />
      <main className="min-h-[calc(100vh-200px)]">
        {/* Hero */}
        <section className="border-b border-stone-200 bg-[#FDFBF7] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-[64rem]">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
              Our.one / Hall
            </p>
            <h1 className="mt-6 font-serif text-4xl font-bold leading-[1.05] tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
              The ship feed.
            </h1>
            <p className="mt-6 max-w-2xl font-serif text-lg leading-relaxed text-stone-600 md:text-xl">
              Every shipped change to Our.one and every product under it lands
              here. Watch the building. Read the AI sessions. See the receipts.
              Members vote, comment, and earn from every product they help
              build.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              {!isAuthed && (
                <>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center border-2 border-stone-900 bg-stone-900 px-6 py-3 font-sans text-sm font-medium text-[#FDFBF7] transition-colors hover:border-stone-700 hover:bg-stone-700"
                  >
                    Sign in
                  </Link>
                  <a
                    href="https://our.one/join"
                    className="inline-flex items-center justify-center font-sans text-sm font-medium text-stone-900 underline decoration-stone-300 underline-offset-[6px] transition-colors hover:decoration-stone-900"
                  >
                    Become a Founding Patron →
                  </a>
                </>
              )}
              {isAuthed && (
                <Link
                  href="/inside"
                  className="inline-flex items-center justify-center border-2 border-stone-900 bg-stone-900 px-6 py-3 font-sans text-sm font-medium text-[#FDFBF7] transition-colors hover:border-stone-700 hover:bg-stone-700"
                >
                  Go inside →
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Ship feed */}
        <section className="px-6 py-12 md:py-16">
          <div className="mx-auto max-w-[64rem]">
            <div className="flex flex-col gap-8 md:gap-10">
              {SEED_POSTS.map((post) => (
                <PostCard key={post.slug} post={post} isAuthed={isAuthed} />
              ))}
            </div>

            {SEED_POSTS.length === 0 && (
              <div className="rounded-xl border border-stone-200 bg-white p-12 text-center">
                <p className="font-serif text-xl text-stone-700">
                  No ships yet. Check back soon.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <HallFooter />
    </>
  );
}
