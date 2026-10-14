import type { ReactNode } from 'react';

export default function TableHead({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="whitespace-nowrap px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
      {children}
    </th>
  );
}