import type { ReactNode } from 'react';

export default function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
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