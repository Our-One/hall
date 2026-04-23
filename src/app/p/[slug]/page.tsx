import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { HallNav } from "@/components/nav";
import { HallFooter } from "@/components/footer";
import { PostCard } from "@/components/post-card";
import { getPostBySlug } from "@/lib/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.bodyMd.slice(0, 160).replace(/[#*_`]/g, ""),
    openGraph: {
      title: post.title,
      type: "article",
      url: `https://hall.our.one/p/${slug}`,
      images: post.heroUrl ? [{ url: post.heroUrl }] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <>
      <HallNav />
      <main className="min-h-[calc(100vh-200px)] px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[48rem]">
          <PostCard post={post} isAuthed={isAuthed} showFullBody />
        </div>
      </main>
      <HallFooter />
    </>
  );
}
