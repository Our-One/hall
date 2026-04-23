import { PostEditor } from "@/components/post-editor";
import { createPostAction } from "../_actions";

export const metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[44rem]">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          New post
        </h1>
        <p className="mt-3 font-sans text-sm text-stone-600">
          Document what just shipped. Written here, posted to the public ship feed at /, and (when relevant) the marketing /build-log.
        </p>

        <div className="mt-10">
          <PostEditor action={createPostAction} />
        </div>
      </div>
    </div>
  );
}
