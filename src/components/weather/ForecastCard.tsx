import { ForecastData, getWeatherIconUrl, getDayName } from '@/services/weatherService';
import { Calendar, Droplets, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ForecastCardProps {
  forecast: ForecastData[];
  className?: string;
}

export function ForecastCard({ forecast, className }: ForecastCardProps) {
  if (!forecast.length) return null;

  return (
    <div className={cn('glass-card p-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="font-display font-semibold text-lg">5-Day Forecast</h2>
      </div>

      {/* Forecast List */}
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <ForecastDayItem key={day.date} day={day} index={index} />
        ))}
      </div>
    </div>
  );
}

interface ForecastDayItemProps {
  day: ForecastData;
  index: number;
}

function ForecastDayItem({ day, index }: ForecastDayItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl',
        'bg-muted/20 hover:bg-muted/40 transition-all duration-200',
        'opacity-0 animate-fade-in'
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Day */}
      <div className="w-20 flex-shrink-0">
        <p className="font-semibold text-foreground">{getDayName(day.date)}</p>
        <p className="text-xs text-muted-foreground capitalize">{day.description}</p>
      </div>

      {/* Weather Icon */}
      <img
        src={getWeatherIconUrl(day.icon, '2x')}
        alt={day.condition}
        className="w-12 h-12 flex-shrink-0"
      />

      {/* Temperature Range */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground text-lg">{day.temp.max}°</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{day.temp.min}°</span>
        </div>
        {/* Temperature bar */}
        <div className="h-1.5 rounded-full bg-muted/30 mt-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{
              width: `${Math.min(100, ((day.temp.max + 10) / 50) * 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Humidity & Wind */}
      <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
        <div className="flex items-center gap-1">
          <Droplets className="w-4 h-4 text-weather-rainy" />
          <span>{day.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="w-4 h-4 text-primary" />
          <span>{day.windSpeed} km/h</span>
        </div>
      </div>

      {/* Precipitation Probability */}
      {day.pop > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-weather-rainy/20 text-weather-rainy text-xs font-medium flex-shrink-0">
          <Droplets className="w-3 h-3" />
          {day.pop}%
        </div>
      )}
    </div>
  );
}
