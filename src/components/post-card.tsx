import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";

export interface PostCardData {
  slug: string;
  title: string;
  bodyMd: string;
  heroUrl: string | null;
  heroKind: "image" | "video" | "demo" | null;
  authorName: string;
  productSlug: string | null;
  aiSession: AISession | null;
  commitUrl: string | null;
  demoUrl: string | null;
  voteRef: VoteRef | null;
  publishedAt: Date;
  visibility: "public" | "members" | "patrons";
}

export interface AISession {
  prompts: number;
  durationMin: number;
  lines: number;
  summary?: string;
}

export interface VoteRef {
  id: string;
  number: number;
  yes: number;
  no: number;
}

interface PostCardProps {
  post: PostCardData;
  isAuthed: boolean;
  showFullBody?: boolean;
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export async function PostCard({ post, isAuthed, showFullBody = false }: PostCardProps) {
  const lockedByVisibility =
    !isAuthed && (post.visibility === "members" || post.visibility === "patrons");
  const showBody = showFullBody && !lockedByVisibility;
  const html = showBody ? await renderMarkdown(post.bodyMd) : "";

  return (
    <article className="overflow-hidden rounded-xl border border-stone-200 bg-white transition-shadow hover:shadow-sm">
      {post.heroUrl && post.heroKind === "image" && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.heroUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {post.heroUrl && post.heroKind === "video" && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-black">
          <video
            src={post.heroUrl}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {post.heroUrl && post.heroKind === "demo" && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
          <iframe
            src={post.heroUrl}
            title={post.title}
            className="h-full w-full"
          />
        </div>
      )}

      <div className="px-7 py-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-stone-500">
          <time dateTime={post.publishedAt.toISOString()}>
            {dateFmt.format(post.publishedAt)}
          </time>
          <span aria-hidden>·</span>
          <span>{post.authorName}</span>
          {post.productSlug && (
            <>
              <span aria-hidden>·</span>
              <span>Our.one / {post.productSlug.replace(/^./, (c) => c.toUpperCase())}</span>
            </>
          )}
        </div>

        <h2 className="mt-4 font-serif text-2xl font-bold leading-tight tracking-tight text-stone-900 md:text-3xl">
          {showFullBody ? (
            post.title
          ) : (
            <Link
              href={`/p/${post.slug}`}
              className="text-stone-900 hover:underline decoration-stone-400 underline-offset-4"
            >
              {post.title}
            </Link>
          )}
        </h2>

        {showBody ? (
          <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="mt-4 line-clamp-3 font-sans text-base leading-relaxed text-stone-600">
            {summarize(post.bodyMd)}
          </p>
        )}

        {(post.aiSession || post.commitUrl || post.voteRef || post.demoUrl) && (
          <div className="receipts mt-6 flex flex-col gap-1.5 border-t border-stone-100 pt-4">
            {post.aiSession && (
              <div>
                <span className="text-stone-400">▸ AI session:</span>{" "}
                {post.aiSession.prompts} prompts, {post.aiSession.durationMin} min,{" "}
                {post.aiSession.lines.toLocaleString()} lines
                {post.aiSession.summary ? ` — ${post.aiSession.summary}` : ""}
              </div>
            )}
            {post.voteRef && (
              <div>
                <span className="text-stone-400">▸ Triggered by</span>{" "}
                vote #{post.voteRef.number} ({post.voteRef.yes} yes / {post.voteRef.no} no)
              </div>
            )}
            {post.commitUrl && (
              <div>
                <span className="text-stone-400">▸ Commit</span>{" "}
                <a href={post.commitUrl} target="_blank" rel="noreferrer" className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700">
                  {commitShort(post.commitUrl)}
                </a>
              </div>
            )}
            {post.demoUrl && (
              <div>
                <span className="text-stone-400">▸ Demo</span>{" "}
                <a href={post.demoUrl} target="_blank" rel="noreferrer" className="underline decoration-stone-300 underline-offset-2 hover:decoration-stone-700">
                  {post.demoUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        )}

        {lockedByVisibility && !showFullBody && (
          <div className="mt-6 rounded-md border border-stone-200 bg-[#F5F2EB] px-5 py-4 font-sans text-sm text-stone-700">
            Full content for members.{" "}
            <Link href="/login" className="font-medium underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900">
              Sign in
            </Link>{" "}
            or{" "}
            <a href="https://our.one/join" className="font-medium underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900">
              become a Founding Patron
            </a>
            .
          </div>
        )}
      </div>
    </article>
  );
}

function summarize(md: string): string {
  const stripped = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/[#>*_`]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return stripped.length > 280 ? stripped.slice(0, 277) + "…" : stripped;
}

function commitShort(url: string): string {
  const m = url.match(/\/commit\/([a-f0-9]+)/i);
  return m ? m[1].slice(0, 7) : url.replace(/^https?:\/\/(www\.)?/, "");
}
