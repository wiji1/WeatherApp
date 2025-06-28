import {AuthType, createEndpointStrict} from "../types";
import {z} from "zod";
import {FavoritesService} from "../../services/FavoritesService";

const removeFavoriteSchema = z.object({
  favoriteId: z.string().min(1)
}).strict();

export interface RemoveFavoriteRequest {
  favoriteId: string;
}

export interface RemoveFavoriteResponse {
  message: string;
}

export const removeFavoriteEndpoint = createEndpointStrict<RemoveFavoriteRequest, RemoveFavoriteResponse>((validate, data) => ({
  path: '/favorites/:favoriteId',
  method: 'delete',
  auth: AuthType.Basic,
  validator: removeFavoriteSchema,
  handler: async (req, _res) => {
    const requestData = data(req.params);
    
    const favoritesService = new FavoritesService();
    await favoritesService.removeFavorite(req.auth!.userId!, requestData.favoriteId);
    
    return validate({ message: 'Favorite removed successfully' });
  }
}));