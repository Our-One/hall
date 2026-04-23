"use client";

import { useState } from "react";
import type { Proposal, ProposalChoice } from "@/db/schema/proposals";

interface VoteFormProps {
  proposal: Proposal;
  myVote: { choice: string; weight: number } | null;
  isSignedIn: boolean;
  isOpen: boolean;
  action: (choice: string) => Promise<{ ok: true } | { ok: false; error: string }>;
}

export function VoteForm({ proposal, myVote, isSignedIn, isOpen, action }: VoteFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="rounded-md border border-stone-200 bg-[#F5F2EB] px-5 py-4 font-sans text-sm text-stone-700">
        <a
          href="/login"
          className="font-medium underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900"
        >
          Sign in
        </a>{" "}
        to vote on this proposal.
      </div>
    );
  }

  if (myVote) {
    const display = myVote.choice === "yes" ? "Yes" : myVote.choice === "no" ? "No" : displayChoiceLabel(proposal, myVote.choice);
    return (
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-5 py-4 font-sans text-sm text-emerald-900">
        You voted <strong>{display}</strong> with weight {myVote.weight}.
        Voting once per proposal is final — discussion happens in comments
        (coming soon).
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="rounded-md border border-stone-200 bg-stone-50 px-5 py-4 font-sans text-sm text-stone-700">
        Voting is closed on this proposal.
      </div>
    );
  }

  async function submit(choice: string) {
    setError(null);
    setPending(true);
    try {
      const result = await action(choice);
      if (!result.ok) {
        setError(result.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Vote failed");
    } finally {
      setPending(false);
    }
  }

  if (proposal.voteType === "yes_no") {
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            disabled={pending}
            onClick={() => submit("yes")}
            className="flex-1 rounded-md border-2 border-stone-900 bg-stone-900 px-5 py-3 font-sans text-sm font-medium text-[#FDFBF7] transition-colors hover:bg-stone-700 disabled:opacity-50"
          >
            {pending ? "…" : "Vote yes"}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => submit("no")}
            className="flex-1 rounded-md border-2 border-stone-300 bg-white px-5 py-3 font-sans text-sm font-medium text-stone-900 transition-colors hover:border-stone-900 disabled:opacity-50"
          >
            Vote no
          </button>
        </div>
        {error && <p className="font-sans text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  if (proposal.voteType === "single_choice") {
    const choices = (proposal.choices as ProposalChoice[] | null) ?? [];
    return (
      <div className="space-y-3">
        <div className="flex flex-col gap-3">
          {choices.map((c) => (
            <button
              key={c.id}
              type="button"
              disabled={pending}
              onClick={() => submit(c.id)}
              className="rounded-md border-2 border-stone-300 bg-white px-5 py-4 text-left transition-colors hover:border-stone-900 disabled:opacity-50"
            >
              <div className="font-sans text-sm font-medium text-stone-900">
                {c.label}
              </div>
              {c.description && (
                <div className="mt-1 font-sans text-xs text-stone-600">
                  {c.description}
                </div>
              )}
            </button>
          ))}
        </div>
        {error && <p className="font-sans text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="font-sans text-sm text-stone-600">
      Unsupported vote type: {proposal.voteType}
    </div>
  );
}

function displayChoiceLabel(proposal: Proposal, choiceId: string): string {
  const choices = (proposal.choices as ProposalChoice[] | null) ?? [];
  return choices.find((c) => c.id === choiceId)?.label ?? choiceId;
}
