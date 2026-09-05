import { useEffect, useState } from 'react';
import { FaCloud, FaCloudRain, FaCloudShowersHeavy, FaSmog, FaSnowflake, FaSun } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import DashboardCard from './DashboardCard';

interface WeatherData {
  /** Celsius. */
  temp: number;
  description: string;
  /** OWM `weather[0].main` value, lowercased. */
  condition: string;
  humidity: number;
  /** m/s */
  wind: number;
}

interface OwmResponse {
  main?: { temp?: number; humidity?: number };
  weather?: { main?: string }[];
  wind?: { speed?: number };
}

const fallback: WeatherData = {
  temp: 28,
  description: 'Sunny',
  condition: 'clear',
  humidity: 65,
  wind: 8,
};

const FETCH_TIMEOUT_MS = 8_000;

/**
 * Map OWM `weather[0].main` strings to icons + display descriptions.
 * Anything we don't recognise falls back to FaSun so the UI never blanks.
 */
function iconForCondition(condition: string): { Icon: IconType; description: string } {
  const c = condition.toLowerCase();
  switch (c) {
    case 'clear':        return { Icon: FaSun,              description: 'Clear' };
    case 'clouds':       return { Icon: FaCloud,            description: 'Cloudy' };
    case 'rain':         return { Icon: FaCloudRain,        description: 'Rain' };
    case 'drizzle':      return { Icon: FaCloudRain,        description: 'Drizzle' };
    case 'thunderstorm': return { Icon: FaCloudShowersHeavy,description: 'Thunderstorm' };
    case 'snow':         return { Icon: FaSnowflake,        description: 'Snow' };
    case 'mist':
    case 'fog':
    case 'haze':
    case 'smoke':
    case 'dust':
    case 'sand':
    case 'ash':
    case 'squall':
    case 'tornado':      return { Icon: FaSmog,             description: c.charAt(0).toUpperCase() + c.slice(1) };
    default:             return { Icon: FaSun,              description: 'Clear' };
  }
}

async function fetchWeather(apiKey: string, signal: AbortSignal): Promise<WeatherData | null> {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Sylhet,BD&units=metric&appid=${apiKey}`;
  const res = await fetch(url, { signal });
  if (!res.ok) return null;
  const j = (await res.json()) as OwmResponse;
  const main = j.weather?.[0]?.main ?? 'Clear';
  const { description } = iconForCondition(main);
  return {
    temp: typeof j.main?.temp === 'number' ? Math.round(j.main.temp) : fallback.temp,
    description,
    condition: main.toLowerCase(),
    humidity: typeof j.main?.humidity === 'number' ? j.main.humidity : fallback.humidity,
    wind: typeof j.wind?.speed === 'number' ? Math.round(j.wind.speed) : fallback.wind,
  };
}

export default function WeatherCard() {
  const [data, setData] = useState<WeatherData>(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) return; // No key — stay on fallback.
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    setLoading(true);
    fetchWeather(key, controller.signal)
      .then((fresh) => {
        if (fresh) setData(fresh);
      })
      .catch(() => {
        /* network failure — keep fallback silently */
      })
      .finally(() => setLoading(false));
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  const { Icon, description } = iconForCondition(data.condition);

  return (
    <DashboardCard
      icon={<Icon size={18} />}
      iconChipClass="bg-info/15"
      iconTextClass="text-info"
      title="Weather"
      rightSlot={<span className="text-xs text-text-muted">Sylhet, BD</span>}
    >
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl sm:text-4xl font-heading font-bold gradient-text">
          {loading ? '…' : `${data.temp}°C`}
        </span>
        <span className="text-sm text-text-muted">{description}</span>
      </div>
      <div className="flex gap-4 text-xs text-text-muted">
        <span>Humidity: {data.humidity}%</span>
        <span>Wind: {data.wind} m/s</span>
      </div>
    </DashboardCard>
  );
}
