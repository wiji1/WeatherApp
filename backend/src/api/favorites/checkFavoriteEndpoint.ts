import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {FavoritesService} from "../../services/FavoritesService";

const checkFavoriteSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lon: z.coerce.number().min(-180).max(180)
}).strict();

export interface CheckFavoriteRequest {
  lat: number;
  lon: number;
}

export interface CheckFavoriteResponse {
  isFavorite: boolean;
}

export const checkFavoriteEndpoint = createEndpointStrict<CheckFavoriteRequest, CheckFavoriteResponse>((validate, data) => ({
  path: '/favorites/check',
  method: 'get',
  auth: AuthType.Basic,
  validator: checkFavoriteSchema,
  handler: async (req, _res) => {
    const requestData = data(req.query);
    
    const favoritesService = new FavoritesService();
    const isFavorite = await favoritesService.isFavorite(req.auth!.userId!, requestData.lat, requestData.lon);
    
    return validate({ isFavorite });
  }
}));