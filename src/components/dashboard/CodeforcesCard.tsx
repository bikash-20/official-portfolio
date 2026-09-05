import { SiCodeforces } from 'react-icons/si';
import DashboardCard from './DashboardCard';
import { useCodeforcesUser } from '@/hooks/useCodeforces';
import { formatNumber } from '@/utils/helpers';

const PROFILE_URL = 'https://codeforces.com/profile/talukder_20';

/**
 * Codeforces card — live rating pulled from Codeforces' public REST API
 * (`codeforces.com/api/user.info`). The card shows the live rating, max
 * rating, rank, and last-online date. While the request is in flight the
 * numbers stay at zero so the user can clearly tell the card is loading;
 * on error the caption surfaces a "Could not load — retry" hint rather
 * than guessing.
 */
export default function CodeforcesCard() {
  const { user, loading, error } = useCodeforcesUser();
  const hasLive = user.rating > 0;

  return (
    <DashboardCard
      icon={<SiCodeforces size={18} />}
      iconChipClass="bg-info/15"
      iconTextClass="text-info"
      title="Codeforces"
      rightSlot={
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1 px-2 clip-corner-bl border border-border text-xs text-text-muted hover:text-primary-light hover:border-primary/40 transition-all duration-300"
        >
          @{user.handle} →
        </a>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {hasLive ? formatNumber(user.rating) : '—'}
          </div>
          <div className="text-xs text-text-muted mt-1">
            Rating
            {user.rank && user.rank !== 'Unrated' && hasLive && (
              <span className="block text-[10px] text-info">{user.rank}</span>
            )}
          </div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {hasLive ? formatNumber(user.maxRating) : '—'}
          </div>
          <div className="text-xs text-text-muted mt-1">
            Peak
            {user.maxRank && user.maxRank !== 'Unrated' && hasLive && (
              <span className="block text-[10px] text-info">{user.maxRank}</span>
            )}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[10px] text-text-muted font-mono uppercase tracking-wider">
        {loading
          ? 'Fetching live rating…'
          : error
            ? `Could not load — ${error}`
            : hasLive
              ? `Live via codeforces.com/api · max ${formatNumber(user.maxRating)}`
              : 'Handle found but unrated'}
      </p>
    </DashboardCard>
  );
}
