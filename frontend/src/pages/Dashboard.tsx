import React from 'react'
import {Layout} from '../components/layout'
import {CitySearch, LocationWeather, WeatherCard} from '../components/weather'
import {FavoritesGallery} from '../components/favorites'
import {ErrorMessage} from '../components/ui'
import {useAppDispatch, useAppSelector} from '../hooks'
import {clearError, clearSearchedCityWeather} from '../store/slices/weatherSlice'

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch()
  const { error, searchedCityWeather, searchedCityCoords } = useAppSelector((state) => state.weather)

  const handleDismissError = () => {
    dispatch(clearError())
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Weather Dashboard
          </h2>
          <p className="text-gray-600 mb-8">
            View your current location weather or search for any city
          </p>
        </div>

        {error && (
          <ErrorMessage message={error} onDismiss={handleDismissError} />
        )}

        {/* Favorites Gallery */}
        <div className="mb-12">
          <FavoritesGallery />
        </div>

        {/* Weather Search and Current Location */}
        <div className="max-w-2xl mx-auto space-y-6">
          <CitySearch />
          
          <div className="border-t border-gray-200 pt-6">
            {searchedCityWeather ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Search Results
                  </h3>
                  <button
                    onClick={() => dispatch(clearSearchedCityWeather())}
                    className="text-gray-500 hover:text-gray-700 text-sm underline"
                  >
                    Back to Your Location
                  </button>
                </div>
                <WeatherCard 
                  weather={searchedCityWeather} 
                  coordinates={searchedCityCoords || undefined}
                />
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  Your Location Weather
                </h3>
                <LocationWeather />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}