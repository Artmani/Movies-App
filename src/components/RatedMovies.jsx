import React, { useReducer, useContext, useEffect } from 'react'

import { GuestSessionContext } from '../hooks/GuestSessionContext'
import { useNetworkStatus } from '../hooks/useNetworkStatus'

import MovieList from './MovieList'
import OfflineAlert from './OfflineAlert'
import ErrorAlert from './ErrorAlert'
import LoadingIndicator from './LoadingIndicator'

const initialState = {
  isLoading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      throw new Error()
  }
}

function RatedMovies() {
  const { ratedMovies, fetchRatedMovies } = useContext(GuestSessionContext)
  const isOffline = useNetworkStatus()
  const [state, dispatch] = useReducer(reducer, initialState)
  const { isLoading, error } = state

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })

    fetchRatedMovies()
      .catch((err) => dispatch({ type: 'SET_ERROR', payload: err.message }))
      .finally(() => dispatch({ type: 'SET_LOADING', payload: false }))
  }, [])

  if (isLoading) {
    return <LoadingIndicator />
  }

  return (
    <div className="app-container">
      {isOffline && <OfflineAlert />}
      {error && <ErrorAlert message={error} />}
      {ratedMovies.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#999' }}>Оценённых фильмов нет</p>
      ) : (
        <MovieList movies={ratedMovies} onRatingChange={() => {}} />
      )}
    </div>
  )
}

export default RatedMovies
