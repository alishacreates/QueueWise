'use client';

import {
  FormEvent,
  useMemo,
  useState,
} from 'react';

import HeroSection from '@/components/HeroSection';
import InfoSection from '@/components/InfoSection';
import QueueHeader from '@/components/QueueHeader';
import QueueTable from '@/components/QueueTable';
import RankingExplanation from '@/components/RankingExplanation';
import RequestForm from '@/components/RequestForm';
import StatsSection from '@/components/StatsSection';

import {
  ALGORITHM_VERSION,
  priorityLabel,
  rankRequests,
} from '@/lib/queuewise';

import type {
  QueueForm,
  RequestItem,
} from '@/types/queue';

const initialRequests: RequestItem[] = [
  {
    id: 1,
    title: 'Server access failure',
    description:
      'Team cannot access the shared deployment server.',
    urgency: 5,
    daysWaiting: 1,
    dependencies: 3,
    timesDeferred: 0,
  },
  {
    id: 2,
    title: 'Student ID reissue',
    description:
      'Replacement ID card pending after repeated deferrals.',
    urgency: 2,
    daysWaiting: 6,
    dependencies: 0,
    timesDeferred: 3,
  },
  {
    id: 3,
    title: 'Lab projector repair',
    description:
      'Projector failure affecting scheduled lab demonstrations.',
    urgency: 3,
    daysWaiting: 3,
    dependencies: 1,
    timesDeferred: 1,
  },
];

const initialForm: QueueForm = {
  title: '',
  description: '',
  urgency: 3,
  daysWaiting: 0,
  dependencies: 0,
  timesDeferred: 0,
};

export default function Home() {
  const [requests, setRequests] =
    useState<RequestItem[]>(initialRequests);

  const [selectedId, setSelectedId] =
    useState<number | null>(1);

  const [form, setForm] =
    useState<QueueForm>(initialForm);

  const ranked = useMemo(
    () => rankRequests(requests),
    [requests]
  );

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
      title: form.title.trim(),
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

    setRequests((previous) => [
      ...previous,
      item,
    ]);

    setSelectedId(item.id);

    setForm(initialForm);
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
      <QueueHeader />

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <HeroSection />

        <StatsSection stats={stats} />

        <section className="mb-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <RequestForm
            form={form}
            setForm={setForm}
            onSubmit={submit}
          />

          <RankingExplanation
            selected={selected}
          />
        </section>

        <QueueTable
          ranked={ranked}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          deferRequest={deferRequest}
        />

        <InfoSection />

        <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          QueueWise · Adaptive Fairness-Based Service
          Request Prioritization System ·{' '}
          {ALGORITHM_VERSION}
        </footer>
      </div>
    </main>
  );
}