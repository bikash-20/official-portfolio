import { FaEye, FaFilePdf, FaImage } from 'react-icons/fa';
import { isAchievement, type AchievementOrStat } from '@/types';

interface Props {
  item: AchievementOrStat;
  onView: (item: AchievementOrStat) => void;
}

export default function AchievementCard({ item, onView }: Props) {
  // Only true achievements carry a certificate; stats do not.
  const hasCert = isAchievement(item) && !!item.certificate;
  const certSrc = isAchievement(item) ? item.certificate : undefined;
  const certType = isAchievement(item) ? item.certificateType : undefined;

  return (
    <div className="h-full glass rounded-2xl p-6 border border-border hover:border-primary/40 transition-all group flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 font-heading font-bold text-sm text-primary-light">
            {item.icon.charAt(0)}
          </span>
        </div>
        <span className="text-xs text-text-muted font-mono">{item.date}</span>
      </div>

      <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary-light transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-primary-light mb-3">{item.organization}</p>
      <p className="text-sm text-text-muted leading-relaxed mb-4 flex-1">
        {item.description}
      </p>

      {hasCert && certSrc ? (
        <button
          onClick={() => onView(item)}
          className="inline-flex items-center gap-2 py-2.5 clip-corner-tr bg-primary/15 hover:bg-primary/25 text-primary-light text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
        >
          <FaEye size={12} /> View Certificate
          <span className="text-xs text-text-muted">
            {certType === 'pdf' ? <FaFilePdf /> : <FaImage />}
          </span>
        </button>
      ) : (
        <span className="inline-flex items-center gap-2 py-2.5 clip-corner-bl bg-surface text-text-muted text-xs italic">
          Certificate coming soon
        </span>
      )}
    </div>
  );
}
