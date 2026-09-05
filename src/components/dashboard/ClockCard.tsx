import { useEffect, useState } from 'react';
import { FaRegClock } from 'react-icons/fa';
import DashboardCard from './DashboardCard';

export default function ClockCard() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'Asia/Dhaka',
  });

  const date = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'Asia/Dhaka',
  });

  return (
    <DashboardCard
      icon={<FaRegClock size={16} />}
      iconChipClass="bg-secondary/15"
      iconTextClass="text-secondary-light"
      title="Local Time"
      rightSlot={<span className="text-xs text-text-muted">BD · GMT+6</span>}
    >
      <div className="font-mono text-xl sm:text-2xl font-semibold text-text">
        {time}
      </div>
      <div className="text-xs text-text-muted mt-2">{date}</div>
    </DashboardCard>
  );
}
