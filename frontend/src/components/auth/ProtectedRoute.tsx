import React, {useEffect} from 'react'
import {useAppDispatch, useAppSelector} from '../../hooks'
import {getCurrentUser, setAuthFromStorage} from '../../store/slices/authSlice'
import {LoadingSpinner} from '../ui'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading, token, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user && !isLoading) {
      dispatch(getCurrentUser())
    } else if (!token) {
      dispatch(setAuthFromStorage())
    }
  }, [dispatch, token, user, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // App component will handle showing AuthPage
  }

  return <>{children}</>
}