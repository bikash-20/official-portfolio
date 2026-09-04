import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface WeatherData {
  temp: number;
  description: string;
  icon: string;
  humidity: number;
  wind: number;
}

const fallback: WeatherData = {
  temp: 28,
  description: 'Sunny',
  icon: 'Sun',
  humidity: 65,
  wind: 8,
};

export default function WeatherCard() {
  const [data, setData] = useState<WeatherData>(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = import.meta.env.VITE_OPENWEATHER_API_KEY;
    if (!key) return;
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Sylhet,BD&units=metric&appid=${key}`
    )
      .then((r) => r.json())
      .then((j) => {
        if (j?.main) {
          setData({
            temp: Math.round(j.main.temp),
            description: j.weather?.[0]?.main ?? 'Clear',
            icon:
              j.weather?.[0]?.main === 'Rain' ? 'Rain' :
              j.weather?.[0]?.main === 'Clouds' ? 'Clouds' :
              j.weather?.[0]?.main === 'Haze' ? 'Haze' : 'Sun',
            humidity: j.main.humidity,
            wind: j.wind?.speed ?? 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-2xl p-5 border border-border hover:border-primary/40 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-info/15 flex items-center justify-center text-info">
            <span className="font-heading font-bold text-sm">{data.icon.charAt(0)}</span>
          </div>
          <h3 className="font-heading font-semibold">Weather</h3>
        </div>
        <span className="text-xs text-text-muted">Sylhet, BD</span>
      </div>

      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-3xl sm:text-4xl font-heading font-bold gradient-text">
          {loading ? '...' : `${data.temp} C`}
        </span>
        <span className="text-sm text-text-muted">{data.description}</span>
      </div>

      <div className="flex gap-4 text-xs text-text-muted">
        <span>Humidity: {data.humidity}%</span>
        <span>Wind: {data.wind} m/s</span>
      </div>
    </motion.div>
  );
}
