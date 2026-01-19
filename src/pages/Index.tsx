import { useWeather } from '@/hooks/useWeather';
import { AnimatedBackground } from '@/components/weather/AnimatedBackground';
import { SearchBar } from '@/components/weather/SearchBar';
import { CurrentWeatherCard } from '@/components/weather/CurrentWeatherCard';
import { AQICard } from '@/components/weather/AQICard';
import { ForecastCard } from '@/components/weather/ForecastCard';
import { InsightsCard } from '@/components/weather/InsightsCard';
import { ThemeToggle } from '@/components/weather/ThemeToggle';
import { LoadingSkeleton } from '@/components/weather/LoadingSkeleton';
import { ErrorState } from '@/components/weather/ErrorState';
import { Cloud, Sparkles } from 'lucide-react';

const Index = () => {
  const {
    weather,
    aqi,
    forecast,
    loading,
    error,
    searchCity,
    refreshLocation,
    locationPermission,
  } = useWeather();

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 backdrop-blur-sm">
              <Cloud className="w-8 h-8 text-primary weather-pulse" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
                WeatherLens
                <Sparkles className="w-5 h-5 text-accent" />
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Human-centric weather insights
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            onSearch={searchCity}
            onRefreshLocation={refreshLocation}
            locationPermission={locationPermission}
            loading={loading}
          />
        </div>

        {/* Content */}
        {loading && !weather ? (
          <LoadingSkeleton />
        ) : error && !weather ? (
          <ErrorState error={error} onRetry={refreshLocation} />
        ) : weather && aqi ? (
          <div className="space-y-6 animate-fade-in">
            {/* Current Weather */}
            <CurrentWeatherCard weather={weather} />

            {/* AQI and Forecast Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AQICard aqi={aqi} />
              <ForecastCard forecast={forecast} />
            </div>

            {/* Insights */}
            <InsightsCard weather={weather} aqi={aqi} />

            {/* Footer */}
            <footer className="text-center py-6 text-sm text-muted-foreground">
              <p>
                Data provided by{' '}
                <a
                  href="https://openweathermap.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  OpenWeatherMap
                </a>
              </p>
              <p className="mt-1 text-xs">
                Last updated: {new Date(weather.timestamp * 1000).toLocaleTimeString()}
              </p>
            </footer>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
