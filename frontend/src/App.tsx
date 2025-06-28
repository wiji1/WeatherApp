import React, {useEffect} from 'react'
import {Provider} from 'react-redux'
import {store} from './store'
import {AuthPage, Dashboard} from './pages'
import {ProtectedRoute} from './components/auth'
import {useAppDispatch, useAppSelector} from './hooks'
import {getCurrentUser, setAuthFromStorage} from './store/slices/authSlice'

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, token, user, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(setAuthFromStorage())
  }, [dispatch])

  useEffect(() => {
    if (token && !user && !isLoading) {
      dispatch(getCurrentUser())
    }
  }, [dispatch, token, user, isLoading])

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}

export default App