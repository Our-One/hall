"use client";

import { useState } from "react";
import type { Post } from "@/db/schema/posts";
import { uploadHeroAction } from "@/app/inside/admin/posts/_actions";

interface PostEditorProps {
  initial?: Post | null;
  action: (form: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  saved?: boolean;
}

const inputClass =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none";
const labelClass =
  "font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500";

export function PostEditor({ initial, action, onDelete, saved }: PostEditorProps) {
  const [heroUrl, setHeroUrl] = useState<string>(initial?.heroUrl ?? "");
  const [heroKind, setHeroKind] = useState<string>(initial?.heroKind ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const ai = (initial?.aiSession as
    | { prompts?: number; durationMin?: number; lines?: number; summary?: string }
    | null) ?? {};

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const result = await uploadHeroAction(fd);
      if ("error" in result) {
        setUploadError(result.error);
      } else {
        setHeroUrl(result.url);
        setHeroKind(result.kind);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="space-y-8">
      {saved && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-2 font-sans text-sm text-green-800">
          Saved.
        </div>
      )}

      <div className="space-y-2">
        <label className={labelClass} htmlFor="title">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={initial?.title ?? ""}
          placeholder="What shipped"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label className={labelClass} htmlFor="slug">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          required
          defaultValue={initial?.slug ?? ""}
          placeholder="hall-publishing-tool-live"
          pattern="[a-z0-9-]+"
          className={`${inputClass} font-mono`}
        />
        <p className="font-sans text-xs text-stone-500">
          Public URL will be /p/&lt;slug&gt;. Lowercase, hyphens only.
        </p>
      </div>

      {/* Hero media */}
      <div className="space-y-3">
        <label className={labelClass}>Hero media (optional)</label>
        <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
          {heroUrl ? (
            <div className="space-y-3">
              {heroKind === "video" ? (
                <video src={heroUrl} controls className="w-full max-h-64 rounded" />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={heroUrl} alt="" className="w-full max-h-64 object-cover rounded" />
              )}
              <button
                type="button"
                onClick={() => {
                  setHeroUrl("");
                  setHeroKind("");
                }}
                className="font-sans text-xs text-stone-600 underline underline-offset-2 hover:text-stone-900"
              >
                Remove hero
              </button>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleHeroUpload}
                disabled={uploading}
                className="font-sans text-sm"
              />
              {uploading && (
                <p className="mt-2 font-sans text-xs text-stone-500">Uploading…</p>
              )}
              {uploadError && (
                <p className="mt-2 font-sans text-xs text-red-600">{uploadError}</p>
              )}
            </div>
          )}
        </div>
        <input type="hidden" name="heroUrl" value={heroUrl} />
        <input type="hidden" name="heroKind" value={heroKind} />
      </div>

      <div className="space-y-2">
        <label className={labelClass} htmlFor="bodyMd">
          Body (Markdown)
        </label>
        <textarea
          id="bodyMd"
          name="bodyMd"
          required
          rows={20}
          defaultValue={initial?.bodyMd ?? ""}
          placeholder={"## What just shipped\n\nWrite the post body here. Markdown is supported.\n\nUse ##, **bold**, [links](https://...), code blocks, lists.\n"}
          className={`${inputClass} resize-y font-mono leading-relaxed`}
        />
      </div>

      {/* Receipts */}
      <fieldset className="space-y-4 rounded-md border border-stone-200 bg-stone-50 p-5">
        <legend className="px-2 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500">
          Receipts (optional)
        </legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <label className={labelClass} htmlFor="aiSessionPrompts">
              AI prompts
            </label>
            <input
              id="aiSessionPrompts"
              name="aiSessionPrompts"
              type="number"
              min="0"
              defaultValue={ai.prompts ?? ""}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass} htmlFor="aiSessionDurationMin">
              Duration (min)
            </label>
            <input
              id="aiSessionDurationMin"
              name="aiSessionDurationMin"
              type="number"
              min="0"
              defaultValue={ai.durationMin ?? ""}
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass} htmlFor="aiSessionLines">
              Lines of code
            </label>
            <input
              id="aiSessionLines"
              name="aiSessionLines"
              type="number"
              min="0"
              defaultValue={ai.lines ?? ""}
              className={inputClass}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="aiSessionSummary">
            AI session summary (optional)
          </label>
          <input
            id="aiSessionSummary"
            name="aiSessionSummary"
            type="text"
            defaultValue={ai.summary ?? ""}
            placeholder="Built operator publishing tool"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={labelClass} htmlFor="commitUrl">
              Commit URL
            </label>
            <input
              id="commitUrl"
              name="commitUrl"
              type="url"
              defaultValue={initial?.commitUrl ?? ""}
              placeholder="https://github.com/Our-One/hall/commit/..."
              className={inputClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass} htmlFor="demoUrl">
              Demo URL
            </label>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              defaultValue={initial?.demoUrl ?? ""}
              placeholder="https://hall.our.one/inside/..."
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="productSlug">
            Product slug
          </label>
          <input
            id="productSlug"
            name="productSlug"
            type="text"
            defaultValue={initial?.productSlug ?? "hall"}
            placeholder="hall"
            className={`${inputClass} font-mono`}
          />
        </div>
        <div className="space-y-1">
          <label className={labelClass} htmlFor="visibility">
            Visibility
          </label>
          <select
            id="visibility"
            name="visibility"
            defaultValue={initial?.visibility ?? "public"}
            className={inputClass}
          >
            <option value="public">Public (preview visible to non-members)</option>
            <option value="members">Members only (full content for signed-in)</option>
            <option value="patrons">Patrons only</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-200 pt-6">
        <div>
          {onDelete && (
            <form action={onDelete}>
              <button
                type="submit"
                className="font-sans text-sm text-red-600 hover:text-red-800"
                onClick={(e) => {
                  if (!confirm("Delete this post? This cannot be undone.")) {
                    e.preventDefault();
                  }
                }}
              >
                Delete post
              </button>
            </form>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-6 py-3 font-sans text-sm font-medium text-[#FDFBF7] hover:bg-stone-700"
        >
          {initial ? "Save changes" : "Publish post"}
        </button>
      </div>
    </form>
  );
}
