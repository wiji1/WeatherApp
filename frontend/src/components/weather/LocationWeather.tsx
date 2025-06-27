import React, {useEffect} from 'react'
import {Button, ErrorMessage, LoadingSpinner} from '../ui'
import {WeatherCard} from './WeatherCard'
import {useAppDispatch, useAppSelector} from '../../hooks'
import {clearError, getCurrentLocationWeather} from '../../store/slices/weatherSlice'

export const LocationWeather: React.FC = () => {
  const dispatch = useAppDispatch()
  const { currentLocationWeather, loadingLocation, error } = useAppSelector((state) => state.weather)

  useEffect(() => {
    dispatch(getCurrentLocationWeather())
  }, [dispatch])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(getCurrentLocationWeather())
  }

  const handleDismissError = () => {
    dispatch(clearError())
  }

  if (loadingLocation) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Getting your location weather...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <ErrorMessage message={error} onDismiss={handleDismissError} className="mb-4" />
        <div className="text-center">
          <Button onClick={handleRetry} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (currentLocationWeather) {
    return <WeatherCard weather={currentLocationWeather} />
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-600 mb-4">Unable to get your current location weather</p>
      <Button onClick={handleRetry} variant="primary">
        Try Again
      </Button>
    </div>
  )
}