export interface Favorite {
  id: string;
  userId: string;
  cityName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
}

export interface FavoriteRequest {
  cityName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
}

export interface FavoriteWithWeather extends Favorite {
  weather?: {
    temperature: number;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
  };
}