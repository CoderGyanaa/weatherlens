import { AQIData } from '@/services/weatherService';
import { Wind, AlertTriangle, Heart, Shield, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AQICardProps {
  aqi: AQIData;
  className?: string;
}

export function AQICard({ aqi, className }: AQICardProps) {
  const getAQINumber = (aqiLevel: number) => {
    // Convert OpenWeatherMap AQI (1-5) to standard US AQI scale approximation
    const aqiRanges = [0, 50, 100, 150, 200, 300];
    return aqiRanges[aqiLevel] || aqiLevel;
  };

  const displayAQI = getAQINumber(aqi.aqi);

  return (
    <div className={cn('glass-card p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-lg">Air Quality</h2>
        </div>
        <AQIBadge color={aqi.color} category={aqi.category} />
      </div>

      {/* AQI Value Display */}
      <div className="flex items-center gap-6 mb-6">
        <div
          className={cn(
            'w-20 h-20 rounded-2xl flex items-center justify-center',
            aqi.color
          )}
        >
          <span className="text-3xl font-display font-bold text-white">
            {displayAQI}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-foreground">Health Impact</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {aqi.healthMessage}
          </p>
        </div>
      </div>

      {/* AQI Scale Indicator */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Good</span>
          <span>Hazardous</span>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-aqi-good via-aqi-moderate via-aqi-unhealthy-sensitive via-aqi-unhealthy via-aqi-very-unhealthy to-aqi-hazardous">
          <div
            className="w-3 h-3 rounded-full bg-white border-2 border-foreground shadow-lg relative -top-0.5"
            style={{
              marginLeft: `calc(${((aqi.aqi - 1) / 4) * 100}% - 6px)`,
            }}
          />
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <PollutantItem label="PM2.5" value={aqi.components.pm2_5} unit="μg/m³" />
        <PollutantItem label="PM10" value={aqi.components.pm10} unit="μg/m³" />
        <PollutantItem label="O₃" value={aqi.components.o3} unit="μg/m³" />
        <PollutantItem label="NO₂" value={aqi.components.no2} unit="μg/m³" />
      </div>

      {/* Daily Advice */}
      <div className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50">
        <div className="flex items-start gap-3">
          {aqi.aqi <= 2 ? (
            <Shield className="w-5 h-5 text-aqi-good mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-aqi-unhealthy mt-0.5" />
          )}
          <div>
            <p className="font-medium text-sm text-foreground mb-1">
              {aqi.aqi <= 2 ? 'Safe for Outdoor Activities' : 'Take Precautions'}
            </p>
            <p className="text-xs text-muted-foreground">
              {aqi.aqi <= 2
                ? 'Great day for outdoor exercise and activities. Enjoy the fresh air!'
                : 'Consider reducing outdoor activities. Wear a mask if going outside.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AQIBadgeProps {
  color: string;
  category: string;
}

function AQIBadge({ color, category }: AQIBadgeProps) {
  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-xs font-semibold text-white',
        color
      )}
    >
      {category}
    </span>
  );
}

interface PollutantItemProps {
  label: string;
  value: number;
  unit: string;
}

function PollutantItem({ label, value, unit }: PollutantItemProps) {
  return (
    <div className="p-3 rounded-lg bg-muted/20 text-center">
      <Activity className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">
        {value.toFixed(1)}
        <span className="text-xs text-muted-foreground ml-1">{unit}</span>
      </p>
    </div>
  );
}
