import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {CitySearchResult, GeolocationCoords, WeatherData} from '../../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface WeatherState {
  currentLocationWeather: WeatherData | null
  searchedCityWeather: WeatherData | null
  searchedCityCoords: { lat: number; lon: number } | null
  searchResults: CitySearchResult[]
  loadingLocation: boolean
  loadingSearch: boolean
  error: string | null
  currentLocation: GeolocationCoords | null
}

const initialState: WeatherState = {
  currentLocationWeather: null,
  searchedCityWeather: null,
  searchedCityCoords: null,
  searchResults: [],
  loadingLocation: false,
  loadingSearch: false,
  error: null,
  currentLocation: null,
}

export const searchCities = createAsyncThunk(
  'weather/searchCities',
  async (query: string, { rejectWithValue }) => {
    if (query.length < 2) {
      return []
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/weather/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        return rejectWithValue(data.error)
      }
    } catch {
      return rejectWithValue('Failed to search cities')
    }
  }
)

export const fetchWeatherByCoordinates = createAsyncThunk(
  'weather/fetchByCoordinates',
  async ({ lat, lon }: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather/coordinates?lat=${lat}&lon=${lon}`)
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        return rejectWithValue(data.error)
      }
    } catch {
      return rejectWithValue('Failed to get weather data')
    }
  }
)

export const fetchSearchedCityWeather = createAsyncThunk(
  'weather/fetchSearchedCity',
  async ({ lat, lon }: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/weather/coordinates?lat=${lat}&lon=${lon}`)
      const data = await response.json()
      
      if (data.success) {
        return data.data
      } else {
        return rejectWithValue(data.error)
      }
    } catch {
      return rejectWithValue('Failed to get weather data')
    }
  }
)

export const getCurrentLocationWeather = createAsyncThunk(
  'weather/getCurrentLocation',
  async (_, { rejectWithValue, dispatch }) => {
    return new Promise<WeatherData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(rejectWithValue('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }
          dispatch(setCurrentLocation(coords))
          
          try {
            const result = await dispatch(fetchWeatherByCoordinates({
              lat: coords.latitude,
              lon: coords.longitude,
            })).unwrap()
            resolve(result)
          } catch (error) {
            reject(error)
          }
        },
        (geolocationError) => {
          reject(rejectWithValue(`Geolocation error: ${geolocationError.message}`))
        }
      )
    })
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    clearSearchedCityWeather: (state) => {
      state.searchedCityWeather = null
      state.searchedCityCoords = null
    },
    setCurrentLocation: (state, action: PayloadAction<GeolocationCoords>) => {
      state.currentLocation = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCities.pending, (state) => {
        state.loadingSearch = true
        state.error = null
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.loadingSearch = false
        state.searchResults = action.payload
        state.error = null
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.loadingSearch = false
        state.error = action.payload as string
      })
      .addCase(fetchWeatherByCoordinates.pending, (state) => {
        state.loadingLocation = true
        state.error = null
      })
      .addCase(fetchWeatherByCoordinates.fulfilled, (state, action) => {
        state.loadingLocation = false
        state.currentLocationWeather = action.payload
        state.error = null
      })
      .addCase(fetchWeatherByCoordinates.rejected, (state, action) => {
        state.loadingLocation = false
        state.error = action.payload as string
      })
      .addCase(fetchSearchedCityWeather.pending, (state) => {
        state.loadingSearch = true
        state.error = null
      })
      .addCase(fetchSearchedCityWeather.fulfilled, (state, action) => {
        state.loadingSearch = false
        state.searchedCityWeather = action.payload
        state.searchedCityCoords = action.meta.arg
        state.searchResults = []
        state.error = null
      })
      .addCase(fetchSearchedCityWeather.rejected, (state, action) => {
        state.loadingSearch = false
        state.error = action.payload as string
      })
      .addCase(getCurrentLocationWeather.pending, (state) => {
        state.loadingLocation = true
        state.error = null
      })
      .addCase(getCurrentLocationWeather.fulfilled, (state, action) => {
        state.loadingLocation = false
        state.currentLocationWeather = action.payload
        state.error = null
      })
      .addCase(getCurrentLocationWeather.rejected, (state, action) => {
        state.loadingLocation = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearSearchResults, clearSearchedCityWeather, setCurrentLocation } = weatherSlice.actions
export default weatherSlice.reducer