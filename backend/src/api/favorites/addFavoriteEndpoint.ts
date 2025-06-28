import {Response} from 'express';
import {z} from 'zod';
import {AuthenticatedRequest} from '../../middleware/auth';
import {FavoritesService} from '../../services/FavoritesService';

const addFavoriteSchema = z.object({
  cityName: z.string().min(1, 'City name is required'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  latitude: z.number(),
  longitude: z.number()
});

export const addFavoriteEndpoint = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const validatedData = addFavoriteSchema.parse(req.body);
    
    const favoritesService = new FavoritesService();
    const favorite = await favoritesService.addFavorite(req.userId!, validatedData);
    
    // Try to get weather data for the new favorite
    try {
      const favoriteWithWeather = await favoritesService.getUserFavoritesWithWeather(req.userId!);
      const newFavoriteWithWeather = favoriteWithWeather.find(f => f.id === favorite.id);
      
      res.status(201).json({ 
        success: true, 
        data: newFavoriteWithWeather || favorite 
      });
    } catch (weatherError) {
      // If weather fetch fails, return favorite without weather data
      res.status(201).json({ success: true, data: favorite });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        success: false,
        error: 'Validation error', 
        details: error.errors 
      });
      return;
    }
    
    if (error instanceof Error) {
      if (error.message === 'City is already in favorites') {
        res.status(409).json({ success: false, error: error.message });
        return;
      }
    }
    
    console.error('Add favorite error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};