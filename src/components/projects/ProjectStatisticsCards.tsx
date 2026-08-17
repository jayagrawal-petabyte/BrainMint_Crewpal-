interface ProjectStatisticsCardsProps {
  totalTasks: number;
  onTrack: number;
  delayed: number;
  completed: number;
}

export const ProjectStatisticsCards = ({
  totalTasks,
  onTrack,
  delayed,
  completed,
}: ProjectStatisticsCardsProps) => {
  const completionPercentage = totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100);

  const statistics = [
    { label: 'Total Tasks', value: totalTasks, detail: `${completionPercentage}% complete` },
    { label: 'On Track', value: onTrack },
    { label: 'Delayed', value: delayed },
    { label: 'Completed', value: completed },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statistics.map(({ label, value, detail }) => (
        <Card key={label} className="border-cream-300">
          <p className="text-xs font-semibold uppercase tracking-wide text-forest-500">{label}</p>
          <p className="mt-3 text-3xl font-extrabold text-forest-900">{value}</p>
          {detail && <p className="mt-1 text-xs text-forest-500">{detail}</p>}
        </Card>
      ))}
    </div>
  );
};
import { Card } from '../common/Card';
