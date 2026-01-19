import { WeatherData, AQIData } from '@/services/weatherService';
import { 
  Umbrella, 
  Sun, 
  Shirt, 
  Activity, 
  Droplets, 
  Wind,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface InsightsCardProps {
  weather: WeatherData;
  aqi: AQIData;
  className?: string;
}

export function InsightsCard({ weather, aqi, className }: InsightsCardProps) {
  const insights = generateInsights(weather, aqi);

  return (
    <div className={cn('glass-card p-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Info className="w-5 h-5 text-primary" />
        <h2 className="font-display font-semibold text-lg">Today's Insights</h2>
      </div>

      {/* Insights Grid */}
      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <InsightItem key={index} insight={insight} index={index} />
        ))}
      </div>
    </div>
  );
}

interface Insight {
  icon: React.ReactNode;
  title: string;
  message: string;
  type: 'positive' | 'warning' | 'neutral';
}

function generateInsights(weather: WeatherData, aqi: AQIData): Insight[] {
  const insights: Insight[] = [];
  const { current } = weather;

  // Weather-based insights
  if (current.condition === 'Rain' || current.condition === 'Drizzle') {
    insights.push({
      icon: <Umbrella className="w-5 h-5" />,
      title: 'Bring an Umbrella',
      message: "It's raining outside. Don't forget your umbrella if you're heading out.",
      type: 'warning',
    });
  } else if (current.condition === 'Clear' && current.temp > 25) {
    insights.push({
      icon: <Sun className="w-5 h-5" />,
      title: 'Sunny & Warm',
      message: 'Great weather for outdoor activities! Stay hydrated and use sunscreen.',
      type: 'positive',
    });
  } else if (current.condition === 'Clear') {
    insights.push({
      icon: <Sun className="w-5 h-5" />,
      title: 'Clear Skies',
      message: 'Beautiful clear weather. Perfect for a walk or outdoor activities.',
      type: 'positive',
    });
  }

  // Temperature insights
  if (current.feelsLike - current.temp > 3) {
    insights.push({
      icon: <Shirt className="w-5 h-5" />,
      title: 'Feels Warmer',
      message: `Feels ${current.feelsLike - current.temp}° warmer than actual. Dress lighter.`,
      type: 'neutral',
    });
  } else if (current.temp - current.feelsLike > 3) {
    insights.push({
      icon: <Shirt className="w-5 h-5" />,
      title: 'Feels Colder',
      message: `Wind chill makes it feel ${current.temp - current.feelsLike}° colder. Dress warmly.`,
      type: 'warning',
    });
  }

  // Humidity insights
  if (current.humidity > 80) {
    insights.push({
      icon: <Droplets className="w-5 h-5" />,
      title: 'High Humidity',
      message: 'Very humid conditions. Stay cool and drink plenty of water.',
      type: 'warning',
    });
  } else if (current.humidity < 30) {
    insights.push({
      icon: <Droplets className="w-5 h-5" />,
      title: 'Low Humidity',
      message: 'Air is dry. Stay hydrated and use moisturizer if needed.',
      type: 'neutral',
    });
  }

  // Wind insights
  if (current.windSpeed > 40) {
    insights.push({
      icon: <Wind className="w-5 h-5" />,
      title: 'Strong Winds',
      message: 'Windy conditions today. Secure loose items outdoors.',
      type: 'warning',
    });
  }

  // AQI insights
  if (aqi.aqi <= 2) {
    insights.push({
      icon: <Activity className="w-5 h-5" />,
      title: 'Exercise Friendly',
      message: 'Air quality is good. Great conditions for outdoor exercise.',
      type: 'positive',
    });
  } else if (aqi.aqi >= 4) {
    insights.push({
      icon: <Activity className="w-5 h-5" />,
      title: 'Limit Outdoor Exercise',
      message: 'Poor air quality. Consider indoor workouts today.',
      type: 'warning',
    });
  }

  // Always have at least one insight
  if (insights.length === 0) {
    insights.push({
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Pleasant Conditions',
      message: 'Weather conditions are comfortable. Have a great day!',
      type: 'positive',
    });
  }

  return insights.slice(0, 4);
}

interface InsightItemProps {
  insight: Insight;
  index: number;
}

function InsightItem({ insight, index }: InsightItemProps) {
  const bgColors = {
    positive: 'bg-aqi-good/10 border-aqi-good/30',
    warning: 'bg-aqi-moderate/10 border-aqi-moderate/30',
    neutral: 'bg-muted/30 border-muted-foreground/20',
  };

  const iconColors = {
    positive: 'text-aqi-good',
    warning: 'text-aqi-moderate',
    neutral: 'text-muted-foreground',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl border transition-all duration-200',
        'opacity-0 animate-fade-in hover:scale-[1.02]',
        bgColors[insight.type]
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className={cn('p-2 rounded-lg bg-background/50', iconColors[insight.type])}>
        {insight.icon}
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">{insight.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{insight.message}</p>
      </div>
    </div>
  );
}
