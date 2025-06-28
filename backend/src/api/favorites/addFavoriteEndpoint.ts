import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {FavoritesService} from "../../services/FavoritesService";

const addFavoriteSchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  latitude: z.number(),
  longitude: z.number()
}).strict();

export interface AddFavoriteRequest {
  cityName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
}

export interface AddFavoriteResponse {
  id: string;
  userId: string;
  cityName: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  weather?: {
    temperature: number;
    description: string;
    humidity: number;
    pressure: number;
    windSpeed: number;
  };
}

export const addFavoriteEndpoint = createEndpointStrict<AddFavoriteRequest, AddFavoriteResponse>((validate, data) => ({
  path: '/favorites',
  method: 'post',
  auth: AuthType.Basic,
  validator: addFavoriteSchema,
  handler: async (req, _res) => {
    const requestData = data(req.body);
    
    const favoritesService = new FavoritesService();
    const favorite = await favoritesService.addFavorite(req.auth!.userId!, requestData);
    
    try {
      const favoriteWithWeather = await favoritesService.getUserFavoritesWithWeather(req.auth!.userId!);
      const newFavoriteWithWeather = favoriteWithWeather.find(f => f.id === favorite.id);
      
      return validate(newFavoriteWithWeather || favorite);
    } catch (weatherError) {
      return validate(favorite);
    }
  }
}));