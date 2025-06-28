import {Response} from 'express';
import {AuthenticatedRequest} from '../../middleware/auth';
import {FavoritesService} from '../../services/FavoritesService';

export const checkFavoriteEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      res.status(400).json({ success: false, error: 'Latitude and longitude are required' });
      return;
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400).json({ success: false, error: 'Invalid latitude or longitude' });
      return;
    }
    
    const favoritesService = new FavoritesService();
    const isFavorite = await favoritesService.isFavorite(req.userId!, latitude, longitude);
    
    res.json({ success: true, data: { isFavorite } });
  } catch (error) {
    console.error('Check favorite error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};