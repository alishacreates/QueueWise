import ScoreMetric from '@/components/ui/ScoreMetric';

import {
  ALGORITHM_VERSION,
  priorityClasses,
  priorityLabel,
} from '@/lib/queuewise';

import type { RankedRequest } from '@/types/queue';

export default function RankingExplanation({
  selected,
}: {
  selected?: RankedRequest;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
            Explainable ranking
          </span>

          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Why this rank?
          </h3>
        </div>

        {selected && (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white shadow-lg">
            {selected.score.total}
          </div>
        )}
      </div>

      {selected ? (
        <>
          <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h4 className="font-bold">
                {selected.item.title}
              </h4>

              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${priorityClasses(
                  priorityLabel(
                    selected.score.total
                  )
                )}`}
              >
                {priorityLabel(
                  selected.score.total
                )}
              </span>
            </div>

            <p className="text-sm leading-6 text-slate-500">
              {selected.item.description ||
                'No description provided.'}
            </p>
          </div>

          <div className="space-y-5">
            <ScoreMetric
              label="Urgency contribution"
              detail={`${selected.item.urgency}/5 urgency`}
              value={selected.score.urgencyScore}
              max={20}
            />

            <ScoreMetric
              label="Waiting-time contribution"
              detail={`${selected.item.daysWaiting} days waiting`}
              value={selected.score.waitingScore}
              max={15}
            />

            <ScoreMetric
              label="Dependency contribution"
              detail={`${selected.item.dependencies} dependencies`}
              value={selected.score.dependencyScore}
              max={15}
            />

            <ScoreMetric
              label="Fairness contribution"
              detail={`${selected.item.timesDeferred} deferrals`}
              value={selected.score.fairnessScore}
              max={20}
              accent
            />
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-950 p-5 text-white">
            <div>
              <span className="text-xs font-medium text-slate-400">
                Final priority score
              </span>

              <p className="mt-1 text-sm font-semibold">
                {ALGORITHM_VERSION} ranking result
              </p>
            </div>

            <strong className="text-3xl font-black">
              {selected.score.total}
            </strong>
          </div>

          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
            <strong>
              Fairness protection:
            </strong>{' '}
            repeated deferrals increase the fairness
            contribution up to +20. Equal scores are
            resolved by waiting time, urgency,
            dependency impact, then request age.
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
          Add a request to see its ranking explanation.
        </div>
      )}
    </section>
  );
}