import {configureStore} from '@reduxjs/toolkit'
import weatherReducer from './slices/weatherSlice'
import authReducer from './slices/authSlice'
import favoritesReducer from './slices/favoritesSlice'

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    auth: authReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch