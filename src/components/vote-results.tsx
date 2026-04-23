import type { Proposal, ProposalChoice } from "@/db/schema/proposals";

interface VoteResultsProps {
  proposal: Proposal;
  results: { choiceId: string; count: number; weight: number }[];
  totalVotes: number;
  totalWeight: number;
}

export function VoteResults({ proposal, results, totalVotes, totalWeight }: VoteResultsProps) {
  const items = buildItems(proposal, results);

  if (totalVotes === 0) {
    return (
      <div className="font-sans text-sm text-stone-500">
        No votes yet. Be the first.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const pctWeight = totalWeight > 0 ? (item.weight / totalWeight) * 100 : 0;
        return (
          <div key={item.id}>
            <div className="flex items-baseline justify-between gap-3 font-sans text-sm">
              <span className="font-medium text-stone-900">{item.label}</span>
              <span className="font-mono text-xs text-stone-500">
                {item.count} {item.count === 1 ? "vote" : "votes"}
                {item.weight !== item.count && <> · {item.weight} weight</>}
                <span className="ml-2 text-stone-400">{pctWeight.toFixed(0)}%</span>
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-100">
              <div
                className="h-full bg-stone-900"
                style={{ width: `${pctWeight}%` }}
              />
            </div>
          </div>
        );
      })}
      <div className="pt-2 font-sans text-xs text-stone-500">
        {totalVotes} total {totalVotes === 1 ? "vote" : "votes"}
        {totalWeight !== totalVotes && <>, {totalWeight} total weight</>}
      </div>
    </div>
  );
}

function buildItems(
  proposal: Proposal,
  results: { choiceId: string; count: number; weight: number }[],
) {
  if (proposal.voteType === "yes_no") {
    const yes = results.find((r) => r.choiceId === "yes");
    const no = results.find((r) => r.choiceId === "no");
    return [
      { id: "yes", label: "Yes", count: yes?.count ?? 0, weight: yes?.weight ?? 0 },
      { id: "no", label: "No", count: no?.count ?? 0, weight: no?.weight ?? 0 },
    ];
  }
  if (proposal.voteType === "single_choice") {
    const choices = (proposal.choices as ProposalChoice[] | null) ?? [];
    return choices.map((c) => {
      const r = results.find((x) => x.choiceId === c.id);
      return {
        id: c.id,
        label: c.label,
        count: r?.count ?? 0,
        weight: r?.weight ?? 0,
      };
    });
  }
  return results.map((r) => ({
    id: r.choiceId,
    label: r.choiceId,
    count: r.count,
    weight: r.weight,
  }));
}
