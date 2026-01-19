import { WeatherData, getWeatherIconUrl, formatTime } from '@/services/weatherService';
import { 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sunrise, 
  Sunset, 
  ThermometerSun,
  Cloud,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  className?: string;
}

export function CurrentWeatherCard({ weather, className }: CurrentWeatherCardProps) {
  const { current, location, sun } = weather;

  return (
    <div className={cn('glass-card p-6 sm:p-8', className)}>
      {/* Location header */}
      <div className="flex items-center gap-2 text-muted-foreground mb-6">
        <MapPin className="w-4 h-4" />
        <span className="font-medium">
          {location.name}, {location.country}
        </span>
      </div>

      {/* Main temperature display */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={getWeatherIconUrl(current.icon)}
            alt={current.description}
            className="w-24 h-24 sm:w-32 sm:h-32 weather-pulse"
          />
          <div>
            <h1 className="text-6xl sm:text-8xl font-display font-bold text-foreground glow-text">
              {current.temp}°
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground capitalize mt-1">
              {current.description}
            </p>
          </div>
        </div>
      </div>

      {/* Feels like */}
      <div className="flex items-center gap-2 mt-4 text-muted-foreground">
        <ThermometerSun className="w-4 h-4" />
        <span>Feels like {current.feelsLike}°C</span>
      </div>

      {/* Weather details grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <DetailItem
          icon={<Droplets className="w-5 h-5 text-weather-rainy" />}
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <DetailItem
          icon={<Wind className="w-5 h-5 text-primary" />}
          label="Wind"
          value={`${current.windSpeed} km/h ${current.windDeg}`}
        />
        <DetailItem
          icon={<Eye className="w-5 h-5 text-muted-foreground" />}
          label="Visibility"
          value={`${current.visibility} km`}
        />
        <DetailItem
          icon={<Gauge className="w-5 h-5 text-secondary" />}
          label="Pressure"
          value={`${current.pressure} hPa`}
        />
        <DetailItem
          icon={<Cloud className="w-5 h-5 text-weather-cloudy" />}
          label="Clouds"
          value={`${current.clouds}%`}
        />
        {current.uvi !== undefined && (
          <DetailItem
            icon={<ThermometerSun className="w-5 h-5 text-accent" />}
            label="UV Index"
            value={current.uvi.toFixed(1)}
          />
        )}
        <DetailItem
          icon={<Sunrise className="w-5 h-5 text-accent" />}
          label="Sunrise"
          value={formatTime(sun.sunrise)}
        />
        <DetailItem
          icon={<Sunset className="w-5 h-5 text-weather-sunny" />}
          label="Sunset"
          value={formatTime(sun.sunset)}
        />
      </div>
    </div>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
