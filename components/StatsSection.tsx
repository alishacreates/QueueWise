import StatCard from './ui/StatCard';

type StatsSectionProps = {
  stats: {
    total: number;
    critical: number;
    old: number;
    boosted: number;
  };
};

export default function StatsSection({
  stats,
}: StatsSectionProps) {
  return (
    <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        label="Active requests"
        value={stats.total}
        detail="Currently in queue"
      />

      <StatCard
        label="Critical"
        value={stats.critical}
        detail="Score of 35 or higher"
      />

      <StatCard
        label="Long waiting"
        value={stats.old}
        detail="Waiting over 3 days"
      />

      <StatCard
        label="Fairness boosted"
        value={stats.boosted}
        detail="Previously deferred"
      />
    </section>
  );
}