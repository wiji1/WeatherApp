import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

export interface FavoriteCity {
  id: string
  userId: string
  cityName: string
  country: string
  state?: string
  latitude: number
  longitude: number
  createdAt: string
  weather?: {
    temperature: number
    description: string
    humidity: number
    pressure: number
    windSpeed: number
  }
}

export interface AddFavoriteRequest {
  cityName: string
  country: string
  state?: string
  latitude: number
  longitude: number
}

export interface FavoritesState {
  favorites: FavoriteCity[]
  isLoading: boolean
  error: string | null
}

const API_BASE_URL = 'http://localhost:3001/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

export const addFavorite = createAsyncThunk<FavoriteCity, AddFavoriteRequest>(
  'favorites/add',
  async (favoriteData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(favoriteData),
      })

      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to add favorite')
      }

      return data.data
    } catch (error) {
      return rejectWithValue('Network error')
    }
  }
)

export const removeFavorite = createAsyncThunk<string, string>(
  'favorites/remove',
  async (favoriteId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to remove favorite')
      }

      return favoriteId
    } catch (error) {
      return rejectWithValue('Network error')
    }
  }
)

export const fetchFavorites = createAsyncThunk<FavoriteCity[], void>(
  'favorites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        headers: getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch favorites')
      }

      return data.data
    } catch (error) {
      return rejectWithValue('Network error')
    }
  }
)

export const checkIsFavorite = createAsyncThunk<boolean, { lat: number; lon: number }>(
  'favorites/check',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/check?lat=${lat}&lon=${lon}`, {
        headers: getAuthHeaders(),
      })

      const data = await response.json()
      
      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to check favorite')
      }

      return data.data.isFavorite
    } catch (error) {
      return rejectWithValue('Network error')
    }
  }
)

const initialState: FavoritesState = {
  favorites: [],
  isLoading: false,
  error: null,
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearFavorites: (state) => {
      state.favorites = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.isLoading = false
        state.favorites.unshift(action.payload)
        state.error = null
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(removeFavorite.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.isLoading = false
        state.favorites = state.favorites.filter(fav => fav.id !== action.payload)
        state.error = null
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false
        state.favorites = action.payload
        state.error = null
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(checkIsFavorite.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearError, clearFavorites } = favoritesSlice.actions
export default favoritesSlice.reducer