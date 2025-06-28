import {Response} from 'express';
import {AuthenticatedRequest} from '../../middleware/auth';
import {FavoritesService} from '../../services/FavoritesService';

export const removeFavoriteEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { favoriteId } = req.params;
    
    if (!favoriteId) {
      res.status(400).json({ success: false, error: 'Favorite ID is required' });
      return;
    }
    
    const favoritesService = new FavoritesService();
    await favoritesService.removeFavorite(req.userId!, favoriteId);
    
    res.json({ success: true, message: 'Favorite removed successfully' });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Favorite not found') {
        res.status(404).json({ success: false, error: error.message });
        return;
      }
    }
    
    console.error('Remove favorite error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};