'use client';

import { FormEvent, useMemo, useState } from 'react';

type RequestItem = {
  id: number;
  title: string;
  description: string;
  urgency: number;
  daysWaiting: number;
  dependencies: number;
  timesDeferred: number;
};

type ScoreBreakdown = {
  urgencyScore: number;
  waitingScore: number;
  dependencyScore: number;
  fairnessScore: number;
  total: number;
};

const ALGORITHM_VERSION = 'QW-1.1';

const initialRequests: RequestItem[] = [
  {
    id: 1,
    title: 'Server access failure',
    description: 'Team cannot access the shared deployment server.',
    urgency: 5,
    daysWaiting: 1,
    dependencies: 3,
    timesDeferred: 0,
  },
  {
    id: 2,
    title: 'Student ID reissue',
    description: 'Replacement ID card pending after repeated deferrals.',
    urgency: 2,
    daysWaiting: 6,
    dependencies: 0,
    timesDeferred: 3,
  },
  {
    id: 3,
    title: 'Lab projector repair',
    description: 'Projector failure affecting scheduled lab demonstrations.',
    urgency: 3,
    daysWaiting: 3,
    dependencies: 1,
    timesDeferred: 1,
  },
];

function calculateScore(item: RequestItem): ScoreBreakdown {
  const urgencyScore = item.urgency * 4;
  const waitingScore = Math.min(item.daysWaiting * 2, 15);
  const dependencyScore = Math.min(item.dependencies * 3, 15);
  const fairnessScore = Math.min(item.timesDeferred * 4, 20);

  return {
    urgencyScore,
    waitingScore,
    dependencyScore,
    fairnessScore,
    total:
      urgencyScore +
      waitingScore +
      dependencyScore +
      fairnessScore,
  };
}

function priorityLabel(score: number) {
  if (score >= 35) return 'Critical';
  if (score >= 25) return 'High';
  if (score >= 15) return 'Medium';
  return 'Low';
}

