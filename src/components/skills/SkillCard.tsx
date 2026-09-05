import type { SkillCategory } from '@/types';
import { useSkillFilter } from '@/hooks/useSkillFilter';

interface Props {
  category: SkillCategory;
}

function Monogram({ label, color }: { label: string; color: string }) {
  const letter = label.charAt(0).toUpperCase();
  return (
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg shrink-0"
      style={{
        background: `${color}20`,
        border: `1px solid ${color}40`,
        color,
      }}
      aria-hidden="true"
    >
      {letter}
    </div>
  );
}

/** Inline ✓ mark — pure SVG so we don't pull in another icon lib. */
function CheckMark() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function SkillCard({ category }: Props) {
  const { toggle, isSelected, clear } = useSkillFilter();

  return (
    <div className="h-full glass rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-5">
        <Monogram label={category.icon} color={category.color} />
        <h3 className="font-heading font-semibold text-lg flex-1">{category.name}</h3>
      </div>

      {/* Pill buttons — click toggles the skill in the global filter */}
      <ul className="flex flex-wrap gap-2">
        {category.skills.map((skill) => {
          const active = isSelected(skill.name);
          return (
            <li key={skill.name}>
              <button
                type="button"
                onClick={() => toggle(skill.name)}
                aria-pressed={active}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all duration-200 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
                  active
                    ? 'gradient-bg text-white border-transparent shadow-md shadow-primary/40 hover:shadow-primary/60'
                    : 'bg-surface/70 border-border text-text-muted hover:text-text hover:border-primary/50 hover:bg-primary/10 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/20'
                }`}
              >
                {active && <CheckMark />}
                {skill.name}
              </button>
            </li>
          );
        })}

        {/* Show a tiny "clear" hint inside any card once something is selected */}
        {category.skills.some((s) => isSelected(s.name)) && (
          <li className="basis-full mt-1">
            <button
              type="button"
              onClick={clear}
              className="text-[11px] text-text-muted hover:text-secondary-light transition-colors underline-offset-2 hover:underline"
            >
              Clear all filters
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
