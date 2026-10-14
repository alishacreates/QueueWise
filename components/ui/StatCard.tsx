export default function StatCard({
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