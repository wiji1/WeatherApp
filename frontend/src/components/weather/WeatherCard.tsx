import React, {useEffect, useState} from 'react'
import {Card, StarButton} from '../ui'
import {useAppDispatch, useAppSelector} from '../../hooks'
import {addFavorite, checkIsFavorite, removeFavoriteByCoordinates} from '../../store/slices/favoritesSlice'
import type {WeatherData} from '../../types'

interface WeatherCardProps {
  weather: WeatherData
  cityName?: string
  coordinates?: { lat: number; lon: number }
  showStar?: boolean
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ 
  weather, 
  cityName, 
  coordinates,
  showStar = true 
}) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkingFavorite, setCheckingFavorite] = useState(false)
  
  const dispatch = useAppDispatch()
  const { isLoading, favorites } = useAppSelector((state) => state.favorites)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (coordinates && isAuthenticated && showStar) {
      setCheckingFavorite(true)
      dispatch(checkIsFavorite(coordinates))
        .unwrap()
        .then(setIsFavorite)
        .catch(() => setIsFavorite(false))
        .finally(() => setCheckingFavorite(false))
    }
  }, [coordinates, dispatch, isAuthenticated, showStar])

  useEffect(() => {
    if (coordinates && isAuthenticated && showStar) {
      const isFavoriteInList = favorites.some(
        fav => Math.abs(fav.latitude - coordinates.lat) < 0.001 && Math.abs(fav.longitude - coordinates.lon) < 0.001
      )
      setIsFavorite(isFavoriteInList)
    }
  }, [favorites, coordinates, isAuthenticated, showStar])

  const handleStarClick = async () => {
    if (!coordinates) return

    try {
      if (isFavorite) {
        await dispatch(removeFavoriteByCoordinates({
          lat: coordinates.lat,
          lon: coordinates.lon
        })).unwrap()
        setIsFavorite(false)
      } else {
        await dispatch(addFavorite({
          cityName: cityName || weather.city,
          country: weather.country,
          latitude: coordinates.lat,
          longitude: coordinates.lon
        })).unwrap()
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  return (
    <Card className="max-w-md mx-auto relative">
      {showStar && coordinates && isAuthenticated && (
        <div className="absolute top-4 right-4">
          <StarButton
            isFavorite={isFavorite}
            isLoading={isLoading || checkingFavorite}
            onClick={handleStarClick}
          />
        </div>
      )}
      
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 pr-12">
          {cityName || weather.city}, {weather.country}
        </h2>
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {Math.round(weather.temperature)}°F
        </div>
        <div className="text-lg text-gray-600 mb-4 capitalize">
          {weather.description}
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <div className="font-semibold">Humidity</div>
            <div>{weather.humidity}%</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Pressure</div>
            <div>{weather.pressure} hPa</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Wind</div>
            <div>{weather.windSpeed} mph</div>
          </div>
        </div>
      </div>
    </Card>
  )
}