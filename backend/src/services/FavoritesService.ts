import {MySQLDatabase} from '../database/mysql';
import {Favorite, FavoriteRequest, FavoriteWithWeather} from '../models/Favorite';
import {WeatherService} from './WeatherService';

export class FavoritesService {
  private db: MySQLDatabase;
  private weatherService: WeatherService;

  constructor() {
    this.db = MySQLDatabase.getInstance();
    this.weatherService = new WeatherService(process.env.OPENWEATHER_API_KEY || 'demo-api-key');
  }

  async addFavorite(userId: string, favoriteData: FavoriteRequest): Promise<Favorite> {
    const favoriteId = this.generateId();
    
    try {
      await this.db.execute(`
        INSERT INTO favorites (id, user_id, city_name, country, state, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        favoriteId,
        userId,
        favoriteData.cityName,
        favoriteData.country,
        favoriteData.state || null,
        favoriteData.latitude,
        favoriteData.longitude
      ]);

      return {
        id: favoriteId,
        userId,
        cityName: favoriteData.cityName,
        country: favoriteData.country,
        state: favoriteData.state,
        latitude: favoriteData.latitude,
        longitude: favoriteData.longitude,
        createdAt: new Date()
      };
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('City is already in favorites');
      }
      throw error;
    }
  }

  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    const [result]: any = await this.db.execute('DELETE FROM favorites WHERE id = ? AND user_id = ?', [favoriteId, userId]);
    
    if (result.affectedRows === 0) {
      throw new Error('Favorite not found');
    }
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const rows = await this.db.query(`
      SELECT id, user_id, city_name, country, state, latitude, longitude, created_at
      FROM favorites 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `, [userId]);
    
    return rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      cityName: row.city_name,
      country: row.country,
      state: row.state,
      latitude: row.latitude,
      longitude: row.longitude,
      createdAt: new Date(row.created_at)
    }));
  }

  async getUserFavoritesWithWeather(userId: string): Promise<FavoriteWithWeather[]> {
    const favorites = await this.getUserFavorites(userId);
    
    const favoritesWithWeather = await Promise.allSettled(
      favorites.map(async (favorite) => {
        try {
          const weather = await this.weatherService.getWeatherByCoordinates(
            favorite.latitude,
            favorite.longitude
          );
          return {
            ...favorite,
            weather: {
              temperature: weather.temperature,
              description: weather.description,
              humidity: weather.humidity,
              pressure: weather.pressure,
              windSpeed: weather.windSpeed
            }
          };
        } catch (error) {
          return favorite;
        }
      })
    );

    return favoritesWithWeather
      .filter((result): result is PromiseFulfilledResult<FavoriteWithWeather> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }

  async isFavorite(userId: string, latitude: number, longitude: number): Promise<boolean> {
    const result = await this.db.query(`
      SELECT COUNT(*) as count 
      FROM favorites 
      WHERE user_id = ? AND latitude = ? AND longitude = ?
    `, [userId, latitude, longitude]);
    
    return result[0].count > 0;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}