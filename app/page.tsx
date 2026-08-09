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

  const waitingScore = Math.min(
    item.daysWaiting * 2,
    15
  );

  const dependencyScore = Math.min(
    item.dependencies * 3,
    15
  );

  const fairnessScore = Math.min(
    item.timesDeferred * 4,
    20
  );

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

  /*
   * QUEUEWISE RANKING ALGORITHM
   *
   * Primary ranking:
   * Priority = U + W + D + F
   *
   * U = urgency × 4
   * W = waiting days × 2 (maximum 15)
   * D = dependencies × 3 (maximum 15)
   * F = deferrals × 4 (maximum 20)
   *
   * Tie-breaking:
   * 1. Longer waiting time
   * 2. Higher urgency
   * 3. Greater dependency impact
   * 4. Older request
   */

  const ranked = useMemo(() => {
    return [...requests]
      .map((item) => ({
        item,
        score: calculateScore(item),
      }))
      .sort((a, b) => {
        // Primary rule:
        // higher calculated priority wins.

        if (b.score.total !== a.score.total) {
          return b.score.total - a.score.total;
        }

        // Tie-breaker 1:
        // protect requests that have waited longer.

        if (
          b.item.daysWaiting !==
          a.item.daysWaiting
        ) {
          return (
            b.item.daysWaiting -
            a.item.daysWaiting
          );
        }

        // Tie-breaker 2:
        // higher urgency wins.

        if (
          b.item.urgency !==
          a.item.urgency
        ) {
          return (
            b.item.urgency -
            a.item.urgency
          );
        }

        // Tie-breaker 3:
        // requests affecting more dependent
        // services/users move first.

        if (
          b.item.dependencies !==
          a.item.dependencies
        ) {
          return (
            b.item.dependencies -
            a.item.dependencies
          );
        }

        // Final deterministic rule:
        // older request ID wins.

        return a.item.id - b.item.id;
      });
  }, [requests]);

  const selected =
    ranked.find(
      (entry) =>
        entry.item.id === selectedId
    ) ?? ranked[0];

  const stats = useMemo(
    () => ({
      total: requests.length,

      critical: ranked.filter(
        (entry) =>
          priorityLabel(
            entry.score.total
          ) === 'Critical'
      ).length,

      old: requests.filter(
        (item) =>
          item.daysWaiting > 3
      ).length,

      boosted: requests.filter(
        (item) =>
          item.timesDeferred > 0
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

      title:
        form.title.trim(),

      description:
        form.description.trim(),

      urgency:
        Number(form.urgency),

      daysWaiting:
        Number(form.daysWaiting),

      dependencies:
        Number(form.dependencies),

      timesDeferred:
        Number(form.timesDeferred),
    };

    setRequests(
      (previous) => [
        ...previous,
        item,
      ]
    );

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

  /*
   * Anti-starvation behaviour.
   *
   * Every time a request is deferred,
   * its fairness counter increases.
   *
   * The queue is then recalculated
   * automatically.
   */

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
    <main className="shell">

      {/* HERO */}

      <section className="hero">
        <div>
          <span className="eyebrow">
            Adaptive queue intelligence
          </span>

          <h1>QueueWise</h1>

          <p>
            Fairer service-request
            prioritization using urgency,
            waiting time, dependency impact
            and anti-starvation fairness
            boosting.
          </p>
        </div>

        <div className="formulaCard">
          <span>
            Priority model ·{' '}
            {ALGORITHM_VERSION}
          </span>

          <strong>
            U×4 + W + D + F
          </strong>

          <small>
            Adaptive fairness scoring ·
            anti-starvation · deterministic
            tie resolution
          </small>
        </div>
      </section>

      {/* STATISTICS */}

      <section className="stats">
        <Stat
          label="Requests"
          value={stats.total}
        />

        <Stat
          label="Critical"
          value={stats.critical}
        />

        <Stat
          label="Waiting >3 days"
          value={stats.old}
        />

        <Stat
          label="Fairness boosted"
          value={stats.boosted}
        />
      </section>

      {/* FORM + EXPLANATION */}

      <section className="grid">

        {/* ADD REQUEST */}

        <form
          className="panel"
          onSubmit={submit}
        >
          <div className="panelHeader">
            <div>
              <span className="eyebrow">
                New request
              </span>

              <h2>
                Add to queue
              </h2>
            </div>
          </div>

          <label>
            Request title

            <input
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title:
                    e.target.value,
                })
              }
              placeholder="e.g. Network outage"
            />
          </label>

          <label>
            Description

            <textarea
              value={
                form.description
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  description:
                    e.target.value,
                })
              }
              placeholder="Briefly describe the request"
            />
          </label>

          <div className="twoCol">
            <label>
              Urgency (1-5)

              <input
                type="number"
                min="1"
                max="5"
                value={
                  form.urgency
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    urgency:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>

            <label>
              Days waiting

              <input
                type="number"
                min="0"
                value={
                  form.daysWaiting
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    daysWaiting:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>

            <label>
              Dependencies

              <input
                type="number"
                min="0"
                value={
                  form.dependencies
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    dependencies:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>

            <label>
              Times deferred

              <input
                type="number"
                min="0"
                value={
                  form.timesDeferred
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    timesDeferred:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>
          </div>

          <button type="submit">
            Calculate & add
          </button>
        </form>

        {/* EXPLANATION */}

        <section className="panel explanation">
          <div className="panelHeader">
            <div>
              <span className="eyebrow">
                Explainable ranking
              </span>

              <h2>
                Why this rank?
              </h2>
            </div>
          </div>

          {selected ? (
            <>
              <div className="selectedTitle">
                <div>
                  <strong>
                    {
                      selected
                        .item
                        .title
                    }
                  </strong>

                  <p>
                    {selected
                      .item
                      .description ||
                      'No description provided.'}
                  </p>
                </div>

                <span className="scorePill">
                  {
                    selected
                      .score
                      .total
                  }
                </span>
              </div>

              <Breakdown
                label="Urgency contribution"
                value={
                  selected
                    .score
                    .urgencyScore
                }
              />

              <Breakdown
                label="Waiting-time contribution"
                value={
                  selected
                    .score
                    .waitingScore
                }
              />

              <Breakdown
                label="Dependency contribution"
                value={
                  selected
                    .score
                    .dependencyScore
                }
              />

              <Breakdown
                label="Fairness contribution"
                value={
                  selected
                    .score
                    .fairnessScore
                }
              />

              <div className="totalRow">
                <span>
                  Final priority score
                </span>

                <strong>
                  {
                    selected
                      .score
                      .total
                  }
                </strong>
              </div>

              <p className="note">
                QueueWise first ranks
                requests using the
                calculated priority score.
                Equal scores are resolved
                using waiting time,
                urgency, dependency impact
                and finally request age.
                Repeated deferrals increase
                the fairness contribution,
                helping prevent a request
                from remaining at the
                bottom of the queue
                indefinitely.
              </p>
            </>
          ) : (
            <p>
              No requests available.
            </p>
          )}
        </section>
      </section>

      {/* PRIORITIZED QUEUE */}

      <section className="panel queuePanel">
        <div className="panelHeader">
          <div>
            <span className="eyebrow">
              Live ranking
            </span>

            <h2>
              Prioritized queue
            </h2>
          </div>

          <span className="muted">
            Click a row for its score
            breakdown
          </span>
        </div>

        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Request</th>
                <th>Urgency</th>
                <th>Waiting</th>
                <th>Fairness</th>
                <th>Score</th>
                <th>Priority</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ranked.map(
                (
                  entry,
                  index
                ) => (
                  <tr
                    key={
                      entry
                        .item
                        .id
                    }
                    onClick={() =>
                      setSelectedId(
                        entry
                          .item
                          .id
                      )
                    }
                    className={
                      selectedId ===
                      entry
                        .item
                        .id
                        ? 'activeRow'
                        : ''
                    }
                  >
                    <td>
                      #{index + 1}
                    </td>

                    <td>
                      <strong>
                        {
                          entry
                            .item
                            .title
                        }
                      </strong>

                      <small>
                        {
                          entry
                            .item
                            .description
                        }
                      </small>
                    </td>

                    <td>
                      {
                        entry
                          .item
                          .urgency
                      }
                      /5
                    </td>

                    <td>
                      {
                        entry
                          .item
                          .daysWaiting
                      }
                      d
                    </td>

                    <td>
                      +
                      {
                        entry
                          .score
                          .fairnessScore
                      }
                    </td>

                    <td>
                      <strong>
                        {
                          entry
                            .score
                            .total
                        }
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`badge ${priorityLabel(
                          entry
                            .score
                            .total
                        ).toLowerCase()}`}
                      >
                        {priorityLabel(
                          entry
                            .score
                            .total
                        )}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className="deferButton"
                        onClick={(
                          e
                        ) => {
                          e.stopPropagation();

                          deferRequest(
                            entry
                              .item
                              .id
                          );
                        }}
                      >
                        Defer
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="stat">
      <strong>
        {value}
      </strong>

      <span>
        {label}
      </span>
    </div>
  );
}

function Breakdown({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="breakdown">
      <span>
        {label}
      </span>

      <strong>
        +{value}
      </strong>
    </div>
  );
}