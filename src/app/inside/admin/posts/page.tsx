import Link from "next/link";
import { listAllPosts } from "@/lib/posts";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export const metadata = { title: "Posts" };

export default async function AdminPostsPage() {
  const posts = await listAllPosts();

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[64rem]">
        <div className="flex items-baseline justify-between">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            Posts
          </h1>
          <Link
            href="/inside/admin/posts/new"
            className="rounded-md bg-stone-900 px-4 py-2 font-sans text-sm font-medium text-[#FDFBF7] hover:bg-stone-700"
          >
            New post →
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-lg border border-stone-200 bg-white">
          {posts.length === 0 ? (
            <div className="px-6 py-12 text-center font-serif text-stone-600">
              No posts yet.{" "}
              <Link
                href="/inside/admin/posts/new"
                className="underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900"
              >
                Write the first one →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-stone-200">
              {posts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center justify-between gap-4 px-6 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/inside/admin/posts/${p.id}/edit`}
                      className="font-serif text-base font-medium text-stone-900 hover:underline decoration-stone-400 underline-offset-2"
                    >
                      {p.title}
                    </Link>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-stone-500">
                      <time dateTime={p.publishedAt.toISOString()}>
                        {dateFmt.format(p.publishedAt)}
                      </time>
                      <span>·</span>
                      <span>/p/{p.slug}</span>
                      <span>·</span>
                      <span className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-stone-600">
                        {p.visibility}
                      </span>
                      {p.productSlug && (
                        <>
                          <span>·</span>
                          <span>Our.one / {capitalize(p.productSlug)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <Link
                      href={`/p/${p.slug}`}
                      className="font-sans text-stone-500 hover:text-stone-900 hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/inside/admin/posts/${p.id}/edit`}
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

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
