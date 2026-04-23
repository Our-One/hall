"use client";

import { useState } from "react";
import type { Proposal, ProposalChoice } from "@/db/schema/proposals";

interface ProposalEditorProps {
  initial?: Proposal | null;
  action: (form: FormData) => Promise<void>;
  onDelete?: () => Promise<void>;
  saved?: boolean;
}

const inputClass =
  "w-full rounded-md border border-stone-300 bg-white px-3 py-2 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none";
const labelClass =
  "font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500";

function toLocalInput(d: Date | string | null): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  // Convert to local datetime-local input format
  const tzOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function ProposalEditor({ initial, action, onDelete, saved }: ProposalEditorProps) {
  const [voteType, setVoteType] = useState<string>(initial?.voteType ?? "yes_no");
  const [choices, setChoices] = useState<ProposalChoice[]>(
    (initial?.choices as ProposalChoice[] | null) ?? [
      { id: "a", label: "" },
      { id: "b", label: "" },
    ],
  );

  function addChoice() {
    const id = String.fromCharCode(97 + choices.length); // a, b, c…
    setChoices([...choices, { id, label: "" }]);
  }

  function updateChoice(idx: number, patch: Partial<ProposalChoice>) {
    setChoices(choices.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  }

  function removeChoice(idx: number) {
    setChoices(choices.filter((_, i) => i !== idx));
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
          placeholder="The question we're voting on"
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
          placeholder="which-flagship-first"
          pattern="[a-z0-9-]+"
          className={`${inputClass} font-mono`}
        />
        <p className="font-sans text-xs text-stone-500">
          URL: /inside/proposals/&lt;slug&gt;. Lowercase, hyphens only.
        </p>
      </div>

      <div className="space-y-2">
        <label className={labelClass} htmlFor="bodyMd">
          Body (Markdown)
        </label>
        <textarea
          id="bodyMd"
          name="bodyMd"
          required
          rows={14}
          defaultValue={initial?.bodyMd ?? ""}
          placeholder="Context, background, what each choice means."
          className={`${inputClass} resize-y font-mono leading-relaxed`}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass} htmlFor="voteType">
            Vote type
          </label>
          <select
            id="voteType"
            name="voteType"
            value={voteType}
            onChange={(e) => setVoteType(e.target.value)}
            className={inputClass}
          >
            <option value="yes_no">Yes / No</option>
            <option value="single_choice">Single choice (pick one)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="scope">
            Scope
          </label>
          <select
            id="scope"
            name="scope"
            defaultValue={initial?.scope ?? "product"}
            className={inputClass}
          >
            <option value="product">Product (this product&rsquo;s vote)</option>
            <option value="framework">
              Framework (whole portfolio — Patron 2× weight in Phase 3)
            </option>
          </select>
        </div>
      </div>

      {voteType === "single_choice" && (
        <fieldset className="space-y-3 rounded-md border border-stone-200 bg-stone-50 p-5">
          <legend className="px-2 font-sans text-[11px] font-medium uppercase tracking-[0.15em] text-stone-500">
            Choices (single-choice only)
          </legend>
          {choices.map((c, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={c.id}
                onChange={(e) => updateChoice(i, { id: e.target.value })}
                placeholder="id"
                className={`${inputClass} col-span-2 font-mono`}
              />
              <input
                type="text"
                value={c.label}
                onChange={(e) => updateChoice(i, { label: e.target.value })}
                placeholder="Label shown to voters"
                className={`${inputClass} col-span-9`}
              />
              <button
                type="button"
                onClick={() => removeChoice(i)}
                className="col-span-1 font-sans text-xs text-stone-500 hover:text-red-600"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addChoice}
            className="font-sans text-xs text-stone-700 underline underline-offset-2 hover:text-stone-900"
          >
            + Add choice
          </button>
          <input
            type="hidden"
            name="choicesJson"
            value={JSON.stringify(choices.filter((c) => c.id && c.label))}
          />
        </fieldset>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass} htmlFor="productSlug">
            Product slug (optional)
          </label>
          <input
            id="productSlug"
            name="productSlug"
            type="text"
            defaultValue={initial?.productSlug ?? ""}
            placeholder="hall"
            className={`${inputClass} font-mono`}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={initial?.status ?? "draft"}
            className={inputClass}
          >
            <option value="draft">Draft (not visible to members)</option>
            <option value="open">Open (members can vote)</option>
            <option value="closed">Closed (no more votes accepted)</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass} htmlFor="opensAt">
            Opens at (optional)
          </label>
          <input
            id="opensAt"
            name="opensAt"
            type="datetime-local"
            defaultValue={toLocalInput(initial?.opensAt ?? null)}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass} htmlFor="closesAt">
            Closes at (optional)
          </label>
          <input
            id="closesAt"
            name="closesAt"
            type="datetime-local"
            defaultValue={toLocalInput(initial?.closesAt ?? null)}
            className={inputClass}
          />
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
                  if (
                    !confirm("Delete this proposal? Existing votes will be deleted too.")
                  ) {
                    e.preventDefault();
                  }
                }}
              >
                Delete proposal
              </button>
            </form>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-6 py-3 font-sans text-sm font-medium text-[#FDFBF7] hover:bg-stone-700"
        >
          {initial ? "Save changes" : "Create proposal"}
        </button>
      </div>
    </form>
  );
}
