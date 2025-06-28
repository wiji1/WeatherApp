import React, {useEffect, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../../hooks'
import {fetchFavorites} from '../../store/slices/favoritesSlice'
import {FavoriteCard} from './FavoriteCard'
import {ErrorMessage, LoadingSpinner} from '../ui'

export const FavoritesGallery: React.FC = () => {
  const dispatch = useAppDispatch()
  const { favorites, isLoading, error } = useAppSelector((state) => state.favorites)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchFavorites())
    }
  }, [dispatch, isAuthenticated])

  // Auto-refresh favorites when the component is focused
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        dispatch(fetchFavorites())
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch, isAuthenticated])

  // Refresh favorites periodically to get updated weather data
  useEffect(() => {
    if (!isAuthenticated || favorites.length === 0) return

    const interval = setInterval(() => {
      dispatch(fetchFavorites())
    }, 5 * 60 * 1000) // Refresh every 5 minutes

    return () => clearInterval(interval)
  }, [dispatch, isAuthenticated, favorites.length])

  // Reset current index when favorites change
  useEffect(() => {
    if (currentIndex >= favorites.length && favorites.length > 0) {
      setCurrentIndex(0)
    }
  }, [favorites.length, currentIndex])

  const nextFavorite = () => {
    setCurrentIndex((prev) => (prev + 1) % favorites.length)
  }

  const prevFavorite = () => {
    setCurrentIndex((prev) => (prev - 1 + favorites.length) % favorites.length)
  }

  const goToFavorite = (index: number) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (favorites.length <= 1) return
      
      if (event.key === 'ArrowLeft') {
        prevFavorite()
      } else if (event.key === 'ArrowRight') {
        nextFavorite()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [favorites.length])

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && favorites.length > 1) {
      nextFavorite()
    }
    if (isRightSwipe && favorites.length > 1) {
      prevFavorite()
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (isLoading && favorites.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-4">
        <ErrorMessage message={error} />
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Favorite Cities Yet</h3>
        <p className="text-gray-500 mb-4">
          Search for cities and click the star icon to add them to your favorites!
        </p>
        <p className="text-sm text-gray-400">
          Your favorites will appear here in a beautiful carousel gallery where you can navigate between them.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Favorite Cities</h2>
      
      {/* Carousel Container */}
      <div className="relative max-w-4xl mx-auto">
        {/* Navigation Buttons */}
        {favorites.length > 1 && (
          <>
            <button
              onClick={prevFavorite}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Previous favorite"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={nextFavorite}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Next favorite"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Main Card Display */}
        {favorites[currentIndex] && (
          <div 
            className="flex justify-center touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full max-w-sm transition-all duration-300 ease-in-out transform">
              <FavoriteCard
                key={favorites[currentIndex].id}
                favorite={favorites[currentIndex]}
              />
            </div>
          </div>
        )}

        {/* Dots Indicator */}
        {favorites.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {favorites.map((_, index) => (
              <button
                key={index}
                onClick={() => goToFavorite(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none ${
                  index === currentIndex
                    ? 'bg-blue-600 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to favorite ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Card Counter */}
        {favorites.length > 1 && (
          <div className="text-center mt-4">
            <div className="text-sm text-gray-500 mb-1">
              {currentIndex + 1} of {favorites.length} favorites
            </div>
            <div className="text-xs text-gray-400">
              Use arrow keys, swipe, or click navigation buttons
            </div>
          </div>
        )}
      </div>
    </div>
  )
}