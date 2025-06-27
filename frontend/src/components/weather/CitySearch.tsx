import React, {useEffect, useState} from 'react'
import {Input} from '../ui'
import {SearchResults} from './SearchResults'
import {useAppDispatch, useAppSelector} from '../../hooks'
import {clearSearchResults, fetchSearchedCityWeather, searchCities} from '../../store/slices/weatherSlice'
import type {CitySearchResult} from '../../types'

export const CitySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const dispatch = useAppDispatch()
  const { searchResults } = useAppSelector((state) => state.weather)

  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        dispatch(searchCities(searchQuery))
      }, 300)
      setShowResults(true)
      return () => clearTimeout(timeoutId)
    } else {
      dispatch(clearSearchResults())
      setShowResults(false)
    }
  }, [searchQuery, dispatch])

  const handleCitySelect = (city: CitySearchResult) => {
    setSearchQuery('')
    setShowResults(false)
    dispatch(fetchSearchedCityWeather({ lat: city.lat, lon: city.lon }))
  }

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true)
    }
  }

  const handleInputBlur = () => {
    setTimeout(() => setShowResults(false), 200)
  }

  return (
    <div className="relative max-w-md mx-auto">
      <Input
        placeholder="Search for a city..."
        value={searchQuery}
        onChange={setSearchQuery}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className="text-center"
      />
      <SearchResults
        results={searchResults}
        onSelect={handleCitySelect}
        isVisible={showResults}
      />
    </div>
  )
}