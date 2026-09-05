import { Reveal } from '@/components/common/Reveal';
import { useGitHubContributions } from '@/hooks/useGitHub';

const levelColors = [
  'bg-surface',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/60',
  'bg-primary',
];

export default function ContributionGraph() {
  const { grid, isSynthetic } = useGitHubContributions();

  return (
    <Reveal className="glass rounded-2xl p-5 sm:p-6 border border-border" y={20} duration={0.6}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="font-heading font-semibold text-lg">
            Contribution Activity
          </h3>
          <p className="text-xs text-text-muted mt-1">
            {isSynthetic
              ? 'Demo pattern — wire GH_TOKEN to fetch the live calendar.'
              : '2,280+ contributions in the last year'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span>Less</span>
          {levelColors.map((c, i) => (
            <span key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="inline-flex gap-[3px] min-w-full">
          {grid.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm ${levelColors[day.level]} hover:ring-1 hover:ring-primary transition-all cursor-pointer`}
                  title={`${day.count} contributions on ${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
