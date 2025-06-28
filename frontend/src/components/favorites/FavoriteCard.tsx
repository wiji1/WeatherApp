import React from 'react'
import {Card, StarButton} from '../ui'
import {useAppDispatch, useAppSelector} from '../../hooks'
import type {FavoriteCity} from '../../store/slices/favoritesSlice'
import {removeFavorite} from '../../store/slices/favoritesSlice'

interface FavoriteCardProps {
  favorite: FavoriteCity
}

export const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite }) => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.favorites)

  const handleRemoveFavorite = async () => {
    try {
      await dispatch(removeFavorite(favorite.id)).unwrap()
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  return (
    <Card className="relative h-full">
      <div className="absolute top-4 right-4">
        <StarButton
          isFavorite={true}
          isLoading={isLoading}
          onClick={handleRemoveFavorite}
        />
      </div>
      
      <div className="text-center pr-12">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {favorite.cityName}, {favorite.country}
          {favorite.state && `, ${favorite.state}`}
        </h3>
        
        {favorite.weather ? (
          <>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(favorite.weather.temperature)}°F
            </div>
            <div className="text-md text-gray-600 mb-4 capitalize">
              {favorite.weather.description}
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
              <div className="text-center">
                <div className="font-semibold">Humidity</div>
                <div>{favorite.weather.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">Pressure</div>
                <div>{favorite.weather.pressure} hPa</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">Wind</div>
                <div>{favorite.weather.windSpeed} mph</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-sm">
            Weather data unavailable
          </div>
        )}
      </div>
    </Card>
  )
}