import React from 'react'
import {Card} from '../ui'
import type {WeatherData} from '../../types'

interface WeatherCardProps {
  weather: WeatherData
  cityName?: string
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ weather, cityName }) => {
  return (
    <Card className="max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
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