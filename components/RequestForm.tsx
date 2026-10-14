import type {
  Dispatch,
  FormEvent,
  SetStateAction,
} from 'react';

import Field from '@/components/ui/Field';
import NumberField from '@/components/ui/NumberField';
import type { QueueForm } from '@/types/queue';

export default function RequestForm({
  form,
  setForm,
  onSubmit,
}: {
  form: QueueForm;
  setForm: Dispatch<SetStateAction<QueueForm>>;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border-b border-[#d9d4ca] py-10 lg:border-b-0 lg:border-r lg:pr-10"
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
  );
}