function priorityClasses(priority: string) {
  switch (priority) {
    case 'Critical':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'High':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'Medium':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    default:
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
}

function scoreBarWidth(score: number) {
  return `${Math.min((score / 70) * 100, 100)}%`;
}

export default function Home() {
  const [requests, setRequests] =
    useState<RequestItem[]>(initialRequests);

  const [selectedId, setSelectedId] =
    useState<number | null>(1);

  const [form, setForm] = useState({
    title: '',
    description: '',
    urgency: 3,
    daysWaiting: 0,
    dependencies: 0,
    timesDeferred: 0,
  });

  const ranked = useMemo(() => {
    return [...requests]
      .map((item) => ({
        item,
        score: calculateScore(item),
      }))
      .sort((a, b) => {
        if (b.score.total !== a.score.total) {
          return b.score.total - a.score.total;
        }

        if (b.item.daysWaiting !== a.item.daysWaiting) {
          return b.item.daysWaiting - a.item.daysWaiting;
        }

        if (b.item.urgency !== a.item.urgency) {
          return b.item.urgency - a.item.urgency;
        }

        if (b.item.dependencies !== a.item.dependencies) {
          return b.item.dependencies - a.item.dependencies;
        }

        return a.item.id - b.item.id;
      });
  }, [requests]);

  const selected =
    ranked.find((entry) => entry.item.id === selectedId) ??
    ranked[0];

  const stats = useMemo(
    () => ({
      total: requests.length,
      critical: ranked.filter(
        (entry) =>
          priorityLabel(entry.score.total) === 'Critical'
      ).length,
      old: requests.filter(
        (item) => item.daysWaiting > 3
      ).length,
      boosted: requests.filter(
        (item) => item.timesDeferred > 0
      ).length,
    }),
    [requests, ranked]
  );

  function submit(e: FormEvent) {
    e.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const item: RequestItem = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      urgency: Number(form.urgency),
      daysWaiting: Number(form.daysWaiting),
      dependencies: Number(form.dependencies),
      timesDeferred: Number(form.timesDeferred),
    };

    setRequests((previous) => [...previous, item]);
    setSelectedId(item.id);

    setForm({
      title: '',
      description: '',
      urgency: 3,
      daysWaiting: 0,
      dependencies: 0,
      timesDeferred: 0,
    });
  }

  function deferRequest(id: number) {
    setRequests((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              timesDeferred:
                item.timesDeferred + 1,
            }
          : item
      )
    );

    setSelectedId(id);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-sm">
              QW
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold tracking-tight">
                  QueueWise
                </h1>

                <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  {ALGORITHM_VERSION}
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Adaptive queue intelligence
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Live prioritization active
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        {/* HERO */}

        <section className="mb-8 overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-200 sm:px-8 lg:flex lg:items-end lg:justify-between lg:gap-12 lg:px-10 lg:py-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
              Fairness-aware service prioritization
            </div>

            <h2 className="max-w-xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Prioritize what matters.
              <span className="block text-indigo-300">
                Without starving the rest.
              </span>
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              QueueWise balances urgency, waiting time,
              dependency impact and repeated deferrals to
              create a transparent, adaptive service queue.
            </p>
          </div>

          <div className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 p-5 lg:mt-0 lg:max-w-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Priority model
              </span>

              <span className="rounded-lg bg-indigo-400/10 px-2 py-1 text-[10px] font-bold text-indigo-300">
                Explainable
              </span>
            </div>

            <div className="font-mono text-2xl font-black tracking-tight">
              U×4 + W + D + F
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-400">
              <div className="rounded-lg bg-white/5 px-2 py-2">
                U
                <span className="mt-1 block text-white">
                  Urgency
                </span>
              </div>

              <div className="rounded-lg bg-white/5 px-2 py-2">
                W
                <span className="mt-1 block text-white">
                  Waiting
                </span>
              </div>

              <div className="rounded-lg bg-white/5 px-2 py-2">
                D
                <span className="mt-1 block text-white">
                  Impact
                </span>
              </div>

              <div className="rounded-lg bg-white/5 px-2 py-2">
                F
                <span className="mt-1 block text-white">
                  Fairness
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}

        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Active requests"
            value={stats.total}
            detail="Currently in queue"
          />

          <StatCard
            label="Critical"
            value={stats.critical}
            detail="Score of 35 or higher"
          />

          <StatCard
            label="Long waiting"
            value={stats.old}
            detail="Waiting over 3 days"
          />

          <StatCard
            label="Fairness boosted"
            value={stats.boosted}
            detail="Previously deferred"
          />
        </section>

        {/* FORM + EXPLANATION */}

        <section className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* ADD REQUEST */}

          <form
            onSubmit={submit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                New service request
              </span>

              <h3 className="mt-2 text-2xl font-black tracking-tight">
                Add to the queue
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter the request conditions. QueueWise will
                calculate and place it automatically.
              </p>
            </div>

            <div className="space-y-5">
              <Field label="Request title">
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                    })
                  }
                  placeholder="e.g. Network outage"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </Field>

              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Briefly describe the request..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <NumberField
                  label="Urgency"
                  hint="1–5"
                  min={1}
                  max={5}
                  value={form.urgency}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      urgency: value,
                    })
                  }
                />

                <NumberField
                  label="Days waiting"
                  hint="0+"
                  min={0}
                  value={form.daysWaiting}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      daysWaiting: value,
                    })
                  }
                />

                <NumberField
                  label="Dependencies"
                  hint="Affected items"
                  min={0}
                  value={form.dependencies}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      dependencies: value,
                    })
                  }
                />

                <NumberField
                  label="Times deferred"
                  hint="Previous delays"
                  min={0}
                  value={form.timesDeferred}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      timesDeferred: value,
                    })
                  }
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Calculate & add request
                <span>→</span>
              </button>
            </div>
          </form>

          {/* EXPLANATION */}

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
                    value={
                      selected.score.urgencyScore
                    }
                    max={20}
                  />

                  <ScoreMetric
                    label="Waiting-time contribution"
                    detail={`${selected.item.daysWaiting} days waiting`}
                    value={
                      selected.score.waitingScore
                    }
                    max={15}
                  />

                  <ScoreMetric
                    label="Dependency contribution"
                    detail={`${selected.item.dependencies} dependencies`}
                    value={
                      selected.score.dependencyScore
                    }
                    max={15}
                  />

                  <ScoreMetric
                    label="Fairness contribution"
                    detail={`${selected.item.timesDeferred} deferrals`}
                    value={
                      selected.score.fairnessScore
                    }
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
                      QW-{ALGORITHM_VERSION.replace(
                        'QW-',
                        ''
                      )} ranking result
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
                Add a request to see its ranking
                explanation.
              </div>
            )}
          </section>
        </section>

        {/* QUEUE TABLE */}

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
                          +
                          {
                            entry.score
                              .fairnessScore
                          }
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
                            deferRequest(
                              entry.item.id
                            );
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

        {/* FOOTER / LOGIC NOTE */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <InfoCard
            number="01"
            title="Score"
            text="Every request receives a transparent weighted score."
          />

          <InfoCard
            number="02"
            title="Resolve ties"
            text="Waiting time, urgency and dependencies provide deterministic ordering."
          />

          <InfoCard
            number="03"
            title="Protect fairness"
            text="Repeated deferrals trigger a capped anti-starvation boost."
          />
        </section>

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          QueueWise · Adaptive Fairness-Based Service
          Request Prioritization System · {ALGORITHM_VERSION}
        </footer>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-3xl font-black tracking-tight text-slate-950">
        {value}
      </div>

      <div className="mt-2 text-sm font-bold text-slate-700">
        {label}
      </div>

      <div className="mt-1 text-xs text-slate-400">
        {detail}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold text-slate-700">
        {label}
      </span>

      {children}
    </label>
  );
}

function NumberField({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">
          {label}
        </span>

        <span className="text-[10px] text-slate-400">
          {hint}
        </span>
      </div>

      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
      />
    </label>
  );
}

function ScoreMetric({
  label,
  detail,
  value,
  max,
  accent = false,
}: {
  label: string;
  detail: string;
  value: number;
  max: number;
  accent?: boolean;
}) {
  const percentage = Math.min(
    (value / max) * 100,
    100
  );

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-slate-800">
            {label}
          </div>

          <div className="mt-0.5 text-[11px] text-slate-400">
            {detail}
          </div>
        </div>

        <strong
          className={
            accent
              ? 'text-indigo-600'
              : 'text-slate-900'
          }
        >
          +{value}
        </strong>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            accent
              ? 'bg-indigo-500'
              : 'bg-slate-900'
          }`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
      {children}
    </th>
  );
}

function InfoCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <span className="text-xs font-black text-indigo-500">
        {number}
      </span>

      <h4 className="mt-2 font-bold">
        {title}
      </h4>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {text}
      </p>
    </div>
  );
}