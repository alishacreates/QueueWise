import { ALGORITHM_VERSION } from '../lib/queuewise';

export default function HeroSection() {
  return (
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
            {ALGORITHM_VERSION}
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
  );
}