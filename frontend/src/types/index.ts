export interface CitySearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  pressure: number;
  windSpeed: number;
  city: string;
  country: string;
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}