export default function ScoreMetric({
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