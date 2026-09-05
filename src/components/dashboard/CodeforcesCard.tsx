import { SiCodeforces } from 'react-icons/si';
import DashboardCard from './DashboardCard';

/**
 * Codeforces card — placeholder values until Bikash shares his handle.
 * Until then we render Pupil (800) as the entry-level tier baseline and
 * surface a "Provide handle" hint.
 */
export default function CodeforcesCard() {
  return (
    <DashboardCard
      icon={<SiCodeforces size={18} />}
      iconChipClass="bg-info/15"
      iconTextClass="text-info"
      title="Codeforces"
      rightSlot={<span className="text-xs text-text-muted">Pupil</span>}
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">800</div>
          <div className="text-xs text-text-muted mt-1">Rating</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">—</div>
          <div className="text-xs text-text-muted mt-1">Contests</div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-text-muted font-mono uppercase tracking-wider">
        Handle not yet linked — values are placeholders
      </p>
    </DashboardCard>
  );
}
