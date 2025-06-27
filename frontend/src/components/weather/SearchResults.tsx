import React from 'react'
import type {CitySearchResult} from '../../types'

interface SearchResultsProps {
  results: CitySearchResult[]
  onSelect: (city: CitySearchResult) => void
  isVisible: boolean
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onSelect,
  isVisible,
}) => {
  if (!isVisible || results.length === 0) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
      {results.map((city, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(city)}
        >
          <div className="font-medium text-gray-900">{city.name}</div>
          <div className="text-sm text-gray-600">
            {city.state ? `${city.state}, ${city.country}` : city.country}
          </div>
        </div>
      ))}
    </div>
  )
}