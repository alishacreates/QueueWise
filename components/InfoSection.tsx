import InfoCard from "./ui/InfoCard";

export default function InfoSection() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-3">
      <InfoCard
        number="01"
        title="Score"
        text="Every request receives a transparent weighted score."
      />

      <InfoCard
        number="02"
        title="Resolve ties"
        text="Waiting time, urgency and dependencies provide deterministic ordering."
      />

      <InfoCard
        number="03"
        title="Protect fairness"
        text="Repeated deferrals trigger a capped anti-starvation boost."
      />
    </section>
  );
}