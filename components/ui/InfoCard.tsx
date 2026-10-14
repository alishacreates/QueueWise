export default function InfoCard({
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