import { ALGORITHM_VERSION } from '../lib/queuewise';

export default function QueueHeader() {
  return (
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
  );
}