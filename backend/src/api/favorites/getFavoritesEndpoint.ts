import {Response} from 'express';
import {AuthenticatedRequest} from '../../middleware/auth';
import {FavoritesService} from '../../services/FavoritesService';

export const getFavoritesEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const favoritesService = new FavoritesService();
    const favorites = await favoritesService.getUserFavoritesWithWeather(req.userId!);
    
    res.json({ success: true, data: favorites });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};