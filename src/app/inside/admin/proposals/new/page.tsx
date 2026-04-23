import { ProposalEditor } from "@/components/proposal-editor";
import { createProposalAction } from "../_actions";

export const metadata = { title: "New proposal" };

export default function NewProposalPage() {
  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[44rem]">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          New proposal
        </h1>
        <p className="mt-3 font-sans text-sm text-stone-600">
          Create a proposal. Draft stays hidden until you switch status to Open.
        </p>

        <div className="mt-10">
          <ProposalEditor action={createProposalAction} />
        </div>
      </div>
    </div>
  );
}
