import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {FavoritesService} from "../../services/FavoritesService";

const getFavoritesSchema = z.object({}).strict();

export interface GetFavoritesResponse extends Array<any> {}

export const getFavoritesEndpoint = createEndpointStrict<unknown, GetFavoritesResponse>((validate, data) => ({
  path: '/favorites',
  method: 'get',
  auth: AuthType.Basic,
  validator: getFavoritesSchema,
  handler: async (req, _res) => {
    const favoritesService = new FavoritesService();
    const favorites = await favoritesService.getUserFavoritesWithWeather(req.auth!.userId!);
    
    return validate(favorites);
  }
}));