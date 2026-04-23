import { notFound } from "next/navigation";
import { getProposalById } from "@/lib/proposals";
import { ProposalEditor } from "@/components/proposal-editor";
import { updateProposalAction, deleteProposalAction } from "../../_actions";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}

export const metadata = { title: "Edit proposal" };

export default async function EditProposalPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { saved } = await searchParams;
  const proposal = await getProposalById(id);
  if (!proposal) notFound();

  const update = updateProposalAction.bind(null, id);
  const remove = deleteProposalAction.bind(null, id);

  return (
    <div className="px-6 py-12 md:py-16">
      <div className="mx-auto max-w-[44rem]">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
          Edit proposal
        </h1>
        <p className="mt-3 font-sans text-sm text-stone-600">
          Editing &ldquo;{proposal.title}&rdquo; —{" "}
          {proposal.status === "draft" ? (
            <span>draft (not visible to members)</span>
          ) : (
            <>at /inside/proposals/{proposal.slug}</>
          )}
        </p>

        <div className="mt-10">
          <ProposalEditor
            initial={proposal}
            action={update}
            onDelete={remove}
            saved={saved === "1"}
          />
        </div>
      </div>
    </div>
  );
}
