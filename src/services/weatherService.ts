// Weather API service using OpenWeatherMap
const API_KEY = '749e923f28dcd4cf2d664b1c9987c4b2';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    windDeg: string;
    condition: string;
    description: string;
    icon: string;
    uvi?: number;
    clouds: number;
  };
  sun: {
    sunrise: number;
    sunset: number;
  };
  timestamp: number;
}

export interface AQIData {
  aqi: number;
  category: string;
  color: string;
  healthMessage: string;
  components: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

export interface ForecastData {
  date: number;
  temp: {
    min: number;
    max: number;
  };
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  pop: number; // Probability of precipitation
}

// Get AQI category and health message
function getAQIInfo(aqi: number): { category: string; color: string; healthMessage: string } {
  switch (aqi) {
    case 1:
      return {
        category: 'Good',
        color: 'aqi-good',
        healthMessage: 'Air quality is excellent. Safe for all outdoor activities.',
      };
    case 2:
      return {
        category: 'Moderate',
        color: 'aqi-moderate',
        healthMessage: 'Air quality is acceptable. Sensitive individuals should limit prolonged outdoor exposure.',
      };
    case 3:
      return {
        category: 'Unhealthy for Sensitive Groups',
        color: 'aqi-unhealthy-sensitive',
        healthMessage: 'Sensitive groups should reduce outdoor activity. Consider wearing a mask outdoors.',
      };
    case 4:
      return {
        category: 'Unhealthy',
        color: 'aqi-unhealthy',
        healthMessage: 'Everyone may experience health effects. Limit outdoor exposure and wear a mask.',
      };
    case 5:
      return {
        category: 'Very Unhealthy',
        color: 'aqi-very-unhealthy',
        healthMessage: 'Health alert! Avoid all outdoor activities. Stay indoors with air filtration.',
      };
    default:
      return {
        category: 'Hazardous',
        color: 'aqi-hazardous',
        healthMessage: 'Emergency conditions! Everyone should avoid all outdoor activities.',
      };
  }
}

// Convert wind degree to direction
function getWindDirection(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(deg / 22.5) % 16;
  return directions[index];
}

// Fetch weather by coordinates
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherData> {
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch weather data');
  }

  const data = await response.json();

  // Fetch UV index from One Call API (if available)
  let uvi: number | undefined;
  try {
    const uvResponse = await fetch(
      `${BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    if (uvResponse.ok) {
      const uvData = await uvResponse.json();
      uvi = uvData.value;
    }
  } catch {
    // UV index not available
  }

  return {
    location: {
      name: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
    },
    current: {
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000),
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      windDeg: getWindDirection(data.wind.deg),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      uvi,
      clouds: data.clouds.all,
    },
    sun: {
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    },
    timestamp: data.dt,
  };
}

// Fetch weather by city name
export async function fetchWeatherByCity(city: string): Promise<WeatherData> {
  // First get coordinates from city name
  const geoResponse = await fetch(
    `${GEO_URL}/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
  );

  if (!geoResponse.ok) {
    throw new Error('Failed to find city');
  }

  const geoData = await geoResponse.json();

  if (!geoData.length) {
    throw new Error('City not found. Please check the spelling and try again.');
  }

  const { lat, lon } = geoData[0];
  return fetchWeatherByCoords(lat, lon);
}

// Fetch AQI data
export async function fetchAQI(lat: number, lon: number): Promise<AQIData> {
  const response = await fetch(
    `${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch air quality data');
  }

  const data = await response.json();
  const pollution = data.list[0];
  const aqiInfo = getAQIInfo(pollution.main.aqi);

  return {
    aqi: pollution.main.aqi,
    ...aqiInfo,
    components: pollution.components,
  };
}

// Fetch 5-day forecast
export async function fetchForecast(lat: number, lon: number): Promise<ForecastData[]> {
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch forecast data');
  }

  const data = await response.json();

  // Group by day and get daily summary
  const dailyMap = new Map<string, ForecastData>();

  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split('T')[0];

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: item.dt,
        temp: {
          min: Math.round(item.main.temp_min),
          max: Math.round(item.main.temp_max),
        },
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
        pop: Math.round(item.pop * 100),
      });
    } else {
      const existing = dailyMap.get(dateKey)!;
      existing.temp.min = Math.min(existing.temp.min, Math.round(item.main.temp_min));
      existing.temp.max = Math.max(existing.temp.max, Math.round(item.main.temp_max));
    }
  });

  return Array.from(dailyMap.values()).slice(0, 5);
}

// Get user's geolocation
export function getUserLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          reject(new Error('Location access denied. Please enable location or search for a city.'));
          break;
        case error.POSITION_UNAVAILABLE:
          reject(new Error('Location information unavailable. Please search for a city.'));
          break;
        case error.TIMEOUT:
          reject(new Error('Location request timed out. Please try again or search for a city.'));
          break;
        default:
          reject(new Error('Unable to get location. Please search for a city.'));
      }
    }, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    });
  });
}

// Get weather icon URL
export function getWeatherIconUrl(icon: string, size: '2x' | '4x' = '4x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`;
}

// Format time from Unix timestamp
export function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Format date from Unix timestamp
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Get day name from timestamp
export function getDayName(timestamp: number): string {
  const today = new Date();
  const date = new Date(timestamp * 1000);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
