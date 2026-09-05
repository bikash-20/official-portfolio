import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';
import { useGitHubUser } from '@/hooks/useGitHub';
import { formatNumber } from '@/utils/helpers';
import DashboardCard from './DashboardCard';

export default function GitHubStatsCard() {
  const { data, loading } = useGitHubUser();

  // useGitHubUser seeds a fallback so we always have numeric defaults even
  // before the network call resolves.
  const repos = data?.public_repos ?? 78;
  const followers = data?.followers ?? 31;

  return (
    <DashboardCard
      icon={<FaGithub size={18} />}
      title="GitHub"
      rightSlot={
        <a
          href="https://github.com/bikash-20"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 py-1 clip-corner-tr border border-border text-xs text-text-muted hover:text-primary-light hover:border-primary/40 transition-all duration-300"
        >
          @bikash-20 →
        </a>
      }
    >
      <div className="grid grid-cols-3 gap-3">
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {loading ? '…' : formatNumber(repos)}
          </div>
          <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
            <FaCodeBranch size={10} /> Repos
          </div>
        </div>
        <div>
          {/* Contributions total is a placeholder until the GitHub
              contributions API is wired (the dashboard contribution graph
              itself renders a synthetic demo grid — see useGitHub.ts). */}
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {formatNumber(2280)}
          </div>
          <div className="text-xs text-text-muted mt-1">Contributions</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {loading ? '…' : formatNumber(followers)}
          </div>
          <div className="text-xs text-text-muted flex items-center gap-1 mt-1">
            <FaStar size={10} /> Followers
          </div>
        </div>
      </div>
    </DashboardCard>
  );
}
