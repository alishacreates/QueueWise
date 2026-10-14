import type { Dispatch, SetStateAction } from 'react';

import TableHead from './ui/TableHead';

import {
  priorityClasses,
  priorityLabel,
  scoreBarWidth,
} from '@/lib/queuewise';

import type { RankedRequest } from '@/types/queue';

export default function QueueTable({
  ranked,
  selectedId,
  setSelectedId,
  deferRequest,
}: {
  ranked: RankedRequest[];
  selectedId: number | null;
  setSelectedId: Dispatch<
    SetStateAction<number | null>
  >;
  deferRequest: (id: number) => void;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
            Live ranking
          </span>

          <h3 className="mt-2 text-2xl font-black tracking-tight">
            Prioritized queue
          </h3>
        </div>

        <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
          Select a row to inspect its score
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <TableHead>Rank</TableHead>
              <TableHead>Request</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Waiting</TableHead>
              <TableHead>Fairness</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Action</TableHead>
            </tr>
          </thead>

          <tbody>
            {ranked.map((entry, index) => {
              const priority = priorityLabel(
                entry.score.total
              );

              const active =
                selectedId === entry.item.id;

              return (
                <tr
                  key={entry.item.id}
                  onClick={() =>
                    setSelectedId(entry.item.id)
                  }
                  className={`cursor-pointer border-b border-slate-100 transition last:border-b-0 ${
                    active
                      ? 'bg-indigo-50/70'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="px-5 py-5">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black ${
                        index === 0
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      #{index + 1}
                    </div>
                  </td>

                  <td className="max-w-sm px-5 py-5">
                    <div className="font-bold text-slate-900">
                      {entry.item.title}
                    </div>

                    <div className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {entry.item.description}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm">
                        {entry.item.urgency}
                      </strong>

                      <span className="text-xs text-slate-400">
                        / 5
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-5 text-sm font-medium text-slate-700">
                    {entry.item.daysWaiting}d
                  </td>

                  <td className="px-5 py-5">
                    <div className="inline-flex rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-700">
                      +{entry.score.fairnessScore}
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <div className="min-w-[95px]">
                      <div className="mb-2 flex items-center justify-between">
                        <strong className="text-sm">
                          {entry.score.total}
                        </strong>
                      </div>

                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-900 transition-all"
                          style={{
                            width:
                              scoreBarWidth(
                                entry.score.total
                              ),
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1.5 text-[11px] font-bold ${priorityClasses(
                        priority
                      )}`}
                    >
                      {priority}
                    </span>
                  </td>

                  <td className="px-5 py-5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deferRequest(entry.item.id);
                      }}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                    >
                      Defer +4
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}