import { motion } from 'framer-motion';
import { FaGithub, FaStar, FaCodeBranch } from 'react-icons/fa';
import { useGitHubUser } from '@/hooks/useGitHub';
import { formatNumber } from '@/utils/helpers';

export default function GitHubStatsCard() {
  const { data, loading } = useGitHubUser();

  const repos = data?.public_repos ?? 78;
  const followers = data?.followers ?? 31;
  const contributions = 2280;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center text-primary-light">
            <FaGithub size={18} />
          </div>
          <h3 className="font-heading font-semibold">GitHub</h3>
        </div>
        <a
          href="https://github.com/bikash-20"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-border text-xs text-text-muted hover:text-primary-light hover:border-primary/40 transition-colors"
        >
          @bikash-20 →
        </a>
      </div>

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
          <div className="text-2xl sm:text-3xl font-heading font-bold gradient-text">
            {formatNumber(contributions)}
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
    </motion.div>
  );
}
