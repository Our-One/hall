import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";
import { PostEditor } from "@/components/post-editor";
import { updatePostAction, deletePostAction } from "../../_actions";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export const metadata = { title: "Edit post" };

export default async function EditPostPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const post = await getPostById(id);
  if (!post) notFound();

  const update = updatePostAction.bind(null, id);
  const remove = deletePostAction.bind(null, id);

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[44rem]">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Edit post
        </h1>
        <p className="mt-3 font-sans text-sm text-stone-600">
          Editing &ldquo;{post.title}&rdquo; — public at /p/{post.slug}
        </p>

        <div className="mt-10">
          <PostEditor
            initial={post}
            action={update}
            onDelete={remove}
            saved={saved === "1"}
          />
        </div>
      </div>
    </div>
  );
}
