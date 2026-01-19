import { useState, useEffect, useCallback } from 'react';
import {
  fetchWeatherByCoords,
  fetchWeatherByCity,
  fetchAQI,
  fetchForecast,
  getUserLocation,
  type WeatherData,
  type AQIData,
  type ForecastData,
} from '@/services/weatherService';

interface UseWeatherResult {
  weather: WeatherData | null;
  aqi: AQIData | null;
  forecast: ForecastData[];
  loading: boolean;
  error: string | null;
  searchCity: (city: string) => Promise<void>;
  refreshLocation: () => Promise<void>;
  locationPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [aqi, setAqi] = useState<AQIData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');

  const fetchAllData = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, aqiData, forecastData] = await Promise.all([
        fetchWeatherByCoords(lat, lon),
        fetchAQI(lat, lon),
        fetchForecast(lat, lon),
      ]);

      setWeather(weatherData);
      setAqi(aqiData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchCity = useCallback(async (city: string) => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const weatherData = await fetchWeatherByCity(city);
      setWeather(weatherData);

      const [aqiData, forecastData] = await Promise.all([
        fetchAQI(weatherData.location.lat, weatherData.location.lon),
        fetchForecast(weatherData.location.lat, weatherData.location.lon),
      ]);

      setAqi(aqiData);
      setForecast(forecastData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getUserLocation();
      setLocationPermission('granted');
      await fetchAllData(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      setLocationPermission('denied');
      setError(err instanceof Error ? err.message : 'Failed to get location');
      setLoading(false);
    }
  }, [fetchAllData]);

  // Check permission and get initial location
  useEffect(() => {
    const checkPermissionAndFetch = async () => {
      // Check if we can query permissions
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          setLocationPermission(permission.state as 'granted' | 'denied' | 'prompt');

          permission.onchange = () => {
            setLocationPermission(permission.state as 'granted' | 'denied' | 'prompt');
          };
        } catch {
          setLocationPermission('unknown');
        }
      }

      // Try to get location
      await refreshLocation();
    };

    checkPermissionAndFetch();
  }, [refreshLocation]);

  return {
    weather,
    aqi,
    forecast,
    loading,
    error,
    searchCity,
    refreshLocation,
    locationPermission,
  };
}
